use crate::*;

/// DID主账户内容
#[account]
#[derive(InitSpace)]
pub struct DidAccount {
    // 当前持有者
    pub owner: Pubkey,

    // 用户名（唯一）
    #[max_len(256)]
    pub username: String,

    // 创建时间
    pub create_at: i64,

    // 授权（可以更新该账户内容，但不可以操作转账）
    pub authority: Pubkey,

    // 转让次数
    pub transfer_count: u64,

    // 上次转让时间
    pub last_transfer_time: i64,

    // pda bump
    pub bump: u8,
}
