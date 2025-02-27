const anchor = require("@project-serum/anchor");
const { PublicKey, SystemProgram } = require("@solana/web3.js");
const fs = require("fs");

// Load your wallet keypair
const walletPath = "/home/kenyor/.config/solana/quicknode.json"; // Replace with your wallet keypair path
const keypair = anchor.web3.Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, "utf8")))
);

// Connect to Solana cluster
const connection = new anchor.web3.Connection(
  "https://spring-quick-surf.solana-devnet.quiknode.pro/016ff48f0f7c3f1520e515c01dca9a83ef528317", // Use "https://api.mainnet-beta.solana.com" for mainnet
  "confirmed"
);

// Create a provider using your wallet
const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(keypair), {
  preflightCommitment: "confirmed",
});

// Initialize the program
const programId = new PublicKey("7sGT7oBKSetii8mspduzWR8EeYq86z51v9BdwfkEW2Wr"); // Program ID
const idl = require("../anchor_project/connect-dapp/target/idl/connect_dapp.json"); // Save the IDL JSON in the same directory as `idl.json`

console.log("Program ID:", programId.toString());
console.log("IDL Content:", idl);

const program = new anchor.Program(idl, programId, provider);

async function createPost() {
  // Derive a new PDA (Program Derived Address) for the post account
  const [postAccount, postAccountBump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("post"), keypair.publicKey.toBuffer()], // Customize seeds as needed
    programId
  );

  console.log("Post Account:", postAccount.toString());

  // Define post details
  const postDetails = {
    title: "My First Post",
    content: "This is the content of the first post!",
    image_url: "https://example.com/image.png",
    author: "John Doe",
    date: "2024-12-04",
    others: "Additional metadata about the post",
  };

  // Make the transaction to create the post
  try {
    const tx = await program.methods
      .createPost(
        postDetails.title,
        postDetails.content,
        postDetails.image_url,
        postDetails.author,
        postDetails.date,
        postDetails.others
      )
      .accounts({
        postAccount: postAccount,
        user: keypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();

    console.log("Transaction signature:", tx);
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

createPost();


/* require('dotenv').config();
// fetchMetadata.js
const { Connection, PublicKey } = require("@solana/web3.js");
const { deserialize } = require("borsh");
// // 7sGT7oBKSetii8mspduzWR8EeYq86z51v9BdwfkEW2Wr
const programId = new PublicKey("7sGT7oBKSetii8mspduzWR8EeYq86z51v9BdwfkEW2Wr");
// // const connection = new Connection("http://127.0.0.1:8899", "confirmed");
// const connection = new Connection("https://spring-quick-surf.solana-devnet.quiknode.pro/016ff48f0f7c3f1520e515c01dca9a83ef528317 ", "confirmed");

// Function to determine if running on localhost
const isLocalhost = () => {
    const env = process.env.NODE_ENV || "production";;
    return env === "development" || env === "localhost";
};

// Set connection endpoint based on environment
const rpcUrl = isLocalhost() ? "http://127.0.0.1:8899" : "https://spring-quick-surf.solana-devnet.quiknode.pro/016ff48f0f7c3f1520e515c01dca9a83ef528317 "; // Live server endpoint  
const connection = new Connection(rpcUrl, "confirmed");
console.log(rpcUrl); */