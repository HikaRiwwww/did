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
            "name": "createAt",
            "type": "i64"
          },
          {
            "name": "authority",
            "type": "pubkey"
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
    }
  ]
};
