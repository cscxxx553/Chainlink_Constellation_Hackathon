import { useAddress } from "@thirdweb-dev/react";
import { useEffect } from "react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { AVACATNFT_ADDRESS, TWApiKey, activeChain } from "../const/constants";
import { Signer } from "ethers";

interface ConnectedProps {
    signer: Signer | undefined;
};

const MyNFT1155: React.FC<ConnectedProps> = ({ signer }) => {
    const address = useAddress();
    // const [avaCatNFTs, setAvaCatNFTs] = useState();
    const getAvaCatContract = async(sdk: ThirdwebSDK, address: any) => {
    const avaCatContract = await sdk.getContract(AVACATNFT_ADDRESS);
    const data = await avaCatContract.call("balanceOfBatch", [[address,address,address,address], [0,1,2,3]]);
    console.log("data", data)
    if(data[0]!=0){
        const nftURI0 = await avaCatContract.call("uri", [0]);
        console.log("nftURI0", nftURI0);
    }
    if(data[1]!=0){
        const nftURI1 = await avaCatContract.call("uri", [1]);
        console.log("nftURI1", nftURI1);
    }
    if(data[2]!=0){
        const nftURI2 = await avaCatContract.call("uri", [2]);
        console.log("nftURI2", nftURI2);
    }
    if(data[3]!=0){
        const nftURI3 = await avaCatContract.call("uri", [3]);
        console.log("nftURI3", nftURI3);
    }
    
    }
    // const data2 = await avaCatContract.call("uri", [_tokenid]);
    // console.log("gc.getAddress", gc.getAddress())
    
    useEffect(() => {
    if(signer!=undefined){
        const sdk = ThirdwebSDK.fromSigner(signer, activeChain, {
            clientId: TWApiKey,
        });
        console.log("inside address ", address);
        getAvaCatContract(sdk, address);
        
    }
    }, [signer])

    return(
        <div>
            <h3>MyNFT1155...</h3>
        </div>
    )
}

export default MyNFT1155;