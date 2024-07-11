module oracle::oracle {
    use pyth::pyth;
    use pyth::price::Price;
    use pyth::price_identifier;
    use aptos_framework::coin;
 
    // Add the pyth_price_update argument to any method on your contract that needs to read the Pyth price.
    // See https://docs.pyth.network/price-feeds/fetch-price-updates for more information on how to fetch the pyth_price_update.
    public fun get_btc_usd_price(user: &signer, pyth_price_update: vector<vector<u8>>): Price {
 
        // First update the Pyth price feeds
        let coins = coin::withdraw(user, pyth::get_update_fee(&pyth_price_update));
        pyth::update_price_feeds(pyth_price_update, coins);
 
        // Read the current price from a price feed.
        // Each price feed (e.g., BTC/USD) is identified by a price feed ID.
        // The complete list of feed IDs is available at https://pyth.network/developers/price-feed-ids
        // Note: Aptos uses the Pyth price feed ID without the `0x` prefix.
        let btc_price_identifier = x"e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43";
        let btc_usd_price_id = price_identifier::from_byte_vec(btc_price_identifier);
        pyth::get_price(btc_usd_price_id)
    }
    pyth::get_update_fee(
    vec![<update_data>]
    )
    // this will be used for the calcualtion of the collateralization ratio as well as the liquidation price
}
 
