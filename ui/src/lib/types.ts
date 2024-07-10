export type currency = "mETH" | "mBTC" | "mUSDC";

export interface asset {
  currency: currency;
  value: number;
}

export interface transaction {
  currency: currency;
  value: number;
  date: Date;
  type: "deposit" | "withdraw";
}
