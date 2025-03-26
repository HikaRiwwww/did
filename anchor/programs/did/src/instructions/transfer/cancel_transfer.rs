use anchor_lang::prelude::*;

use crate::{
    did_account::DidAccount, enums::DidTransferStatus, error::CustomError,
    events::TransferCanceled, transfer::DidTransfer,
};

#[derive(Accounts)]
#[instruction(username: String, transaction_id: [u8; 32])]
pub struct CancelTransfer<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"did_transfer", did_account.key().as_ref(), transaction_id.as_ref()],
        bump,
        constraint = did_transfer.initiator == signer.key() @ CustomError::NotAuthorized,
        constraint = did_transfer.transfer_status == DidTransferStatus::Pending @ CustomError::InvalidTransferStatus
    )]
    pub did_transfer: Account<'info, DidTransfer>,

    #[account(
        mut,
        seeds = [b"did", username.as_bytes()],
        bump,
    )]
    pub did_account: Account<'info, DidAccount>,

    pub system_program: Program<'info, System>,
}

impl CancelTransfer<'_> {
    pub fn cancel(
        ctx: Context<CancelTransfer>,
        username: String,
        transaction_id: [u8; 32],
    ) -> Result<()> {
        let current_time = Clock::get()?.unix_timestamp;
        let did_transfer = &mut ctx.accounts.did_transfer;
        did_transfer.transfer_status = DidTransferStatus::Cancelled;
        did_transfer.last_update_time = current_time;

        emit!(TransferCanceled {
            transaction_id: transaction_id,
            signer: ctx.accounts.signer.key(),
            transfer_type: did_transfer.transfer_type,
            username: username,
            cancel_time: current_time,
        });
        Ok(())
    }
}
