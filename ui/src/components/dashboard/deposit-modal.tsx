import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MoveRight } from "lucide-react";
import { type currency } from "@/lib/types";
import { useCentralStore } from "@/store/central-store";
import { useState, useEffect } from "react";
import { useWallet, InputTransactionData } from '@aptos-labs/wallet-adapter-react';
import { useSubmitTransaction } from "@thalalabs/surf/hooks";
import { createSurfClient, createEntryPayload, EntryPayload } from "@thalalabs/surf";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { VAULT_ABI  } from "../../../abi/vault";
import {ORACLE_ABI} from "../../../abi/oracle";
import { VAULT_CONTRACT } from "../../lib/contract";
import axios from "axios";



export default function DepositModal() {
  const { signAndSubmitTransaction, account } = useWallet();
  const [amountInMov, setAmountInMov] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<currency>("mETH");
  const { currency: currencyValues } = useCentralStore();
  const [val, setval] = useState<number>(0);
  const [price_usd, setPrice_usd] = useState<number>(0);
  const {
    isIdle,
    reset,
    isLoading: submitIsLoading,
    error: submitError,
    submitTransaction,
    data: submitResult,
  } = useSubmitTransaction();

  const handleDeposit = async () => {
    const payload = createEntryPayload(VAULT_ABI, {
      /// @ts-ignore
      function: "deposit",
      /// @ts-ignore
      typeArguments: [],
      /// @ts-ignore
      functionArguments: [Math.floor((val * 10 ** 8)), Math.floor((price_usd * 10 ** 18) / 57440)]
    });
    const tx = await submitTransaction(payload);
    console.log(tx)
  }

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


  const aptosConfig = new AptosConfig({
    network: Network.TESTNET,
  });
  const aptos = new Aptos(aptosConfig);
  const client = createSurfClient(aptos);

  const EXCHANGE_RATE_API = import.meta.env.VITE_EXCHANGE_RATE_API
  const dataFetch = async () => {
    const res = await axios.get(EXCHANGE_RATE_API)
    const data = await res.data
    return data
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const data = await dataFetch()
      const price = data.data.price;
      if (price) {
        setPrice_usd(amountInMov * 57440)
        setval(amountInMov * 57440 / ((price)))
      }
    }, 750)


    return () => clearTimeout(delayDebounceFn)
  }, [amountInMov])






  return (
    <Dialog>
      <DialogTrigger>
        <Button size={"sm"} className="rounded-full px-4">
          Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="wallet" className="text-xs text-muted-foreground">
              Wallet Address
            </Label>
            <Input id="wallet" value={account?.address} readOnly />
          </div>
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <Input
              id="amount"
              type="number"
              placeholder="Amount of tokens to buy"
              onChange={(e) =>
                setAmountInMov(parseFloat(e.target.value)

                )}
            />

          </div>
          <Tabs defaultValue="mETH">
            <p className="text-xs text-muted-foreground mb-2">
              Deposit Currency{" "}
            </p>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                onClick={() => setSelectedCurrency("mETH")}
                value="mETH"
              >
                mETH
              </TabsTrigger>
              <TabsTrigger
                onClick={() => {
                  setSelectedCurrency("mBTC")

                }}
                value="mBTC"
              >
                mBTC
              </TabsTrigger>
              <TabsTrigger
                onClick={() => setSelectedCurrency("mGOLD")}
                value="mGOLD"
              >
                mGOLD
              </TabsTrigger>
            </TabsList>
            <TabsContent value="mETH">
              <ConversionCard
                amountInUSD={amountInMov}
                amountInCurrency={amountInMov}
                currency="mETH"
              />
            </TabsContent>
            <TabsContent value="mBTC">
              <ConversionCard
                amountInUSD={price_usd}
                amountInCurrency={amountInMov}
                currency="mBTC"
              />
            </TabsContent>
            <TabsContent value="mGOLD">
              <ConversionCard
                amountInUSD={amountInMov}
                amountInCurrency={amountInMov}
                currency="mGOLD"
              />
            </TabsContent>
          </Tabs>
          <div className="grid gap-2">

            <Input id="Amount to pay" value={val} readOnly />
          </div>

          <Button
            size="lg"
            variant={"expandIcon"}
            iconPlacement="right"
            Icon={MoveRight}
            className="w-full text-base"
            onClick={() => handleDeposit()}
          >
            Deposit
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}

function ConversionCard({
  currency,
  amountInUSD,
  amountInCurrency,
}: {
  currency: currency;
  amountInUSD: number;
  amountInCurrency: number;
}) {
  const formattedAmountInUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInUSD);

  return (
    <Card className="mt-4">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-medium">{currency}</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{amountInCurrency.toFixed(4)}</p>
            <p className="text-muted-foreground">{formattedAmountInUSD}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
