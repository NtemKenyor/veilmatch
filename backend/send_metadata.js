const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;
const fs = require("fs");

const main = async (network) => {
    // Configure the client based on the selected network
    const connectionUrl = network === "devnet" ? "https://spring-quick-surf.solana-devnet.quiknode.pro/016ff48f0f7c3f1520e515c01dca9a83ef528317" : "http://127.0.0.1:8899";
    
    const walletPath = "/home/kenyor/.config/solana/quicknode.json"; // Replace with your wallet keypair path
    const keypair = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, "utf8")))
    );

    const provider = new anchor.AnchorProvider(
        new anchor.web3.Connection(connectionUrl, "confirmed"),
        // anchor.Wallet.local(),
        // keypair,
        new anchor.Wallet(keypair),
        {}
    );
    anchor.setProvider(provider);

    // Load the program
    // const idl = JSON.parse(fs.readFileSync("../anchor_project/connect-dapp/target/idl/connect_dapp.json", "utf8"));
    // const programId = new anchor.web3.PublicKey("7sGT7oBKSetii8mspduzWR8EeYq86z51v9BdwfkEW2Wr");
    // const program = new anchor.Program(idl, programId);

    const idl = JSON.parse(fs.readFileSync("../anchor_project/connect-dapp/target/idl/connect_dapp.json", "utf8"));
    console.log("IDL loaded successfully");

    const programId = new anchor.web3.PublicKey("7sGT7oBKSetii8mspduzWR8EeYq86z51v9BdwfkEW2Wr");
    console.log("Program ID:", programId.toString());

    const program = new anchor.Program(idl, programId, provider);
    console.log("Program initialized successfully");

    // Generate a new keypair for the post account
    const postAccount = anchor.web3.Keypair.generate();

    // Define metadata
    const metadata = {
        title: "First Post",
        content: "This is the content of the first post.",
        image_url: "https://example.com/image.jpg",
        author: "Author Name",
        date: "2024-12-04",
        others: "Some other metadata"
    };

    // Send the transaction
    await program.rpc.createPost(
        metadata.title,
        metadata.content,
        metadata.image_url,
        metadata.author,
        metadata.date,
        metadata.others,
        {
            accounts: {
                postAccount: postAccount.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            },
            signers: [postAccount],
        }
    );

    console.log("Post account created with public key:", postAccount.publicKey.toString());
};

// Determine the network dynamically
const network = process.argv[2] || "devnet"; // Default to devnet if no argument is passed
main(network).catch(err => console.error(err));
