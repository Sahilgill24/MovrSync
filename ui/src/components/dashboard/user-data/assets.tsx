import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Skeleton } from "@/components/ui/skeleton";

import { type asset } from "@/lib/types";
import { useCentralStore } from "@/store/central-store";

import { useState, useEffect } from "react";
import { useSubmitTransaction } from "@thalalabs/surf/hooks";
import { createSurfClient, createEntryPayload, EntryPayload } from "@thalalabs/surf";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
// import { VAULT_ABI  } from "../../../abi/vault";
// import {ORACLE_ABI} from "../../../abi/oracle";



export default function Assets() {
  const [mETH, setmETH] = useState(0.000);
  const [mBTC, setmBTC] = useState(0.0000355);
  const [mGOLD, setmGOLD] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  // Isko dekh liyo yahi calculate krna hai ya peeche se bhejega
  const [profit, setProfit] = useState(15.46);
  const [profitPercentage, setProfitPercentage] = useState(1.5);

  // const oracledata = async () => {
  //   const payload = createEntryPayload(ORACLE_ABI, {
  //     /// @ts-ignore
  //     function: "get_btc_usd_price",
  //     /// @ts-ignore
  //     typeArguments: [],
  //     /// @ts-ignore
  //     functionArguments: []
  //   });
  //   const btc_usd = await submitTransaction(payload);
    

  // }
  // just setting this abi oracle abi properly and then using this we can calculate the profit and loss


  const { currency: currencyValues } = useCentralStore();
  const assets: asset[] = [
    {
      currency: "mETH",
      value: mETH,
    },
    {
      currency: "mBTC",
      value: mBTC,
    },
    {
      currency: "mGOLD",
      value: mGOLD,
    },
  ];

  
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const totalValue = assets.reduce((acc, asset) => {
    const currencyValue = currencyValues[asset.currency];
    return acc + asset.value * currencyValue;
  }, 0);

  const formattedTotalValue = Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalValue);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets</CardTitle>
        <CardDescription>All your assets, in one place :)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 h-[20rem]">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <div className="space-y-2">
              <GradientHeading size={"lg"} variant={"light"}>
                $ {formattedTotalValue}
              </GradientHeading>
              <PNL profit={profit} profitPercentage={profitPercentage} />
            </div>
            <div className="space-y-2 *:bg-muted/60">
              {assets.map((asset) => (
                <div className="py-2.5 px-4 rounded-md border flex flex-row items-center justify-between">
                  <p className="text-lg">{asset.currency}</p>
                  <div className="flex flex-col items-start">
                    {asset.value.toFixed(4)}{" "}
                    <span className="text-xs text-muted-foreground">
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(asset.value * currencyValues[asset.currency])}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function PNL({
  profit,
  profitPercentage,
}: {
  profit: number;
  profitPercentage: number;
}) {
  const formattedProfit = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(profit);

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground font-medium">
        Today's PNL{" "}
        {profit >= 0 ? (
          <span className="text-emerald-400 ml-1">
            +{formattedProfit} ({Math.abs(profitPercentage)}%)
          </span>
        ) : (
          <span className="text-red-400 ml-1">
            {formattedProfit} ({profitPercentage}%)
          </span>
        )}
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <>
      <div className="space-y-2">
        <Skeleton className="h-16 w-72" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="space-y-2 *:w-full *:h-14">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    </>
  );
}
