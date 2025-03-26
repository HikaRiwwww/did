import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Did } from "../../target/types/did";
import { Keypair, TransactionSignature } from "@solana/web3.js";

console.log("Setting up test evn...");

// 初始化本地环境
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = anchor.workspace.Did as Program<Did>;
let DEFAULT_USER: Keypair;

export async function createTestUser() {
    const user = anchor.web3.Keypair.generate();
    const airdropSignature = await provider.connection.requestAirdrop(
        user.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL,
    );
    const latestBlockhash = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction({
        signature: airdropSignature,
        ...latestBlockhash,
    });
    return user;
}

export async function createTestDidAcount(username: string, signer: Keypair) {
    const [didPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("did"), Buffer.from(username)],
        program.programId,
    );
    await program.methods
        .register(username)
        .accounts({
            signer: signer.publicKey,
        })
        .signers([signer])
        .rpc({ commitment: "confirmed" });
    return await program.account.didAccount.fetch(didPDA);
}

export async function getDefaultUser() {
    if (!DEFAULT_USER) {
        DEFAULT_USER = await createTestUser();
    }
    return DEFAULT_USER;
}

export async function queryEvents(transactionSignature: TransactionSignature, eventName: string) {
    // 获取交易详情
    const txDetails = await provider.connection.getParsedTransaction(
        transactionSignature,
        "confirmed",
    );
    // 解析事件日志
    const eventParser = new anchor.EventParser(
        program.programId,
        new anchor.BorshCoder(program.idl),
    );
    const events = eventParser.parseLogs(txDetails?.meta?.logMessages || []);
    // 将Generator转换为数组，然后使用find
    const eventsArray = [...events];
    const registerEvent = eventsArray.find(event => event.name === eventName);
    return registerEvent;
}

export async function createTransactionId() {
    const keypair = anchor.web3.Keypair.generate();
    return Array.from(keypair.publicKey.toBytes());
}

// 导出其他变量
export { provider, program };
