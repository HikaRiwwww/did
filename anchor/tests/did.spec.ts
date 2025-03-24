import * as anchor from "@coral-xyz/anchor";
import assert from "assert";
import { Program } from "@coral-xyz/anchor";
import { Did } from "../target/types/did";
import { Keypair } from "@solana/web3.js";
import { BN } from "bn.js";

describe("basic", () => {
  // 初始化本地环境
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  console.log("Current Public Key: ", provider.wallet.publicKey);

  const program = anchor.workspace.Did as Program<Did>;

  let user: Keypair;
  beforeAll(async () => {
    // 创建用户，领取空投
    user = anchor.web3.Keypair.generate();
    console.log("Current User Public Key: ", user.publicKey);
    const airdropSignature = await provider.connection.requestAirdrop(
      user.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    const latestBlockhash = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction({
      signature: airdropSignature,
      ...latestBlockhash,
    });

    console.log(
      "User balance: ",
      provider.connection.getBalance(user.publicKey)
    );
  });

  it("Should register a did account", async () => {
    const username = "testaccount.sol";
    const [didPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("did"), Buffer.from(username)],
      program.programId
    );

    // 执行交易并获取确认
    const registerTx = await program.methods
      .register(username)
      .accounts({
        signer: user.publicKey,
      })
      .signers([user])
      .rpc({ commitment: "confirmed" });

    console.log("Register Account Tx: ", registerTx);

    // 获取交易详情
    const txDetails = await provider.connection.getParsedTransaction(
      registerTx,
      "confirmed"
    );

    // 解析事件日志
    const eventParser = new anchor.EventParser(
      program.programId,
      new anchor.BorshCoder(program.idl)
    );
    const events = eventParser.parseLogs(txDetails?.meta?.logMessages || []);

    // 将Generator转换为数组，然后使用find
    const eventsArray = [...events];
    const registerEvent = eventsArray.find(
      (event) => event.name === "registerEvent"
    );
    console.log("Register Event:", registerEvent);

    // 获取已创建的did account
    const did_account = await program.account.didAccount.fetch(didPDA);
    console.log("Created Did Account: ", did_account);

    assert.equal(did_account.username, username, "Username should match");
    assert.equal(
      did_account.authority.toString(),
      user.publicKey.toString(),
      "Authority Public key should match"
    );
    assert.equal(
      did_account.owner.toString(),
      user.publicKey.toString(),
      "Owner Public key should match"
    );
    assert.ok(
      did_account.lastTransferTime.eq(new BN(0)),
      "Last transfer time should be zero"
    );
    assert.ok(
      did_account.transferCount.eq(new BN(0)),
      "Transfer count should be zero"
    );
  });
});
