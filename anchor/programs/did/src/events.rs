use anchor_lang::prelude::*;

use crate::enums::DidTransferType;

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

#[event]
pub struct UpdateProfileEvent {
    pub signer: Pubkey,

    pub username: String,

    pub update_time: i64,

    pub profile: Pubkey,
}

#[event]
pub struct TransferInitiated {
    pub signer: Pubkey,

    pub username: String,

    pub initiate_time: i64,

    pub deadline: i64,
    
    pub lamports: u64,

    pub current_owner: Pubkey,

    pub did_acceptor: Option<Pubkey>,

    pub transfer_type: DidTransferType,
}

#[event]
pub struct TransferConfirmed{
    pub transaction_id: [u8; 32],

    pub prev_owner: Pubkey,

    pub new_owner: Pubkey,

    pub signer: Pubkey,

    pub confirm_time: i64,

    pub lamports: u64,

    pub transfer_type: DidTransferType,

    pub username: String,
}

#[event]
pub struct TransferCanceled{
    pub transaction_id: [u8; 32],

    pub signer: Pubkey,

    pub transfer_type: DidTransferType,

    pub username: String,

    pub cancel_time: i64,
}