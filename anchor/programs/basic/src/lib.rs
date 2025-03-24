use anchor_lang::prelude::*;

pub mod states;
pub use states::*;
pub mod events;
pub mod instructions;
use instructions::register::*;

declare_id!("BcTk938M3mM9j4ZmK6SxXg1STavBKTEPeNRKnVLzP7pY");

#[program]
pub mod did {

    use super::*;

    /// 注册身份信息指令
    pub fn register(ctx: Context<Register>, username: String) -> Result<()> {
        Register::register(ctx, username)
    }
}
