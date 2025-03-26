use anchor_lang::prelude::*;

pub mod states;
pub use states::*;
pub mod enums;
pub mod error;
pub mod events;
pub mod instructions;
use instructions::confirm_transfer::*;
use instructions::register::*;
use instructions::transfer::*;
use instructions::update_profile::*;

declare_id!("BcTk938M3mM9j4ZmK6SxXg1STavBKTEPeNRKnVLzP7pY");

#[program]
pub mod did {

    use super::*;

    /// 注册身份信息指令
    pub fn register(ctx: Context<Register>, username: String) -> Result<()> {
        Register::register(ctx, username)
    }

    /// 更新账户指令
    pub fn update_profile(
        ctx: Context<UpdateProfile>,
        username: String,
        update_params: UpdateProfileParams,
    ) -> Result<()> {
        UpdateProfile::update_profile(ctx, username, update_params)
    }

    /// 发起账户转让交易
    pub fn initiate_transfer(
        ctx: Context<InitiateTransfer>,
        params: InitiateTransferParams,
    ) -> Result<()> {
        InitiateTransfer::initiate_transfer(ctx, params)
    }

    /// 确认交易指令
    pub fn confirm_transfer(
        ctx: Context<ConfirmTransfer>,
        username: String,
        transaction_id: [u8; 32],
    ) -> Result<()> {
        ConfirmTransfer::confirm(ctx, username, transaction_id)
    }
}
