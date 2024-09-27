import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Dan Project',
  projectId: '2d97258b98fcfe37e696a04cc336b800',
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/N_BM9jl2asl3yXzAdP6dh2ZrpNTf341C'),
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/N_BM9jl2asl3yXzAdP6dh2ZrpNTf341C'),
  },
  ssr: true,
});