import { ThirdwebNftMedia } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";

type Props = {
    nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
    return (
        <>
            <ThirdwebNftMedia
                metadata = {nft.metadata}
            />
            <p>Token ID: {nft.metadata.id}</p>
            <p>Token Name: {nft.metadata.name}</p>
        </>
    )
}