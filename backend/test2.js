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
// const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl('devnet'), 'confirmed');

// Set the provider (usually a wallet)
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

// const provider = anchor.Provider.local();
anchor.setProvider(provider);


// Define the program ID and connection to Solana
// const programId = new anchor.web3.PublicKey('7sGT7oBKSetii8mspduzWR8EeYq86z51v9BdwfkEW2Wr');
// const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl('devnet'), 'confirmed');

// Set the provider (usually a wallet)
// const provider = anchor.Provider.local();
// anchor.setProvider(provider);

// Define the program **without using the IDL**
const program = new anchor.Program(
  {
    // Program IDL is not used here
    "version": "0.1.0",
    "name": "connect_dapp",
    "instructions": [
      {
        "name": "create_post",
        "accounts": [
          { "name": "post_account", "writable": true, "signer": true },
          { "name": "user", "writable": true, "signer": true },
          { "name": "system_program", "address": "11111111111111111111111111111111" }
        ],
        "args": [
          { "name": "title", "type": "string" },
          { "name": "content", "type": "string" },
          { "name": "image_url", "type": "string" },
          { "name": "author", "type": "string" },
          { "name": "date", "type": "string" },
          { "name": "others", "type": "string" }
        ]
      }
    ],
    "accounts": [
      {
        "name": "PostMetadata",
        "discriminator": [212, 57, 74, 143, 77, 249, 112, 11]
      }
    ],
    "types": [
        {
        "name": "PostMetadata",
        "type": {
            "kind": "enum",
            "fields": [
            {
                "name": "title",
                "type": "string"
            },
            {
                "name": "content",
                "type": "string"
            },
            {
                "name": "image_url",
                "type": "string"
            },
            {
                "name": "author",
                "type": "string"
            },
            {
                "name": "date",
                "type": "string"
            },
            {
                "name": "others",
                "type": "string"
            }
            ]
        }
        }
    ]
  },
  programId,
  provider
);

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
