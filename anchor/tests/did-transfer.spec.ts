import * as anchor from "@coral-xyz/anchor";
import {
    program,
    getDefaultUser,
    createTransactionId,
    createTestDidAcount,
    queryEvents,
} from "./utils/steup";
import { Keypair } from "@solana/web3.js";
import assert from "assert";
import { BN } from "bn.js";

describe("Test DID Profile Update", () => {
    const username = "test_pub_transfer.sol";
    let user: Keypair;

    beforeAll(async () => {
        user = await getDefaultUser();
        await createTestDidAcount(username, user);
    });

    it("Should initiate a public tansfer", async () => {
        let lamports = new BN(100_000);
        let deadline = new BN(Math.floor(Date.now()) / 1000 + 3600);

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

        console.log("Initiate transfer Tx: ", initTransferTx);

        const [newDidPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("did"), Buffer.from(username)],
            program.programId,
        );

        const [transferPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("did_transfer"), newDidPda.toBuffer(), Buffer.from(transactionId)],
            program.programId,
        );
        console.log("transferPda: ", transferPda);
        const transferAccount = await program.account.didTransfer.fetch(transferPda);
        console.log("Transfer account: ", transferAccount);

        assert.equal(transferAccount.currentOwner.toString(), user.publicKey.toString());
        assert.equal(transferAccount.initiator.toString(), user.publicKey.toString());
        assert.equal(transferAccount.didAcceptor, null);
        assert.ok(transferAccount.deadline.eq(deadline));
        assert.ok(transferAccount.lamports.eq(lamports));

        console.log(
            "Initialize transfer event: ",
            await queryEvents(initTransferTx, "transferInitiated"),
        );
    });
});
