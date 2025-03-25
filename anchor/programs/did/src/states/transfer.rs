use anchor_lang::prelude::*;

use crate::enums::{DidTransferStatus, DidTransferType};

#[account]
#[derive(InitSpace)]
pub struct DidTransfer {
    // 交易发起方
    pub initiator: Pubkey,

    // did账户的接收方
    pub did_acceptor: Option<Pubkey>,

    // 当前did持有者
    pub current_owner: Pubkey,

    // 发起时间
    pub initiate_time: i64,

    // 截止时间
    pub deadline: i64,

    // 交易信息最后更新时间
    pub last_update_time: i64,

    // 交易状态枚举
    pub transfer_status: DidTransferStatus,

    // 交易类型枚举
    pub transfer_type: DidTransferType,

    // 出价
    pub lamports: u64,

    // bump
    pub bump: u8,
}
