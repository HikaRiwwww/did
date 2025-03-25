use anchor_lang::prelude::*;

pub mod states;
pub use states::*;
pub mod error;
pub mod events;
pub mod instructions;
use instructions::register::*;
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
    pub fn update_profile(ctx: Context<UpdateProfile>, username: String, update_params: UpdateProfileParams) -> Result<()> {
        UpdateProfile::update_profile(ctx, username, update_params)
    }
}
