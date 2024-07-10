export type currency = "mETH" | "mBTC" | "mGOLD";

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
