'use client';

import { type FC } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/index';

interface WalletConnectButtonProps {
  className?: string;
}

export const WalletConnectButton: FC<WalletConnectButtonProps> = ({
  className,
}) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = (connectorIndex: number) => {
    const connector = connectors[connectorIndex];
    if (connector) {
      connect({ connector });
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <Button
        variant="outline"
        onClick={handleDisconnect}
        className={cn(
          "rounded-none border border-[#4ADE80] text-[#4ADE80] bg-transparent hover:bg-flare-accent/10 transition-all font-black uppercase tracking-widest text-[10px]",
          className
        )}
      >
        {truncateAddress(address)}
      </Button>
    );
  }

  return (
    <Button 
      onClick={() => handleConnect(0)} 
      disabled={isPending}
      className={cn(
        "rounded-none border border-[#4ADE80] text-[#4ADE80] bg-transparent hover:bg-flare-accent/10 transition-all font-black uppercase tracking-widest text-[10px]",
        className
      )}
    >
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
};
