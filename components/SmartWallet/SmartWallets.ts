import { NFT, SmartContract } from "@thirdweb-dev/sdk";
import { WalletOptions, SmartWallet } from "@thirdweb-dev/wallets"
import type { SmartWalletConfig } from "@thirdweb-dev/wallets";
import { FACTORY_ADDRESS, IMPLEMENTION_ADDRESS, NFTDROP_ADDRESS, S_KEY, TWApiKey, activeChain } from "../../const/constants";
import type { BaseContract} from "ethers";
import { ethers } from "ethers";

export default function newSmartWallet(token: NFT) {
    //Smart Wallet config object
    const config: WalletOptions<SmartWalletConfig> = {
        chain: activeChain, // the chain where your smart wallet will be or is deployed
        factoryAddress: FACTORY_ADDRESS, // your own deployed account factory address
        clientId: process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID, // obtained from the thirdweb dashboard
        // secretKey: S_KEY,
        gasless: true, // enable or disable gasless transactions
        factoryInfo: { 
            createAccount: async (
                factory: SmartContract<BaseContract>,
                owner: string
            ) => {
                const account = factory.prepare("createAccount", [
                    IMPLEMENTION_ADDRESS,
                    activeChain.chainId,
                    NFTDROP_ADDRESS,
                    token.metadata.id,
                    0,
                    ethers.utils.toUtf8Bytes("")
                ]);
                console.log("here ", account);
                return account;
            }, // the factory method to call to create a new account
            getAccountAddress: async (
                factory: SmartContract<BaseContract>,
                owner: string
            ) => {
                return factory.call("account", [
                    IMPLEMENTION_ADDRESS,
                    activeChain.chainId,
                    NFTDROP_ADDRESS,
                    token.metadata.id,
                    0
                ]);
            }, // the factory method to call to get the account address
        },
    };
    return new SmartWallet(config);
}