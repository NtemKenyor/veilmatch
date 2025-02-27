const { Connection, Keypair, SystemProgram, Transaction } = require("@solana/web3.js");
const { AnchorProvider, Program, web3 } = require("@coral-xyz/anchor");
const fs = require("fs");
const anchor = require("@project-serum/anchor");

// Replace with your provider url (e.g., "http://localhost:8899")
const providerUrl = "https://spring-quick-surf.solana-devnet.quiknode.pro/016ff48f0f7c3f1520e515c01dca9a83ef528317";

// Replace with your program id from the IDL // 7sGT7oBKSetii8mspduzWR8EeYq86z51v9BdwfkEW2Wr
const programId = new web3.PublicKey("7sGT7oBKSetii8mspduzWR8EeYq86z51v9BdwfkEW2Wr");

// Define the program ID and connection to Solana
// const programId = new anchor.web3.PublicKey('7sGT7oBKSetii8mspduzWR8EeYq86z51v9BdwfkEW2Wr');



// Replace with your wallet private key (in base58 format)
// const walletPrivateKey = new Uint8Array(FILL_YOUR_WALLET_PRIVATE_KEY_HERE);


// const walletPath = "/home/kenyor/.config/solana/quicknode.json"; 
// const walletPrivateKey = Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, "utf8")))

// Read the wallet private key from the JSON file
const walletPath = "/home/kenyor/.config/solana/quicknode.json";
const walletPrivateKey = Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, "utf8")));
// const walletPath = "/home/kenyor/.config/solana/quicknode.json"; // Replace with your wallet keypair path
// const keypair = anchor.web3.Keypair.fromSecretKey(
//   Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, "utf8")))
// );

async function createPost(title, content, imageUrl, author, date, others) {
//   // Connect to the cluster
//   const connection = new Connection(providerUrl);

//   // Generate a keypair for the post account
//   const postAccount = Keypair.generate();

//   // Configure the provider with wallet and connection
//   const provider = new AnchorProvider(connection, new Keypair(walletPrivateKey), { skipPreflight: true });

    // Connect to the cluster
    const connection = new Connection(providerUrl);

    // Generate a keypair for the post account
    const postAccount = Keypair.generate();

    // Create a Keypair object from the wallet private key
    const walletKeyPair = Keypair.fromSecretKey(walletPrivateKey);

    // Configure the provider with wallet and connection
    const provider = new AnchorProvider(connection, walletKeyPair, { skipPreflight: true });


  // Load the program IDL
  const idl = await Program.fetchIdl(programId, provider);
//   Program.fetchIdl(programId, provider);

  // Create the program object
  const program = new Program(idl, programId, provider);

  // Build the create_post instruction
  const createPostIx = program.methods.createPost(
    title,
    content,
    imageUrl,
    author,
    date,
    others,
  );

  // Build the transaction
  const tx = new Transaction();
  tx.add(
    SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: postAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(PostMetadata.LEN),
      space: PostMetadata.LEN,
      programId: programId,
    })
  );
  tx.add(createPostIx);

  // Sign the transaction
  tx.signers = [provider.wallet];

  // Send the transaction
  const txHash = await connection.sendTransaction(tx);
  console.log("Transaction hash:", txHash);

  // Wait for confirmation
  await connection.confirmTransaction(txHash);

  console.log("Post created successfully!");
}

(async () => {
  // Replace with your desired post data
  const title = "My awesome post";
  const content = "This is the content of my post.";
  const imageUrl = "https://example.com/image.jpg";
  const author = "John Doe";
  const date = new Date().toISOString().slice(0, 10); // Get current date
  const others = "Optional data";

  await createPost(title, content, imageUrl, author, date, others);
})();