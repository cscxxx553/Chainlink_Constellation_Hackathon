import { NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { GetStaticPaths, GetStaticProps } from "next";
import { NFTDROP_ADDRESS, S_KEY, TWApiKey, activeChain } from "../../../const/constants";
import styles from "../../../styles/Home.module.css"
import { MediaRenderer, ThirdwebNftMedia, useAddress, useWallet } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import SmartWalletConnected from "../../../components/SmartWallet/SmartWalletConnected"
import newSmartWallet from "../../../components/SmartWallet/SmartWallets";
import { Signer } from "ethers";

type Props = {
    nft: NFT;
    contractMetadata: any;
};

export default function Token({ nft, contractMetadata }: Props) {
    const [smartWalletAddress, setSmartWalletAddress] = useState<string | null>(null);
    const [signer, setSigner] = useState<Signer>();

    // get the currently connected wallet
    const address = useAddress();
    const wallet = useWallet();

    // create a smart wall for the NFT
    useEffect(() => {
        const createSmartWallet = async (nft: NFT) => {
            if(nft && smartWalletAddress == null && address && wallet) {
                const smartWallet = newSmartWallet(nft);
                console.log("personal wallet", address);
                await smartWallet.connect({
                    personalWallet: wallet,
                });
                // const sdk = ThirdwebSDK.fromWallet(smartWallet, activeChain, {
                //     clientId: TWApiKey, // Use client id if using on the client side, get it from dashboard settings
                // });
                // sdk.
                setSmartWalletAddress(await smartWallet.getAddress());
                console.log("smart wallet address", await smartWallet.getAddress());
                setSigner( await smartWallet.getSigner());
                console.log("signer", signer);
                return smartWallet;
            } else {
                console.log("Wallet is not created.")
            }
        };
        createSmartWallet(nft);
    }, [nft, smartWalletAddress, address, wallet])

    return (
        <div className={styles.container}>
            <div>
                {nft && (
                    <div>
                        <ThirdwebNftMedia
                            metadata={nft.metadata}
                        />
                    </div>
                )}
               
                <h1 className={styles.title}>{nft.metadata.name}</h1>
                <p className={styles.collectionName}>Token ID #{nft.metadata.id}</p>
                
                {smartWalletAddress ? (
                        <SmartWalletConnected
                            signer={signer}
                        />
                        
                    ) : (
                        <p>Loading...</p>
                    )}
            </div>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    const tokenId = context.params?.tokenId as string;

    const sdk = new ThirdwebSDK(activeChain, {
        secretKey: S_KEY,
    });

    // const contract = await sdk.getContract(NFTDROP_ADDRESS);
    const contract = await sdk.getContract(NFTDROP_ADDRESS);

    const nft = await contract.erc721.get(tokenId);
    console.log(nft.metadata.uri, "Here!!!");

    let contractMetadata;

    try{
        contractMetadata = await contract.metadata.get();
    } catch (e) {}

    return {
        props: {
            nft,
            contractMetadata: contractMetadata || null,
        },
        revalidate: 1
    }

    
};

export const getStaticPaths: GetStaticPaths = async () => {
    const sdk = new ThirdwebSDK(activeChain, {
        secretKey: S_KEY,
    });

    const contract = await sdk.getContract(NFTDROP_ADDRESS);

    const nfts = await contract.erc721.getAll();

    const paths = nfts.map((nft) => {
        return {
            params: {
                contractAddress: NFTDROP_ADDRESS,
                tokenId: nft.metadata.id
            }
        }
    });

    return {
        paths,
        fallback: "blocking"
    }
};