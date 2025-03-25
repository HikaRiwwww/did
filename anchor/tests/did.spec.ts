import * as anchor from "@coral-xyz/anchor";
import assert from "assert";
import { Program } from "@coral-xyz/anchor";
import { Did } from "../target/types/did";
import { Keypair, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";
import { buffer } from "stream/consumers";

describe("basic", () => {
    // 初始化本地环境
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    console.log("Current Public Key: ", provider.wallet.publicKey);

    const program = anchor.workspace.Did as Program<Did>;
    const username = "testaccount.sol";
    const nickname = "bunny";
    const avatar = "http://doge.jpg";
    const twitter = "@test_user";
    const github = "https://github.com/HikaRiwwww";
    const website = "https://github.com/HikaRiwwww";
    const email = "testuser_123@gmail.com";

    let user: Keypair;
    let authorizedUser: Keypair;
    let buyer: Keypair;
    let didAccount;
    let profilePDA: PublicKey;
    let profileAccount;

    beforeAll(async () => {
        // 创建用户，领取空投
        user = anchor.web3.Keypair.generate();
        buyer = anchor.web3.Keypair.generate();
        console.log("Current User Public Key: ", user.publicKey);
        const airdropSignature = await provider.connection.requestAirdrop(
            user.publicKey,
            2 * anchor.web3.LAMPORTS_PER_SOL,
        );
        const latestBlockhash = await provider.connection.getLatestBlockhash();
        await provider.connection.confirmTransaction({
            signature: airdropSignature,
            ...latestBlockhash,
        });

        const airdropSignature2 = await provider.connection.requestAirdrop(
            buyer.publicKey,
            2 * anchor.web3.LAMPORTS_PER_SOL,
        );
        const latestBlockhash2 = await provider.connection.getLatestBlockhash();
        await provider.connection.confirmTransaction({
            signature: airdropSignature2,
            ...latestBlockhash2,
        });

        console.log("Buyer balance: ", provider.connection.getBalance(buyer.publicKey));
    });

    it("Should register a did account", async () => {
        const [didPDA] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("did"), Buffer.from(username)],
            program.programId,
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
        const txDetails = await provider.connection.getParsedTransaction(registerTx, "confirmed");

        // 解析事件日志
        const eventParser = new anchor.EventParser(
            program.programId,
            new anchor.BorshCoder(program.idl),
        );
        const events = eventParser.parseLogs(txDetails?.meta?.logMessages || []);

        // 将Generator转换为数组，然后使用find
        const eventsArray = [...events];
        const registerEvent = eventsArray.find(event => event.name === "registerEvent");
        console.log("Register Event:", registerEvent);

        // 获取已创建的did account
        didAccount = await program.account.didAccount.fetch(didPDA);
        console.log("Created Did Account: ", didAccount);

        assert.equal(didAccount.username, username, "Username should match");
        assert.equal(
            didAccount.owner.toString(),
            user.publicKey.toString(),
            "Owner Public key should match",
        );
        assert.ok(didAccount.lastTransferTime.eq(new BN(0)), "Last transfer time should be zero");
        assert.ok(didAccount.transferCount.eq(new BN(0)), "Transfer count should be zero");
    });

    it("Should create a profile account and update profile", async () => {
        const updateParams = {
            authority: null,
            nickname: nickname,
            avatar: avatar,
            twitter: { account: twitter, visiable: true },
            github: { account: github, visiable: true },
            discord: null,
            email: { account: email, visiable: false },
            website: { account: website, visiable: true },
        };

        const updateTx1 = await program.methods
            .updateProfile(username, updateParams)
            .accounts({ signer: user.publicKey })
            .signers([user])
            .rpc();
        console.log("Update profile tx1: ", updateTx1);

        [profilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("profile"), Buffer.from(username)],
            program.programId,
        );
        profileAccount = await program.account.profile.fetch(profilePDA);
        console.log(profileAccount);
        assert.equal(profileAccount.nickname, nickname, "nickname should match");
        assert.equal(profileAccount.avatar, avatar, "avatar should match");
        assert.equal(
            profileAccount.twitter.account,
            updateParams.twitter.account,
            "twitter account should match",
        );
        assert.equal(
            profileAccount.twitter.visiable,
            updateParams.twitter.visiable,
            "twitter visible should match",
        );
        assert.equal(
            profileAccount.github.account,
            updateParams.github.account,
            "github account should match",
        );
        assert.equal(
            profileAccount.github.visiable,
            updateParams.github.visiable,
            "github visible should match",
        );
        assert.equal(
            profileAccount.email.account,
            updateParams.email.account,
            "email address should match",
        );
        assert.equal(
            profileAccount.email.visiable,
            updateParams.email.visiable,
            "email visiable should match",
        );
        assert.equal(
            profileAccount.website.account,
            updateParams.website.account,
            "website account should match",
        );
        assert.equal(
            profileAccount.website.visiable,
            updateParams.website.visiable,
            "website visiable should match",
        );
    });

    it("Should authorize to another user and the user can update profile", async () => {
        authorizedUser = anchor.web3.Keypair.generate();
        const updateParams1 = {
            authority: authorizedUser.publicKey,
            nickname: null,
            avatar: null,
            twitter: null,
            github: null,
            discord: null,
            email: null,
            website: null,
        };

        const authTx = await program.methods
            .updateProfile(username, updateParams1)
            .accounts({ signer: user.publicKey })
            .signers([user])
            .rpc();

        console.log("Authorize Tx: ", authTx);

        profileAccount = await program.account.profile.fetch(profilePDA);
        assert.equal(
            profileAccount.authority.toString(),
            authorizedUser.publicKey.toString(),
            "Authorized user public key should match",
        );

        const newNickname = "kitty";
        const updateParams2 = {
            authority: null,
            nickname: newNickname,
            avatar: null,
            twitter: null,
            github: null,
            discord: null,
            email: null,
            website: null,
        };

        const updateTx2 = await program.methods
            .updateProfile(username, updateParams2)
            .accounts({ signer: authorizedUser.publicKey })
            .signers([authorizedUser])
            .rpc();

        console.log("Update Tx2: ", updateTx2);

        profileAccount = await program.account.profile.fetch(profilePDA);
        console.log(profileAccount);
        assert.equal(profileAccount.nickname, newNickname, "New Nickname should be set properly");
    });

    it("Should initiate a public tansfer", async () => {
        let newUsername = "test_pub_transfer.sol";
        let lamports = new BN(100_000);
        let deadline = new BN(Math.floor(Date.now()) / 1000 + 3600);
        // 创建一个新的DID
        await program.methods
            .register(newUsername)
            .accounts({
                signer: user.publicKey,
            })
            .signers([user])
            .rpc({ commitment: "confirmed" });
        const keypair = anchor.web3.Keypair.generate();
        const transactionId = Array.from(keypair.publicKey.toBytes());
        const initTransferTx = await program.methods
            .initiateTransfer({
                transactionId: transactionId,
                deadline: deadline,
                transferType: { sellPublic: {} },
                username: newUsername,
                lamports: lamports,
                didAcceptor: null,
            })
            .accounts({ signer: user.publicKey })
            .signers([user])
            .rpc();

        console.log("Initiate transfer Tx: ", initTransferTx);

        const [newDidPda] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("did"), Buffer.from(newUsername)],
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
    });
});
