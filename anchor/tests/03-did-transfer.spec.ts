import * as anchor from "@coral-xyz/anchor";
import {
    program,
    getDefaultUser,
    createTransactionId,
    createTestDidAcount,
    createTestUser,
} from "./utils/steup";
import { Keypair } from "@solana/web3.js";
import assert from "assert";
import { BN } from "bn.js";

describe("Test DID Profile Update", () => {
    const test_username = "test_pub_transfer.sol";
    const lamports = new BN(100_000);
    const deadline = new BN(Math.floor(Date.now()) / 1000 + 3600);
    let user: Keypair;
    let buyer: Keypair;

    async function initPublicSellTransfer(username: string) {
        await createTestDidAcount(username, user);

        const transactionId = await createTransactionId();
        const initTransferTx = await program.methods
            .initiateTransfer({
                transactionId: transactionId,
                deadline: deadline,
                transferType: { sellPublic: {} },
                username: username,
                lamports: lamports,
                didAcceptor: null,
            })
            .accounts({ signer: user.publicKey })
            .signers([user])
            .rpc({ commitment: "confirmed" });

        const [newDidPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("did"), Buffer.from(username)],
            program.programId,
        );
        const [newDidTransferPDA] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("did_transfer"), newDidPda.toBuffer(), Buffer.from(transactionId)],
            program.programId,
        );

        return { newDidPda, newDidTransferPDA, initTransferTx, transactionId };
    }

    beforeAll(async () => {
        user = await getDefaultUser();
        buyer = await createTestUser();
    });

    it("Should initiate a public tansfer", async () => {
        const { newDidPda, newDidTransferPDA, initTransferTx, transactionId } =
            await initPublicSellTransfer(test_username);
        const [transferPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("did_transfer"), newDidPda.toBuffer(), Buffer.from(transactionId)],
            program.programId,
        );

        const transferAccount = await program.account.didTransfer.fetch(transferPda);

        assert.equal(transferAccount.currentOwner.toString(), user.publicKey.toString());
        assert.equal(transferAccount.initiator.toString(), user.publicKey.toString());
        assert.equal(transferAccount.didAcceptor, null);
        assert.ok(transferAccount.deadline.eq(deadline));
        assert.ok(transferAccount.lamports.eq(lamports));
    });

    it("Should confirm a transfer", async () => {
        const username = "to_be_confim.sol";
        const { newDidPda, newDidTransferPDA, initTransferTx, transactionId } =
            await initPublicSellTransfer(username);
        const confirmTx = await program.methods
            .confirmTransfer(username, transactionId)
            .accounts({
                initiator: user.publicKey,
                currentOwner: user.publicKey,
                signer: buyer.publicKey,
            })
            .signers([buyer])
            .rpc({ commitment: "confirmed" });
    });

    it("Should cancel a pending transfer", async () => {
        const username = "to_be_cancled.sol";
        const { newDidPda, newDidTransferPDA, initTransferTx, transactionId } =
            await initPublicSellTransfer(username);
        await program.methods
            .cancelTransfer(username, transactionId)
            .accounts({ signer: user.publicKey })
            .signers([user])
            .rpc({ commitment: "confirmed" });

        const didTransfer = await program.account.didTransfer.fetch(newDidTransferPDA);

        assert.equal(didTransfer.transferStatus.toString(), { cancelled: {} }.toString());
    });
});
