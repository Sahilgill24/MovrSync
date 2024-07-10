import { useToast } from "./use-toast";
import { Button } from "./button";

export function CopyAddress({
  address,
  className,
}: {
  address: string;
  className?: string;
}) {
  const truncatedAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;
  const { toast } = useToast();
  return (
    <Button
      className={`font-mono ${className}`}
      size={"sm"}
      variant={"linkHover2"}
      onClick={() => {
        toast({
          description: "Address copied to clipboard",
        });
        navigator.clipboard.writeText(address);
      }}
    >
      {truncatedAddress}
    </Button>
  );
}
