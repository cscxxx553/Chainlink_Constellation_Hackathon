import { BaseContract, Signer } from "ethers";
import { TWApiKey, EDITIONDROP_ADDRESS, TOKENDROP_ADDRESS, S_KEY, activeChain, AVACATNFT_ADDRESS, WETC_ADDRESS, WMATIC_ADDRESS, LINK_ADDRESS, MATIC_ADDRESS } from "../../const/constants";
import { ThirdwebSDKProvider, Web3Button, useAddress, useBalance, useClaimedNFTs, useContract, useMetadata, useNFTs, useOwnedNFTs, useTotalCount } from "@thirdweb-dev/react";
import toast from "react-hot-toast";
import toastStyle from "../../util/toastConfig";
import styles from "../../styles/Home.module.css";
import NFTGrid from "../../components/NFTGrid";
import { Key, useEffect, useState } from "react";
import { CustomContractMetadata, NATIVE_TOKEN_ADDRESS, SmartContract, ThirdwebSDK } from "@thirdweb-dev/sdk";
// import MyNFT1155 from "../MyNFT1155";

interface ConnectedProps {
    signer: Signer | undefined;
};

const SmartWalletConnected: React.FC<ConnectedProps> = ({ signer }) => {
    console.log("SmartWalletConnected signer ", signer)
    return (
        <ThirdwebSDKProvider signer={signer} activeChain={activeChain} clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}>
            <ClaimTokens />
            <MyNFT1155 />
        </ThirdwebSDKProvider>
    );
}; 


const ClaimTokens = () => {
    const address = useAddress();
    const { data: tokenBalance, isLoading: loadingBalance } = useBalance(TOKENDROP_ADDRESS);
    const { data: maticBalance, isLoading: loadingMaticBalance } = useBalance(NATIVE_TOKEN_ADDRESS);
    const { data: linkBalance, isLoading: loadingLinkBalance } = useBalance(LINK_ADDRESS);
    const { data: wmaticBalance, isLoading: loadingWmaticBalance } = useBalance(WMATIC_ADDRESS);
    const { data: wethBalance, isLoading: loadingWethBalance } = useBalance(WETC_ADDRESS);
    const { contract } = useContract(EDITIONDROP_ADDRESS);
    const { data: nfts, isLoading, error } = useOwnedNFTs(contract, address);
    // const { contract:avaCatContract } = useContract(AVACATNFT_ADDRESS);
    // let avaCatNFTs: any[] | undefined;
    
    // useEffect(() => {
    //     const getAvaCatContract = async() =>{
    //         avaCatNFTs = await avaCatContract?.call("balanceOfBatch", [[address,address,address,address], [0,1,2,3]])
    //         console.log("avaCatNFTs ",avaCatNFTs);
    //     }
    //     getAvaCatContract();
    // }, [])

    return (
        <div>
            <p>Token Bound Smart Wallet Address: {address}</p>
            <h1>Claim tokens:</h1>
            {address ? (
                loadingBalance ? (
                    <h2>Loading Balance...</h2>
                ) : (
                    <div className={styles.pricingContainer}>
                        <h2>Player Token Balance: {tokenBalance?.displayValue}</h2>
                        <h2>Matic Balance: {maticBalance?.displayValue}</h2>
                        <h2>Link Balance: {linkBalance?.displayValue}</h2>
                        <h2>Wmatic Balance: {wmaticBalance?.displayValue}</h2>
                        <h2>Weth Balance: {wethBalance?.displayValue}</h2>
                        <Web3Button
                            contractAddress={TOKENDROP_ADDRESS}
                            action={ (contract) => contract.erc20.claim(10)}
                            onSuccess={() => {
                                toast(`Tokens Claimed!`, {
                                icon: "✅",
                                style: toastStyle,
                                position: "bottom-center",
                                });
                            }}
                            onError={(e) => {
                                console.log(e);
                                toast(`Tokens Claim Failed! Reason: ${(e as any).reason}`, {
                                icon: "❌",
                                style: toastStyle,
                                position: "bottom-center",
                                });
                            }}
                        >Claim Tokens</Web3Button>
                    </div>
                )
            ) : null }
            <br />
            <h1>Claim NFT:</h1>
            {address && isLoading ? (
                        <h2>Loading Edition NFT...</h2>
                    ) : (
                        <div>
                            <NFTGrid
                                isLoading={isLoading}
                                nfts={nfts}
                                emptyText="Just claim for your own pets."
                            />
                            <Web3Button
                                contractAddress={EDITIONDROP_ADDRESS}
                                action={ (contract) => contract.erc1155.claim(0, 1)}
                            >Claim NFT</Web3Button> 
                        </div>
                    ) 
            }
            <br />
            <br />
            
            {/* {avaCatNFTs==undefined ? (
                <h3>1233</h3>
            ) : (
                avaCatNFTs
            )} */}
            
        </div>
    )
}

const MyNFT1155 = () => {
    
    interface AvaNft {
        token: number;
        quentity: number;
        image: string;
    };
    const address = useAddress();
    const { contract:avaCatContract } = useContract(AVACATNFT_ADDRESS);
    const { contract:wmaticContract } = useContract(WMATIC_ADDRESS);
    const { contract:linkContract } = useContract(LINK_ADDRESS);
    const [avaCatNFTs, setAvaCatNFTs] = useState<number[]>([]);
    const [avaCatURI, setAvaCatURI] = useState<AvaNft[]>([]);
    // const { data, isLoading, error } = useMetadata(avaCatContract);
    // const { data, isLoading, error } = useOwnedNFTs(avaCatContract, address);
    // let avaCatNFTs: any[] | undefined;
    const amount = BigInt("3000000000000000000");
    const approveToken = async() =>{
        await wmaticContract?.call("approve", ["0x79B62B4384736Df873B80e026AB756d2197a9f5F", amount]);
        await linkContract?.call("approve", ["0x79B62B4384736Df873B80e026AB756d2197a9f5F", amount]);
    }

    useEffect(() => {
        // approveToken(); 
        const assembUriArray = (tempArray: any) => {
            console.log("avaCatNFTs ",avaCatNFTs);
            const newArr = [];
            tempArray?.forEach(async(value: number,index: any)=>{
                if(value!=0){
                    const uriJson = await avaCatContract?.call("uri", [index]);
                    const imageUrl = await (await fetch(uriJson)).json();
                    const newData = [
                        {
                          token: index,
                          quentity: value,
                          image: imageUrl.image
                        }
                      ];
                    setAvaCatURI((prevRecords) => [...prevRecords, ...newData]);
                }
            })
        }
        const getAvaCatContract = async() =>{
            try {
                // avaCatNFTs = await avaCatContract?.call("balanceOfBatch", [[address,address,address,address], [0,1,2,3]])
                const tempArray: number[] = await avaCatContract?.call("balanceOfBatch", [[address,address,address,address], [0,1,2,3]])
                setAvaCatNFTs(tempArray);
                const tempUriArray = assembUriArray(tempArray);
                
            }catch(error){
                console.error('Error fetching balances:', error);
            }
        }
        getAvaCatContract();
        
    },[address, avaCatContract])


    return(
        <div>
            {(avaCatNFTs==undefined)  ? (
                <h3>Loading...</h3>
            ) : (
                <div>
                    <p>Cats from Avalanche:</p>
                    <ul>
                        {avaCatURI.map((data, index) => (
                            <div key={index}>
                                <img src={data.image} />
                                <li key={index}>{`Token ${data.token}: ${data.quentity} `}</li>
                            </div>
                        ))}
                    </ul>
                </div>
            )
            }
        </div>
    )
    
}

export default SmartWalletConnected;