use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError{
    #[msg("Nickname should be less than 64 characters")]
    NicknameTooLong,

    #[msg("Avatar url should be less than 256 characters")]
    AvatarUrlTooLong,

    #[msg("Account  should be less than 128 characters")]
    AccountTooLong,

    #[msg("Not Authorized")]
    NotAuthorized,

    #[msg("Only owner allowed")]
    OnlyOwner,

    #[msg("Cannot transfer to owner")]
    CantTransferToSelf,

    #[msg("Acceptor cannot be null in private sales")]
    NoAcceptor,

    #[msg("Invalid deadline")]
    InvalidDeadline,
}