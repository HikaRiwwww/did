use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError{
    #[msg("Nickname should be less than 64 characters")]
    NicknameTooLong,

    #[msg("Avatar url should be less than 256 characters")]
    AvatarUrlTooLong,

    #[msg("Not Authorized")]
    NotAuthorized,

    #[msg("Only owner allowed")]
    OnlyOwner,
}