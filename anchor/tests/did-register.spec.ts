import * as anchor from "@coral-xyz/anchor";
import { program, getDefaultUser, queryEvents } from "./utils/steup";
import { Keypair } from "@solana/web3.js";
import assert from "assert";
import { BN } from "bn.js";
import { DEFAULT_USERNAME } from "./utils/consts";

describe("Test DID Register", () => {
    let user: Keypair;
    let didAccount;

    beforeAll(async () => {
        user = await getDefaultUser();
    });

    it("Should register a did account", async () => {
        const [didPDA] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("did"), Buffer.from(DEFAULT_USERNAME)],
            program.programId,
        );

        // 执行交易并获取确认
        const registerTx = await program.methods
            .register(DEFAULT_USERNAME)
            .accounts({
                signer: user.publicKey,
            })
            .signers([user])
            .rpc({ commitment: "confirmed" });

        // 获取已创建的did account
        didAccount = await program.account.didAccount.fetch(didPDA);
        console.log("Created Did Account: ", didAccount);

        assert.equal(didAccount.username, DEFAULT_USERNAME, "Username should match");
        assert.equal(
            didAccount.owner.toString(),
            user.publicKey.toString(),
            "Owner Public key should match",
        );
        assert.ok(didAccount.lastTransferTime.eq(new BN(0)), "Last transfer time should be zero");
        assert.ok(didAccount.transferCount.eq(new BN(0)), "Transfer count should be zero");
    });
});
