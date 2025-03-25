use anchor_lang::prelude::*;

use crate::error::CustomError;
use crate::profile::{Profile, VisableControlled};
use crate::{did_account::DidAccount, events::UpdateProfileEvent};

#[derive(Accounts)]
#[instruction(username: String, update_params: UpdateProfileParams)]
pub struct UpdateProfile<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"did", username.as_bytes()],
        bump,
    )]
    pub did_account: Account<'info, DidAccount>,

    #[account(
        init_if_needed,
        payer = signer,
        space = 8 + Profile::INIT_SPACE,
        seeds = [b"profile", username.as_bytes()],
        bump,
        constraint = did_account.owner == signer.key() || profile_account.authority == signer.key() @ CustomError::NotAuthorized,
    )]
    pub profile_account: Account<'info, Profile>,

    pub system_program: Program<'info, System>,
}

impl UpdateProfile<'_> {
    /// 更新账户信息
    pub fn update_profile(
        ctx: Context<UpdateProfile>,
        username: String,
        update_params: UpdateProfileParams,
    ) -> Result<()> {
        update_params.validate()?;
        let profile = &mut ctx.accounts.profile_account;
        let did_account = &mut ctx.accounts.did_account;
        let time = Clock::get()?.unix_timestamp;

        // 首次创建时设置初始值
        if profile.did_account == Pubkey::default() {
            profile.did_account = did_account.key();
            profile.authority = ctx.accounts.signer.key();
            profile.create_time = time;
        }

        if let Some(authority) = update_params.authority {
            require!(
                ctx.accounts.signer.key() == did_account.owner.key(),
                CustomError::OnlyOwner
            );
            profile.authority = authority;
        }

        if let Some(nickname) = update_params.nickname {
            profile.nickname = nickname;
        }

        if let Some(avatar) = update_params.avatar {
            profile.avatar = avatar;
        }

        if let Some(twitter) = update_params.twitter {
            profile.twitter = twitter;
        }

        if let Some(github) = update_params.github {
            profile.github = github;
        }

        if let Some(discord) = update_params.discord {
            profile.discord = discord;
        }

        if let Some(website) = update_params.website {
            profile.website = website;
        }

        if let Some(email) = update_params.email {
            profile.email = email;
        }

        if did_account.bump == 0 && ctx.bumps.did_account != 0 {
            did_account.bump = ctx.bumps.did_account;
        }

        if profile.bump == 0 && ctx.bumps.profile_account != 0 {
            profile.bump = ctx.bumps.profile_account;
        }
        profile.last_update_time = time;

        emit!(UpdateProfileEvent {
            signer: ctx.accounts.signer.key(),
            username: username,
            update_time: time,
            profile: ctx.accounts.profile_account.key(),
        });
        Ok(())
    }
}

/// profile更新入参
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateProfileParams {
    // 授权可修改此账户的公钥
    pub authority: Option<Pubkey>,

    // 昵称
    pub nickname: Option<String>,

    // 头像
    pub avatar: Option<String>,

    pub twitter: Option<VisableControlled>,

    pub github: Option<VisableControlled>,

    pub discord: Option<VisableControlled>,

    pub email: Option<VisableControlled>,

    pub website: Option<VisableControlled>,
}

impl UpdateProfileParams {
    pub fn validate(&self) -> Result<()> {
        if let Some(nickname) = &self.nickname {
            require!(nickname.len() <= 64, CustomError::NicknameTooLong);
        }

        if let Some(avatar) = &self.avatar {
            require!(avatar.len() <= 256, CustomError::AvatarUrlTooLong);
        }

        if let Some(twitter) = &self.twitter {
            require!(twitter.account.len() < 128, CustomError::AccountTooLong);
        }
        if let Some(github) = &self.github {
            require!(github.account.len() < 128, CustomError::AccountTooLong);
        }
        if let Some(email) = &self.email {
            require!(email.account.len() < 128, CustomError::AccountTooLong);
        }
        if let Some(discord) = &self.discord {
            require!(discord.account.len() < 128, CustomError::AccountTooLong);
        }
        if let Some(website) = &self.website {
            require!(website.account.len() < 128, CustomError::AccountTooLong);
        }
        Ok(())
    }
}
