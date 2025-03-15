// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Connection, PublicKey, Keypair } = require("@solana/web3.js");
const { fetchMetadataForAccounts } = require("./fetchMetadata");
const { createPost } = require("./createPost");
const forge = require("node-forge");

const app = express();
const PORT = 3000;

// Load server's private key from environment variable
const serverPrivateKeyPem = process.env.SERVER_PRIVATE_KEY;
const serverPublicKeyPem = process.env.SERVER_PUBLIC_KEY;
let dNetwork = process.env.NODE_ENV;

let MAIN_DIR = "/veilmatch/backend";

app.use(cors());
app.use(express.json());

//Loading all functions here


function getKeyFingerprint(pem) {
    // Convert PEM to public key object
    const key = forge.pki.publicKeyFromPem(pem);
    // Convert key to DER format and create a hash with forge
    const der = forge.asn1.toDer(forge.pki.publicKeyToAsn1(key)).getBytes();
    const sha256 = forge.md.sha256.create();
    sha256.update(der, "binary");
    return sha256.digest().toHex();
}

async function decryptPrivateKey(privateKeyPem, encryptedPrivateKeyJson) {
    // Parse the received JSON string into an object
    const encryptedData = JSON.parse(encryptedPrivateKeyJson);
    
    // Convert the server's private key from PEM format to a Forge private key object
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    
    // Decrypt each encrypted chunk using RSA-OAEP
    const decryptedChunks = await Promise.all(encryptedData.encryptedChunks.map(async (encryptedChunk) => {
        try {
            let retrievedKey = privateKey.decrypt(encryptedChunk, 'RSA-OAEP');
            // console.log(retrievedKey);
            return retrievedKey;
        } catch (error) {
            console.error("Error decrypting chunk:", error);
            throw error;
        }
    }));

    // Reconstruct the original private key by joining the decrypted chunks
    const decryptedPrivateKey = decryptedChunks.join('');

    // Return the decrypted private key (in original string format)
    return decryptedPrivateKey;
}

/* 
// Define RPC endpoints for each network
const NETWORK_RPC_ENDPOINTS = {
    mainnet: [
        'https://dry-ancient-lambo.solana-mainnet.quiknode.pro/ed2362f2fb7c1337b00e81d6863eb929d0db2b2e/',
        'https://api.mainnet-beta.solana.com', // Primary
        'https://solana-api.projectserum.com', // Backup 1
        'https://ssc-dao.genesysgo.net', // Backup 2
    ],
    main: [
        'https://dry-ancient-lambo.solana-mainnet.quiknode.pro/ed2362f2fb7c1337b00e81d6863eb929d0db2b2e/',
        'https://api.mainnet-beta.solana.com', // Primary
        'https://solana-api.projectserum.com', // Backup 1
        'https://ssc-dao.genesysgo.net', // Backup 2
    ],
    devnet: [
        // 'https://spring-quick-surf.solana-devnet.quiknode.pro/016ff48f0f7c3f1520e515c01dca9a83ef528317', // Backup 1
        'https://api.devnet.solana.com', // Primary
    ],
    localnet: [
        'http://127.0.0.1:8899', // Primary (local node)
    ],
};
 */

// Define RPC endpoints for each network
const NETWORK_RPC_ENDPOINTS = {
    mainnet: [
        'https://rpc.mainnet-alpha.sonic.game',
        'https://api.mainnet-alpha.sonic.game', // Primary
        'https://sonic.helius-rpc.com/', // Backup 1
        // 'https://ssc-dao.genesysgo.net', // Backup 2
    ],
    main: [
        'https://rpc.mainnet-alpha.sonic.game',
        'https://api.mainnet-alpha.sonic.game', // Primary
        'https://sonic.helius-rpc.com/', // Backup 1
        // 'https://ssc-dao.genesysgo.net', // Backup 2
    ],
    devnet: [
        // 'https://spring-quick-surf.solana-devnet.quiknode.pro/016ff48f0f7c3f1520e515c01dca9a83ef528317', // Backup 1
        // 'https://api.devnet.solana.com', // Primary
        'https://api.testnet.sonic.game/',
    ],
    development: ['https://api.testnet.sonic.game/',],
    dev: ['https://api.testnet.sonic.game/',],
    localnet: [
        'http://127.0.0.1:8899', // Primary (local node)
    ],
};


