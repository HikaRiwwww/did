/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/did.json`.
 */
export type Did = {
  "address": "BcTk938M3mM9j4ZmK6SxXg1STavBKTEPeNRKnVLzP7pY",
  "metadata": {
    "name": "did",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "cancelTransfer",
      "docs": [
        "取消交易指令"
      ],
      "discriminator": [
        50,
        32,
        70,
        130,
        142,
        41,
        111,
        175
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "didTransfer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  105,
                  100,
                  95,
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "didAccount"
              },
              {
                "kind": "arg",
                "path": "transactionId"
              }
            ]
          }
        },
        {
          "name": "didAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  105,
                  100
                ]
              },
              {
                "kind": "arg",
                "path": "username"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        },
        {
          "name": "transactionId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "confirmTransfer",
      "docs": [
        "确认交易指令"
      ],
      "discriminator": [
        136,
        231,
        254,
        42,
        36,
        94,
        243,
        141
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "didTransfer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  105,
                  100,
                  95,
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "didAccount"
              },
              {
                "kind": "arg",
                "path": "transactionId"
              }
            ]
          }
        },
        {
          "name": "didAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  105,
                  100
                ]
              },
              {
                "kind": "arg",
                "path": "username"
              }
            ]
          }
        },
        {
          "name": "initiator",
          "writable": true
        },
        {
          "name": "currentOwner",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        },
        {
          "name": "transactionId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "initiateTransfer",
      "docs": [
        "发起账户转让交易"
      ],
      "discriminator": [
        128,
        229,
        77,
        5,
        65,
        234,
        228,
        75
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "didAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  105,
                  100
                ]
              },
              {
                "kind": "arg",
                "path": "params.username"
              }
            ]
          }
        },
        {
          "name": "didTransfer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  105,
                  100,
                  95,
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "didAccount"
              },
              {
                "kind": "arg",
                "path": "params.transaction_id"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "initiateTransferParams"
            }
          }
        }
      ]
    },
    {
      "name": "register",
      "docs": [
        "注册身份信息指令"
      ],
      "discriminator": [
        211,
        124,
        67,
        15,
        211,
        194,
        178,
        240
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "didAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  105,
                  100
                ]
              },
              {
                "kind": "arg",
                "path": "username"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateProfile",
      "docs": [
        "更新账户指令"
      ],
      "discriminator": [
        98,
        67,
        99,
        206,
        86,
        115,
        175,
        1
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "didAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  105,
                  100
                ]
              },
              {
                "kind": "arg",
                "path": "username"
              }
            ]
          }
        },
        {
          "name": "profileAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "username"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        },
        {
          "name": "updateParams",
          "type": {
            "defined": {
              "name": "updateProfileParams"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "didAccount",
      "discriminator": [
        77,
        88,
        239,
        141,
        251,
        29,
        237,
        243
      ]
    },
    {
      "name": "didTransfer",
      "discriminator": [
        7,
        125,
        169,
        141,
        253,
        177,
        192,
        31
      ]
    },
    {
      "name": "profile",
      "discriminator": [
        184,
        101,
        165,
        188,
        95,
        63,
        127,
        188
      ]
    }
  ],
  "events": [
    {
      "name": "registerEvent",
      "discriminator": [
        11,
        129,
        9,
        89,
        78,
        136,
        194,
        135
      ]
    },
    {
      "name": "transferCanceled",
      "discriminator": [
        48,
        179,
        211,
        91,
        195,
        142,
        181,
        219
      ]
    },
    {
      "name": "transferConfirmed",
      "discriminator": [
        49,
        14,
        103,
        158,
        58,
        55,
        86,
        66
      ]
    },
    {
      "name": "transferInitiated",
      "discriminator": [
        98,
        214,
        85,
        223,
        47,
        85,
        128,
        184
      ]
    },
    {
      "name": "updateProfileEvent",
      "discriminator": [
        15,
        250,
        133,
        11,
        68,
        57,
        250,
        45
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "nicknameTooLong",
      "msg": "Nickname should be less than 64 characters"
    },
    {
      "code": 6001,
      "name": "avatarUrlTooLong",
      "msg": "Avatar url should be less than 256 characters"
    },
    {
      "code": 6002,
      "name": "accountTooLong",
      "msg": "Account  should be less than 128 characters"
    },
    {
      "code": 6003,
      "name": "notAuthorized",
      "msg": "Not Authorized"
    },
    {
      "code": 6004,
      "name": "onlyOwner",
      "msg": "Only owner allowed"
    },
    {
      "code": 6005,
      "name": "cantTransferToSelf",
      "msg": "Cannot transfer to owner"
    },
    {
      "code": 6006,
      "name": "noAcceptor",
      "msg": "Acceptor cannot be null in private sales"
    },
    {
      "code": 6007,
      "name": "invalidDeadline",
      "msg": "Invalid deadline"
    },
    {
      "code": 6008,
      "name": "invalidAcceptor",
      "msg": "Current signer is not the acceptor"
    },
    {
      "code": 6009,
      "name": "invalidTransferStatus",
      "msg": "Invalid transfer status"
    },
    {
      "code": 6010,
      "name": "transferExpired",
      "msg": "Transfer expired"
    },
    {
      "code": 6011,
      "name": "invalidInitiator",
      "msg": "Invalid initiator"
    },
    {
      "code": 6012,
      "name": "insufficentBalance",
      "msg": "Not enough balance to buy"
    },
    {
      "code": 6013,
      "name": "invalidAmount",
      "msg": "Invalid amount"
    }
  ],
  "types": [
    {
      "name": "didAccount",
      "docs": [
        "DID主账户内容"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "createTime",
            "type": "i64"
          },
          {
            "name": "transferCount",
            "type": "u64"
          },
          {
            "name": "lastTransferTime",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "didTransfer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initiator",
            "type": "pubkey"
          },
          {
            "name": "didAcceptor",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "currentOwner",
            "type": "pubkey"
          },
          {
            "name": "initiateTime",
            "type": "i64"
          },
          {
            "name": "deadline",
            "type": "i64"
          },
          {
            "name": "lastUpdateTime",
            "type": "i64"
          },
          {
            "name": "transferStatus",
            "type": {
              "defined": {
                "name": "didTransferStatus"
              }
            }
          },
          {
            "name": "transferType",
            "type": {
              "defined": {
                "name": "didTransferType"
              }
            }
          },
          {
            "name": "lamports",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "didTransferStatus",
      "docs": [
        "交易状态枚举"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "completed"
          },
          {
            "name": "cancelled"
          }
        ]
      }
    },
    {
      "name": "didTransferType",
      "docs": [
        "交易类型枚举"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "sellPublic"
          },
          {
            "name": "sellPrivate"
          },
          {
            "name": "buyRequest"
          }
        ]
      }
    },
    {
      "name": "initiateTransferParams",
      "docs": [
        "发起交易入参"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "transactionId",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "transferType",
            "type": {
              "defined": {
                "name": "didTransferType"
              }
            }
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "lamports",
            "type": "u64"
          },
          {
            "name": "didAcceptor",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "deadline",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "profile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "didAccount",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "nickname",
            "type": "string"
          },
          {
            "name": "avatar",
            "type": "string"
          },
          {
            "name": "twitter",
            "type": {
              "defined": {
                "name": "visableControlled"
              }
            }
          },
          {
            "name": "github",
            "type": {
              "defined": {
                "name": "visableControlled"
              }
            }
          },
          {
            "name": "discord",
            "type": {
              "defined": {
                "name": "visableControlled"
              }
            }
          },
          {
            "name": "website",
            "type": {
              "defined": {
                "name": "visableControlled"
              }
            }
          },
          {
            "name": "email",
            "type": {
              "defined": {
                "name": "visableControlled"
              }
            }
          },
          {
            "name": "createTime",
            "type": "i64"
          },
          {
            "name": "lastUpdateTime",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "registerEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "createAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "registrant",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "transferCanceled",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "transactionId",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "signer",
            "type": "pubkey"
          },
          {
            "name": "transferType",
            "type": {
              "defined": {
                "name": "didTransferType"
              }
            }
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "cancelTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "transferConfirmed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "transactionId",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "prevOwner",
            "type": "pubkey"
          },
          {
            "name": "newOwner",
            "type": "pubkey"
          },
          {
            "name": "signer",
            "type": "pubkey"
          },
          {
            "name": "confirmTime",
            "type": "i64"
          },
          {
            "name": "lamports",
            "type": "u64"
          },
          {
            "name": "transferType",
            "type": {
              "defined": {
                "name": "didTransferType"
              }
            }
          },
          {
            "name": "username",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "transferInitiated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signer",
            "type": "pubkey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "initiateTime",
            "type": "i64"
          },
          {
            "name": "deadline",
            "type": "i64"
          },
          {
            "name": "lamports",
            "type": "u64"
          },
          {
            "name": "currentOwner",
            "type": "pubkey"
          },
          {
            "name": "didAcceptor",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "transferType",
            "type": {
              "defined": {
                "name": "didTransferType"
              }
            }
          }
        ]
      }
    },
    {
      "name": "updateProfileEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signer",
            "type": "pubkey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "updateTime",
            "type": "i64"
          },
          {
            "name": "profile",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "updateProfileParams",
      "docs": [
        "profile更新入参"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "nickname",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "avatar",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "twitter",
            "type": {
              "option": {
                "defined": {
                  "name": "visableControlled"
                }
              }
            }
          },
          {
            "name": "github",
            "type": {
              "option": {
                "defined": {
                  "name": "visableControlled"
                }
              }
            }
          },
          {
            "name": "discord",
            "type": {
              "option": {
                "defined": {
                  "name": "visableControlled"
                }
              }
            }
          },
          {
            "name": "email",
            "type": {
              "option": {
                "defined": {
                  "name": "visableControlled"
                }
              }
            }
          },
          {
            "name": "website",
            "type": {
              "option": {
                "defined": {
                  "name": "visableControlled"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "visableControlled",
      "docs": [
        "可控制是否可见的数据"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "account",
            "type": "string"
          },
          {
            "name": "visiable",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
