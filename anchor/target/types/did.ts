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
      "name": "notAuthorized",
      "msg": "Not Authorized"
    },
    {
      "code": 6003,
      "name": "onlyOwner",
      "msg": "Only owner allowed"
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
            "name": "auhority",
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
