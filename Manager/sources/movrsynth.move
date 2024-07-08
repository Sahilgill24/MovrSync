// Copyright 2023 ComingChat Authors. Licensed under Apache-2.0 License.
module my_addrx::Vault {


use std::signer;
use std::vector;
use std::simple_map::{Self, SimpleMap};
use std::account;


struct DepositList has key {
    deposit_list:SimpleMap<address,u64>,
}

public entry fun add_depositor(acc:&signer,amount:u64) acquires DepositList{
    let addr=signer::address_of(acc);
    let deposit_store=DepositList {
        deposit_list:simple_map::create(),
    };

    
    }

  

}