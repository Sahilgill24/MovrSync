module vault::manager {
    use std::string;
    use std::signer;
    use std::option;
    use std::simple_map::{Self, SimpleMap};

    use aptos_framework::coin;
    use aptos_framework::account;
    use aptos_framework::aptos_coin::{AptosCoin};

    const ENOT_INIT: u64 = 0;
    const ENOT_ENOUGH_METH: u64 = 1;
    const ENOT_DEPLOYER_ADDRESS: u64 = 2;

    struct METH has key {}

    struct VaultInfo has key {
        mint_cap: coin::MintCapability<METH>,
        burn_cap: coin::BurnCapability<METH>,
        total_staked: u64,
        repayed: SimpleMap<address, u64>,
        resource_cap: account::SignerCapability,
        
        
    }
    

    /// Constructor
    fun init_module(sender: &signer) {
        // Only owner can create admin.
        assert!(signer::address_of(sender) == @vault, ENOT_DEPLOYER_ADDRESS);

        // Create a resource account to hold the funds.
        let (resource, resource_cap) = account::create_resource_account(sender, x"01");
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<METH>(
            sender,
            string::utf8(b"METH Token"),
            string::utf8(b"METH"),
            18,
            false,
        );

        // We don't need to freeze the tokens.
        coin::destroy_freeze_cap(freeze_cap);

        // Register the resource account.
        coin::register<METH>(sender);
        coin::register<AptosCoin>(&resource);
        // coin::register<METH>(&resource);

        move_to(
            sender,
            VaultInfo {
                mint_cap: mint_cap,
                burn_cap: burn_cap,
                total_staked: 0,
                repayed: simple_map::create(),
                resource_cap: resource_cap,
                
                
            },
        );

        
    }

    /// Signet deposits `amount` amount of METH into the vault.
    /// METH tokens to mint = (token_amount / total_staked_amount) * total_lp_supply
    public entry fun deposit(
        sender: &signer, amountInMove: u64, amountOutUSD: u64
    ) acquires VaultInfo {
        let sender_addr = signer::address_of(sender);
        assert!(exists<VaultInfo>(@vault), ENOT_INIT);


        let vault_info = borrow_global_mut<VaultInfo>(@vault);
        let resource_signer =
            account::create_signer_with_capability(&vault_info.resource_cap);
        let resource_addr = signer::address_of(&resource_signer);
        // Deposite some amount of tokens and mint shares.
        coin::transfer<AptosCoin>(sender, resource_addr, amountInMove);

        vault_info.total_staked = vault_info.total_staked + amountOutUSD;
        simple_map::add(&mut vault_info.repayed, sender_addr, 0);
        // Mint shares
        coin::deposit<METH>(
            sender_addr,
            coin::mint<METH>(amountOutUSD, &vault_info.mint_cap),
        );

    }

    /// Withdraw some amount of AptosCoin based on total_staked of METH token.
    public entry fun withdraw(
        sender: &signer, amountInMETH: u64, amountOutMove: u64
    ) acquires VaultInfo {
        let sender_addr = signer::address_of(sender);
        assert!(exists<VaultInfo>(@vault), ENOT_INIT);

        let vault_info = borrow_global_mut<VaultInfo>(@vault);

        // Make sure resource sender's account has enough METH tokens.
        assert!(coin::balance<METH>(sender_addr) >= amountInMETH, ENOT_ENOUGH_METH);

        // Burn METH tokens of user
        coin::burn<METH>(
            coin::withdraw<METH>(sender, amountInMETH), &vault_info.burn_cap
        );

        let resource_account_from_cap: signer =
            account::create_signer_with_capability(&vault_info.resource_cap);
        coin::transfer<AptosCoin>(&resource_account_from_cap, sender_addr, amountOutMove);

        // Update the info in the VaultInfo.
        vault_info.total_staked = vault_info.total_staked - amountInMETH;

        let repayed_amount =
            simple_map::borrow_mut(&mut vault_info.repayed, &sender_addr);
        *repayed_amount = *repayed_amount + amountInMETH;

    }


    #[view]
    // As only integer calculations occur here , we would return this value 
    // and do the calculation in the JS code
    // will be based on the volatility of the market
    //This will be called for the BTC part and the calculations shall be done there
    public fun get_dynamic_interest_rate(account: address, amount: u64): u64 acquires VaultInfo{
        let vault_info = borrow_global<VaultInfo>(@vault);
        let contrib_inv = vault_info.total_staked / amount;
        return contrib_inv
    }


    #[view]
    public fun get_repaid(account: address): u64 acquires VaultInfo {
        assert!(exists<VaultInfo>(@vault), ENOT_INIT);
        let repayed_map = borrow_global<VaultInfo>(@vault).repayed;
        let val = simple_map::borrow(&repayed_map, &account);
        return*val
    }

    /// Admin can add more amount into the pool thus increasing the total_staked amount
    /// but the shares are still same to user's will be able to claim more amount of `AptosCoin` back
    /// than their investments.
    public entry fun add_funds_to_vault(sender: &signer, amount: u64) acquires VaultInfo {
        let sender_addr = signer::address_of(sender);
        // Only owner can create admin.
        assert!(sender_addr == @vault, ENOT_DEPLOYER_ADDRESS);
        assert!(exists<VaultInfo>(sender_addr), ENOT_INIT);

        let vault_info = borrow_global_mut<VaultInfo>(sender_addr);
        let resource_signer =
            account::create_signer_with_capability(&vault_info.resource_cap);
        let resource_addr = signer::address_of(&resource_signer);
        coin::transfer<AptosCoin>(sender, resource_addr, amount);

        // Update the `total_staked` value
        vault_info.total_staked = vault_info.total_staked + amount;
    }

    /// Admin can remove funds and invest somewhere else.
    public entry fun remove_funds_from_vault(sender: &signer, amount: u64) acquires VaultInfo {
        let sender_addr = signer::address_of(sender);
        // Only owner can create admin.
        assert!(sender_addr == @vault, ENOT_DEPLOYER_ADDRESS);
        assert!(exists<VaultInfo>(sender_addr), ENOT_INIT);

        let vault_info = borrow_global_mut<VaultInfo>(sender_addr);
        let resource_signer =
            account::create_signer_with_capability(&vault_info.resource_cap);

        coin::transfer<AptosCoin>(&resource_signer, @vault, amount);
        // Update the `total_staked` value
        vault_info.total_staked = vault_info.total_staked - amount;
    }

    #[test_only]
    use aptos_framework::aptos_account;
    use aptos_framework::aptos_coin;
    // use aptos_framework::resource_account;
    // use aptos_framework::aggregator_factory;

    #[test_only]
    struct FakeCoin {}

    #[test_only]
    struct FakeCoinCapabilities has key {
        mint_cap: coin::MintCapability<FakeCoin>
    }

    #[test_only]
    const ENOT_CORRECT_MINT_AMOUNT: u64 = 10;
    const ENOT_COIN_INITIALIZED: u64 = 11;
    const ENOT_CAPABILITIES: u64 = 12;

    #[test_only]
    struct AptosCoinCapabilities has key {
        mint_cap: coin::MintCapability<AptosCoin>,
    }

    #[test_only]
    public(friend) fun store_aptos_coin_mint_cap(
        aptos_framework: &signer, mint_cap: coin::MintCapability<AptosCoin>
    ) {
        // system_addresses::assert_aptos_framework(aptos_framework);
        move_to(aptos_framework, AptosCoinCapabilities { mint_cap })
    }

    #[test_only]
    public fun test_aptos_coin(aptos_framework: &signer) {
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);
        store_aptos_coin_mint_cap(aptos_framework, mint_cap);
        coin::destroy_burn_cap<AptosCoin>(burn_cap);
    }

    #[test(aptos_framework = @aptos_framework, a = @0xAAAA)]
    public fun test_fake_aptos_mint_works(
        aptos_framework: &signer, a: &signer
    ) {
        let a_addr = signer::address_of(a);

        aptos_account::create_account(a_addr);
        test_aptos_coin(aptos_framework);

        aptos_coin::mint(aptos_framework, a_addr, 100);
        assert!(coin::balance<AptosCoin>(a_addr) == 100, ENOT_CORRECT_MINT_AMOUNT);
    }

    #[test(aptos_framework = @aptos_framework, a = @vault)]
    public fun test_init_module_works(
        aptos_framework: &signer, a: &signer
    ) acquires VaultInfo {
        let a_addr = signer::address_of(a);

        aptos_account::create_account(a_addr);
        test_aptos_coin(aptos_framework);

        aptos_coin::mint(aptos_framework, a_addr, 100);
        assert!(coin::balance<AptosCoin>(a_addr) == 100, ENOT_CORRECT_MINT_AMOUNT);
        init_module(a);

        // Register for METH token
        deposit(a, 100, 1000);
    }
}