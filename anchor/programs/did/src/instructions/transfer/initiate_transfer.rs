use anchor_lang::prelude::*;

use crate::{
    did_account::DidAccount,
    enums::{DidTransferStatus, DidTransferType},
    error::CustomError,
    events::TransferInitiated,
    transfer::DidTransfer,
};

#[derive(Accounts)]
#[instruction(params: InitiateTransferParams)]
pub struct InitiateTransfer<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"did", params.username.as_bytes()],
        bump,
    )]
    pub did_account: Account<'info, DidAccount>,

    #[account(
        init,
        payer = signer,
        space = 8 + DidTransfer::INIT_SPACE,
        seeds = [b"did_transfer", did_account.key().as_ref(), params.transaction_id.as_ref()],
        bump,
    )]
    pub did_transfer: Account<'info, DidTransfer>,

    pub system_program: Program<'info, System>,
}

impl InitiateTransfer<'_> {
    pub fn initiate_transfer(
        ctx: Context<InitiateTransfer>,
        params: InitiateTransferParams,
    ) -> Result<()> {
        let current_time = Clock::get()?.unix_timestamp;
        require!(params.deadline > current_time, CustomError::InvalidDeadline);

        let did_account = &mut ctx.accounts.did_account;
        let did_transfer = &mut ctx.accounts.did_transfer;
        let signer = ctx.accounts.signer.key();

        // 根据交易类型校验数据
        match params.transfer_type {
            DidTransferType::SellPublic => {
                require!(
                    signer.key() == did_account.owner.key(),
                    CustomError::NotAuthorized
                );
            }
            DidTransferType::SellPrivate => {
                require!(
                    signer.key() == did_account.owner.key(),
                    CustomError::NotAuthorized
                );
                require!(params.did_acceptor.is_some(), CustomError::NoAcceptor);
                let did_acceptor = params.did_acceptor.unwrap();
                require!(
                    did_acceptor.key() != did_account.owner.key(),
                    CustomError::CantTransferToSelf
                );
            }
            DidTransferType::BuyRequest => {
                require!(
                    did_account.owner.key() != signer.key(),
                    CustomError::CantTransferToSelf
                );
            }
        }

        did_transfer.initiator = signer.key();
        did_transfer.did_acceptor = params.did_acceptor;
        did_transfer.current_owner = did_account.owner.key();
        did_transfer.initiate_time = current_time;
        did_transfer.last_update_time = current_time;
        did_transfer.transfer_status = DidTransferStatus::Pending;
        did_transfer.transfer_type = params.transfer_type;
        did_transfer.lamports = params.lamports;
        did_transfer.bump = ctx.bumps.did_transfer;
        did_transfer.deadline = params.deadline;

        emit!(TransferInitiated {
            signer: signer.key(),
            username: params.username,
            initiate_time: current_time,
            deadline: params.deadline,
            lamports: params.lamports,
            current_owner: did_account.owner.key(),
            did_acceptor: params.did_acceptor,
            transfer_type: params.transfer_type,
        });

        Ok(())
    }
}

/// 发起交易入参
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitiateTransferParams {
    pub transaction_id: [u8; 32],

    // 交易类型
    pub transfer_type: DidTransferType,

    // did账户的用户名
    pub username: String,

    // 出价
    pub lamports: u64,

    // 如果是私人交易，需要指定接收方
    pub did_acceptor: Option<Pubkey>,

    // 截止时间
    pub deadline: i64,
}
