import { NFT as NFTType } from "@thirdweb-dev/sdk";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { NFTDROP_ADDRESS } from "../const/constants";
import NFT from "./NFT";
import NFTComponent from "./NFT";


type Props = {
    isLoading: boolean;
    nfts: NFTType[] | undefined;
    emptyText?: string;
};

export default function NFTGrid({isLoading, nfts, emptyText}: Props) {
    console.log("emptyText ", emptyText);
    return (
        <div className={styles.container}>
            {nfts && nfts.length > 0 ? (
                nfts.map((nft) => (
                    (emptyText === "Just claim for your own character.") ? (
                        <Link
                            key={nft.metadata.id}
                            href={`/token/${NFTDROP_ADDRESS}/${nft.metadata.id}`}
                            className={styles.card}
                        >
                        <NFTComponent
                            nft={nft}
                        />
                        {nft.quantityOwned ? (
                            <h2>Quantity : {nft.quantityOwned}</h2>
                        ) : null }
                        <br />
                        </Link>
                    ) : (
                       
                        <div key={nft.metadata.id}>
                        <NFTComponent
                            nft={nft}
                        />
                        {nft.quantityOwned ? (
                            <h2>Quantity : {nft.quantityOwned}</h2>
                        ) : null }
                        <br />
                        </div>
                    )
                    
                ))
            ) : (
                <p>{emptyText}</p>
            )}
        </div>
    )
}
