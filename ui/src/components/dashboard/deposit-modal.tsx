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
import { useState } from "react";

export default function DepositModal() {
  const { address } = useCentralStore();
  const [amountInMov, setAmountInMov] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<currency>("mETH");
  const { currency: currencyValues } = useCentralStore();

  //TODO: mai yaha 1 MOV = 5 dollars leke kr rha hu - modify krdiyo idhar
  const movToUSD = 5;

  const amountInUSD = amountInMov * movToUSD;
  const amountInCurrency = amountInUSD / currencyValues[selectedCurrency];

  const handleDeposit = () => {
    console.log("Depositing", amountInMov, selectedCurrency);
    // TODO: Write logic for depositing funds
  };

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
            <Input id="wallet" value={address} readOnly />
          </div>
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <Input
              id="amount"
              type="number"
              placeholder="Amount to deposit"
              onChange={(e) => setAmountInMov(parseFloat(e.target.value))}
            />
            <div className="text-muted-foreground">MOV</div>
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
                onClick={() => setSelectedCurrency("mBTC")}
                value="mBTC"
              >
                mBTC
              </TabsTrigger>
              <TabsTrigger
                onClick={() => setSelectedCurrency("mUSDC")}
                value="mUSDC"
              >
                mUSDC
              </TabsTrigger>
            </TabsList>
            <TabsContent value="mETH">
              <ConversionCard
                amountInUSD={amountInUSD}
                amountInCurrency={amountInCurrency}
                currency="mETH"
              />
            </TabsContent>
            <TabsContent value="mBTC">
              <ConversionCard
                amountInUSD={amountInUSD}
                amountInCurrency={amountInCurrency}
                currency="mBTC"
              />
            </TabsContent>
            <TabsContent value="mUSDC">
              <ConversionCard
                amountInUSD={amountInUSD}
                amountInCurrency={amountInCurrency}
                currency="mUSDC"
              />
            </TabsContent>
          </Tabs>
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
