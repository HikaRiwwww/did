use crate::*;

#[account]
#[derive(InitSpace)]
pub struct Profile {
    // 关联的did账户
    pub did_account: Pubkey,

    // 授权更新账户
    pub authority: Pubkey,

    // 昵称
    #[max_len(64)]
    pub nickname: String,

    // 头像地址
    #[max_len(256)]
    pub avatar: String,

    pub twitter: VisableControlled,

    pub github: VisableControlled,

    pub discord: VisableControlled,

    pub website: VisableControlled,

    pub email: VisableControlled,

    pub create_time: i64,

    pub last_update_time: i64,

    pub bump: u8,
}

/// 可控制是否可见的数据
#[derive(AnchorSerialize, AnchorDeserialize, InitSpace, Clone)]
pub struct VisableControlled {
    #[max_len(128)]
    pub account: String,

    pub visiable: bool,
}
