use anchor_lang::prelude::*;

#[event]
pub struct RegisterEvent {
    // 用户名（唯一）
    pub username: String,

    // 创建时间
    pub create_at: i64,

    // pda bump
    pub bump: u8,

    //注册者公钥
    pub registrant: Pubkey,
}
