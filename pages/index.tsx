import { ConnectWallet, Web3Button, useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
// import Image from "next/image";
import { NextPage } from "next";
import { NFTDROP_ADDRESS } from "../const/constants";
import NFTGrid from "../components/NFTGrid";


const Home: NextPage = () => {
  const address = useAddress();

  const {
    contract
  } = useContract(NFTDROP_ADDRESS);
  const {
    data,
    isLoading
  } = useOwnedNFTs(contract, address);

  return (
    <main className={styles.container}>
      <ConnectWallet />
      {!address ? (
        <p className={styles.description}>Connect your wallet to get started.</p>
      ) : (
        <div>
          <h3>Your Characters:</h3>
          <NFTGrid
            isLoading={isLoading}
            nfts={data}
            emptyText="Just claim for your own character."
          />
          <Web3Button
            contractAddress={NFTDROP_ADDRESS}
            action={(contract) => contract.erc721.claim(1)}
          >Claim Player</Web3Button>
        </div>
      )}
    </main>
  );
};

export default Home;
