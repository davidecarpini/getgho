import { providers } from 'ethers';
import { useMemo } from 'react';
import type { Chain, Client, Transport } from 'viem';
import { usePublicClient } from 'wagmi';

export function clientToProvider(client: Client<Transport, Chain>) {
    const { chain, transport } = client;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address
    };
    if (transport.type === 'fallback')
        return new providers.FallbackProvider(
            (transport.transports as ReturnType<Transport>[]).map(
                ({ value }) =>
                    new providers.JsonRpcProvider(value?.url, network)
            )
        );
    return new providers.JsonRpcProvider(transport.url, network);
}

/** Hook to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({
    chainId
}: { chainId?: number | undefined } = {}) {
    const client = usePublicClient({ chainId });
    return useMemo(() => clientToProvider(client), [client]);
}
