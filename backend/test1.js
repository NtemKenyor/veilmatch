// const anchor = require('@project-serum/anchor');
// const { SystemProgram } = anchor.web3;
const anchor = require("@project-serum/anchor");
const { PublicKey, SystemProgram } = require("@solana/web3.js");
const fs = require("fs");


// Read the IDL file
// const idl = JSON.parse(fs.readFileSync('../anchor_project/connect-dapp/target/idl/connect_dapp.json', 'utf8'));
const idl = require('../anchor_project/connect-dapp/target/idl/connect_dapp.json');
console.log(idl);


// Define the program ID and connection to Solana
const programId = new anchor.web3.PublicKey('7sGT7oBKSetii8mspduzWR8EeYq86z51v9BdwfkEW2Wr');
const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl('devnet'), 'confirmed');

// Set the provider (usually a wallet)
// Load your wallet keypair
const walletPath = "/home/kenyor/.config/solana/quicknode.json"; // Replace with your wallet keypair path
const keypair = anchor.web3.Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, "utf8")))
);

// Connect to Solana cluster
// const connection = new anchor.web3.Connection(
//   "https://spring-quick-surf.solana-devnet.quiknode.pro/016ff48f0f7c3f1520e515c01dca9a83ef528317", // Use "https://api.mainnet-beta.solana.com" for mainnet
//   "confirmed"
// );

// Create a provider using your wallet
const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(keypair), {
  preflightCommitment: "confirmed",
});

// const provider = anchor.Provider.local();
anchor.setProvider(provider);

// Define the program
const program = new anchor.Program(idl, programId, provider);

typeDef.type.kind === "struct"
// Function to send a transaction to create a post
async function createPost(title, content, imageUrl, author, date, others) {
  const postAccount = new anchor.web3.Keypair();
  const user = provider.wallet;

  // Create the transaction
  const tx = await program.rpc.createPost(
    title,
    content,
    imageUrl,
    author,
    date,
    others,
    {
      accounts: {
        postAccount: postAccount.publicKey,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [postAccount],
    }
  );

  console.log('Transaction sent:', tx);
}

// Example usage:
createPost(
  'Post Title',
  'Content of the post...',
  'http://image.url',
  'Author Name',
  '2024-12-04',
  'Additional Information'
);
