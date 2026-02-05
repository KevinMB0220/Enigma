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
        className={cn(className)}
      >
        {truncateAddress(address)}
      </Button>
    );
  }

  if (isPending) {
    return (
      <Button disabled className={cn(className)}>
        Connecting...
      </Button>
    );
  }

  return (
    <Button onClick={() => handleConnect(0)} className={cn(className)}>
      Connect Wallet
    </Button>
  );
};
