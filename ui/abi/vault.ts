import { ABIRoot } from "../node_modules/@thalalabs/surf/build/types/types";

export const VAULT_ABI = {
    "address": "0xe24193f1a406f505817f6d16509b738ab35f8e599d34b2a170b07eba46c59880",
    "name": "manager",
    "friends": [],
    "exposed_functions": [
        {
            "name": "add_funds_to_vault",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "&signer",
                "u64"
            ],
            "return": []
        },
        {
            "name": "deposit",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "&signer",
                "u64",
                "u64"
            ],
            "return": []
        },
        {
            "name": "get_dynamic_interest_rate",
            "visibility": "public",
            "is_entry": false,
            "is_view": true,
            "generic_type_params": [],
            "params": [
                "u64"
            ],
            "return": [
                "u64"
            ]
        },
        {
            "name": "get_repaid",
            "visibility": "public",
            "is_entry": false,
            "is_view": true,
            "generic_type_params": [],
            "params": [
                "address"
            ],
            "return": [
                "u64"
            ]
        },
        {
            "name": "remove_funds_from_vault",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "&signer",
                "u64"
            ],
            "return": []
        },
        {
            "name": "withdraw",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "&signer",
                "u64",
                "u64"
            ],
            "return": []
        }
    ],
    "structs": [
        {
            "name": "MBTC",
            "is_native": false,
            "abilities": [
                "key"
            ],
            "generic_type_params": [],
            "fields": [
                {
                    "name": "dummy_field",
                    "type": "bool"
                }
            ]
        },
        {
            "name": "VaultInfo",
            "is_native": false,
            "abilities": [
                "key"
            ],
            "generic_type_params": [],
            "fields": [
                {
                    "name": "mint_cap",
                    "type": "0x1::coin::MintCapability<0xe24193f1a406f505817f6d16509b738ab35f8e599d34b2a170b07eba46c59880::manager::MBTC>"
                },
                {
                    "name": "burn_cap",
                    "type": "0x1::coin::BurnCapability<0xe24193f1a406f505817f6d16509b738ab35f8e599d34b2a170b07eba46c59880::manager::MBTC>"
                },
                {
                    "name": "total_staked",
                    "type": "u64"
                },
                {
                    "name": "repayed",
                    "type": "0x1::simple_map::SimpleMap<address, u64>"
                },
                {
                    "name": "resource_cap",
                    "type": "0x1::account::SignerCapability"
                }
            ]
        }
    ]
} as const;