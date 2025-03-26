import * as anchor from "@coral-xyz/anchor";
import {
    program,
    getDefaultUser,
    queryEvents,
    createTestDidAcount,
    provider,
    createTestUser,
} from "./utils/steup";
import { Keypair, PublicKey } from "@solana/web3.js";
import assert from "assert";
import {
    DEFAULT_AVATAR,
    DEFAULT_EMAIL,
    DEFAULT_GITHUB,
    DEFAULT_NICKNAME,
    DEFAULT_TWITTER,
    DEFAULT_WEBSITE,
} from "./utils/consts";

describe("Test DID Profile Update", () => {
    const username = "test_profile.sol";
    let user: Keypair;
    let profilePDA: PublicKey;
    let profileAccount;

    beforeAll(async () => {
        user = await getDefaultUser();
        await createTestDidAcount(username, user);
    });

    it("Should create a profile account and update profile", async () => {
        [profilePDA] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("profile"), Buffer.from(username)],
            program.programId,
        );

        const updateParams = {
            authority: null,
            nickname: DEFAULT_NICKNAME,
            avatar: DEFAULT_AVATAR,
            twitter: { account: DEFAULT_TWITTER, visiable: true },
            github: { account: DEFAULT_GITHUB, visiable: true },
            discord: null,
            email: { account: DEFAULT_EMAIL, visiable: false },
            website: { account: DEFAULT_WEBSITE, visiable: true },
        };

        const updateTx1 = await program.methods
            .updateProfile(username, updateParams)
            .accounts({ signer: user.publicKey })
            .signers([user])
            .rpc({ commitment: "confirmed" });

        profileAccount = await program.account.profile.fetch(profilePDA);

        assert.equal(profileAccount.nickname, DEFAULT_NICKNAME, "nickname should match");
        assert.equal(profileAccount.avatar, DEFAULT_AVATAR, "avatar should match");
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
        const authorizedUser = await createTestUser();
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

        await program.methods
            .updateProfile(username, updateParams1)
            .accounts({ signer: user.publicKey })
            .signers([user])
            .rpc();

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
            .rpc({ commitment: "confirmed" });

        profileAccount = await program.account.profile.fetch(profilePDA);
        assert.equal(profileAccount.nickname, newNickname, "New Nickname should be set properly");
    });
});
