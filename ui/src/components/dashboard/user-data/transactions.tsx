import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { UploadIcon, DownloadIcon, ArrowDownToLine } from "lucide-react";
import styles from "@/components/components.module.css";
import { Skeleton } from "@/components/ui/skeleton";

import { type transaction } from "@/lib/types";
import { useCentralStore } from "@/store/central-store";

import { useEffect, useState } from "react";

export default function Transactions() {
  const transactions: transaction[] = [
    {
      currency: "mETH",
      value: 0.5,
      date: new Date("2023-01-10"),
      type: "deposit",
    },
    {
      currency: "mBTC",
      value: 0.0023,
      date: new Date("2023-02-14"),
      type: "withdraw",
    },
    {
      currency: "mGOLD",
      value: 300,
      date: new Date("2023-03-05"),
      type: "deposit",
    },
    {
      currency: "mETH",
      value: 1.2,
      date: new Date("2023-04-22"),
      type: "withdraw",
    },
    {
      currency: "mBTC",
      value: 0.005,
      date: new Date("2023-05-17"),
      type: "deposit",
    },
    {
      currency: "mGOLD",
      value: 500,
      date: new Date("2023-06-01"),
      type: "withdraw",
    },
    {
      currency: "mETH",
      value: 0.75,
      date: new Date("2023-06-18"),
      type: "deposit",
    },
    {
      currency: "mBTC",
      value: 0.003,
      date: new Date("2023-07-09"),
      type: "withdraw",
    },
    {
      currency: "mGOLD",
      value: 1000,
      date: new Date("2023-07-20"),
      type: "deposit",
    },
    {
      currency: "mETH",
      value: 2,
      date: new Date("2023-08-02"),
      type: "withdraw",
    },
    {
      currency: "mBTC",
      value: 0.0015,
      date: new Date("2023-08-15"),
      type: "deposit",
    },
    {
      currency: "mGOLD",
      value: 250,
      date: new Date("2023-09-10"),
      type: "withdraw",
    },
  ];

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>All Your Trasaction History</CardDescription>
      </CardHeader>
      <CardContent
        className={`space-y-2 h-[20rem] overflow-auto ${styles.sleek_scrollbar}`}
      >
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          transactions.map((transaction, index) => (
            <Transaction key={index} {...transaction} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

function Transaction(transaction: transaction) {
  const { currency: currencyValue } = useCentralStore();
  const formattedTransactionValue = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(transaction.value * currencyValue[transaction.currency]);

  return (
    <div className="flex items-center border rounded-md px-4 py-3 justify-between">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-muted/60 grid place-items-center rounded-full">
          {transaction.type == "deposit" ? (
            <ArrowDownToLine className="text-emerald-400 font-bold" size={20} />
          ) : (
            <UploadIcon className="text-yellow-400" size={20} />
          )}
        </div>
        <div className="ml-4">
          <div className="text-sm font-semibold">
            {transaction.value.toFixed(4)} {transaction.currency}
          </div>
          <div className="text-xs text-gray-500">
            {transaction.date.toDateString()}
          </div>
        </div>
      </div>
      <div className={`text-sm font-semibold`}>{formattedTransactionValue}</div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3 *:h-14">
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
}
