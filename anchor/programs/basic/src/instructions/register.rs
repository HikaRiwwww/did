use crate::{did_account::DidAccount, events::RegisterEvent};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(username: String)]
pub struct Register<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = 8 + DidAccount::INIT_SPACE,
        seeds = [b"did", username.as_bytes()],
        bump,
    )]
    pub did_account: Account<'info, DidAccount>,

    pub system_program: Program<'info, System>,
}

impl Register<'_> {
    pub fn register(ctx: Context<Register>, username: String) -> Result<()> {
        let did_account = &mut ctx.accounts.did_account;
        let owner = &ctx.accounts.signer;
        let clock = Clock::get()?;

        did_account.owner = owner.key();
        did_account.authority = owner.key();
        did_account.username = username.clone();
        did_account.create_at = clock.unix_timestamp;
        did_account.transfer_count = 0;
        did_account.last_transfer_time = 0;
        did_account.bump = ctx.bumps.did_account;

        emit!(RegisterEvent {
            username: did_account.username.clone(),
            create_at: clock.unix_timestamp,
            bump: ctx.bumps.did_account,
            registrant: owner.key(),
        });
        Ok(())
    }
}
