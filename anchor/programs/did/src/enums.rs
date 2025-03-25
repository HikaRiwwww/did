use anchor_lang::prelude::*;

/// 交易状态枚举
#[derive(AnchorDeserialize, AnchorSerialize, Clone, PartialEq, Eq, InitSpace)]
pub enum DidTransferStatus {
    // 发起中
    Pending,

    // 已完成
    Completed,

    // 已取消
    Cancelled,
}

/// 交易类型枚举
#[derive(AnchorDeserialize, AnchorSerialize, Clone, PartialEq, Eq, InitSpace, Copy)]
pub enum DidTransferType {
    // 公开卖出
    SellPublic,

    // 指定卖出
    SellPrivate,

    // 请求买入
    BuyRequest,
}
