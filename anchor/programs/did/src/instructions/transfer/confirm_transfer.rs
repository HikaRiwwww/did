use anchor_lang::prelude::*;

use crate::{
    did_account::DidAccount,
    enums::{DidTransferStatus, DidTransferType},
    error::CustomError,
    events::TransferConfirmed,
    transfer::DidTransfer,
};

#[derive(Accounts)]
#[instruction(username: String, transaction_id: [u8; 32])]
pub struct ConfirmTransfer<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"did_transfer", did_account.key().as_ref(), transaction_id.as_ref()],
        bump,
        constraint = did_transfer.current_owner.key() == did_account.owner.key() @ CustomError::NotAuthorized,
        constraint = did_transfer.initiator.key() != signer.key() @ CustomError::CantTransferToSelf,
        constraint = did_transfer.transfer_status == DidTransferStatus::Pending @ CustomError::InvalidTransferStatus,
    )]
    pub did_transfer: Account<'info, DidTransfer>,

    #[account(
        mut,
        seeds = [b"did", username.as_bytes()],
        bump,
    )]
    pub did_account: Account<'info, DidAccount>,

    /// CHECK: 这是交易的发起人账户，仅用来获取余额
    #[account(
        mut,
        address = did_transfer.initiator @ CustomError::InvalidInitiator,
    )]
    pub initiator: UncheckedAccount<'info>,

    /// CHECK: 这是did当前所有者的账户，仅用来获取余额
    #[account(
        mut,
        address = did_account.owner @ CustomError::NotAuthorized
    )]
    pub current_owner: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl ConfirmTransfer<'_> {
    pub fn confirm(
        ctx: Context<ConfirmTransfer>,
        username: String,
        transaction_id: [u8; 32],
    ) -> Result<()> {
        let current_time = Clock::get()?.unix_timestamp;
        let did_transfer = &mut ctx.accounts.did_transfer;
        let did_account = &mut ctx.accounts.did_account;

        require!(
            did_transfer.deadline >= current_time,
            CustomError::TransferExpired
        );

        let (new_owner, payer, payee) = match did_transfer.transfer_type {
            DidTransferType::SellPrivate => {
                require!(
                    did_transfer.did_acceptor.is_some()
                        && did_transfer.did_acceptor.unwrap() == ctx.accounts.signer.key(),
                    CustomError::InvalidAcceptor
                );
                (
                    ctx.accounts.signer.key(),
                    &ctx.accounts.signer.to_account_info(),
                    &ctx.accounts.current_owner.to_account_info(),
                )
            }

            DidTransferType::SellPublic => (
                ctx.accounts.signer.key(),
                &ctx.accounts.signer.to_account_info(),
                &ctx.accounts.current_owner.to_account_info(),
            ),

            DidTransferType::BuyRequest => {
                require!(
                    ctx.accounts.signer.key() == did_account.owner.key(),
                    CustomError::NotAuthorized
                );

                (
                    ctx.accounts.initiator.key(),
                    &ctx.accounts.initiator.to_account_info(),
                    &ctx.accounts.current_owner.to_account_info(),
                )
            }
        };

        require!(
            did_transfer.lamports > 0,
            CustomError::InvalidAmount
        );
        require!(
            payer.lamports() >= did_transfer.lamports,
            CustomError::InsufficentBalance
        );

        let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
            &payer.key(),
            &payee.key(),
            did_transfer.lamports,
        );

        anchor_lang::solana_program::program::invoke(
            &transfer_ix,
            &[
                payer.to_account_info(),
                payee.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // 更改账户状态
        did_account.owner = new_owner;
        did_account.transfer_count += 1;
        did_account.last_transfer_time = current_time;

        did_transfer.last_update_time = current_time;
        did_transfer.transfer_status = DidTransferStatus::Completed;
        did_transfer.did_acceptor = Some(new_owner);

        // 发布事件
        emit!(TransferConfirmed {
            transaction_id: transaction_id,
            prev_owner: ctx.accounts.current_owner.key(),
            new_owner: did_account.owner,
            signer: ctx.accounts.signer.key(),
            lamports: did_transfer.lamports,
            confirm_time: current_time,
            transfer_type: did_transfer.transfer_type,
            username: username
        });

        Ok(())
    }
}