// Function to get the first available RPC endpoint for a given network
async function getAvailableRpcEndpoint(network) {
    const endpoints = NETWORK_RPC_ENDPOINTS[network] || [];
    for (const url of endpoints) {
        try {
            const connection = new Connection(url, 'confirmed');
            // Test the connection by fetching the latest block height
            await connection.getBlockHeight();
            return url; // Return the first reachable endpoint
        } catch (error) {
            console.warn(`RPC endpoint ${url} is unreachable:`, error);
        }
    }
    throw new Error(`No reachable RPC endpoints found for network: ${network}`);
}



// Serve "Hello World" at /sonic_universe/client/sonic_planet/api/
app.get(MAIN_DIR+'/', (req, res) => {
    res.send('Entrace Point - Hello world');
});

app.get(MAIN_DIR+"/api/metadata", async (req, res) => {
    const network_pref = req.query.network; // Extract the network parameter
    console.log("Received network:", network_pref);

    // set the preferred network from users-end
    if(network_pref != null){
        dNetwork = network_pref;
    }

    // Get the first available RPC endpoint for the specified network
    const rpcUrl = await getAvailableRpcEndpoint(dNetwork);
    // const connection = new Connection(rpcUrl, 'confirmed');

    const metadata = await fetchMetadataForAccounts(rpcUrl);
    res.json(metadata);
});


app.post(MAIN_DIR+"/api/create-post", async (req, res) => {
    const { encryptedPrivateKey, publicKey, title, content, image_url, author, date, network_pref, others } = req.body;

    if (!encryptedPrivateKey || !publicKey || !content) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Get fingerprints of the provided public key and server's public key
        console.log(publicKey, serverPublicKeyPem);
        // console.log(dNetwork);
        const clientPublicKeyFingerprint = getKeyFingerprint(publicKey);
        const serverPublicKeyFingerprint = getKeyFingerprint(serverPublicKeyPem);

        if (clientPublicKeyFingerprint !== serverPublicKeyFingerprint) {
            return res.status(403).json({ error: "Invalid encryption public key" });
        }



        const decryptedPrivateKey = await decryptPrivateKey(serverPrivateKeyPem, encryptedPrivateKey);

        console.log(content, others); // This will be the original private key object

        // Decrypt user's private key using server's private key
        // const privateKey = forge.pki.privateKeyFromPem(serverPrivateKeyPem);

        // // Decode the base64 encoded encrypted private key
        // const encryptedBytes = forge.util.decode64(encryptedPrivateKey);

        // // Decrypt the private key
        // const decryptedPrivateKey = privateKey.decrypt(encryptedBytes, "RSA-OAEP");

        // console.log(decryptedPrivateKey);

        // Use the decrypted private key to create the user's Keypair
        const userKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(decryptedPrivateKey)));
        // const metadata = new PostMetadata({ title, content, image_url, author, date, others });
        // console.log(userKeypair, dNetwork);

        const metadata = { title, content, image_url, author, date, others };

        // set the preferred network from users-end
        if(network_pref != null){
            dNetwork = network_pref;
        }

        // Get the first available RPC endpoint for the specified network
        const rpcUrl = await getAvailableRpcEndpoint(dNetwork);
        // const connection = new Connection(rpcUrl, 'confirmed');

        // Proceed to create the post on the blockchain
        const {signature, program_account} = await createPost(userKeypair, metadata, rpcUrl);
        res.json({ status: "True", message: "Post created successfully", edit_key: program_account, signature });
        
    } catch (err) {
        console.error("Error creating post:", err);
        console.error("Error during transaction execution:", err.message);
        let blockchain_logs;
        if (err.getLogs) {
            blockchain_logs = await err.getLogs()
            console.log("Logs:", blockchain_logs );
        }
        
        res.status(500).json({ error: "Failed to create post", details: err });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
