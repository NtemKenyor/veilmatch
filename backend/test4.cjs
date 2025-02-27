// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Keypair } = require("@solana/web3.js");
const { fetchMetadataForAccounts } = require("./fetchMetadata");
const { createPost } = require("./createPost");
const forge = require("node-forge");
const fs = require("fs");

async function d_tester() {
        try {

            // Use the decrypted private key to create the user's Keypair
            const walletPath = "/home/kenyor/.config/solana/quicknode.json";
            // const walletPrivateKey = Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, "utf8")));
            const userKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, "utf8"))));
            // const metadata = new PostMetadata({ title, content, image_url, author, date, others });

            const title = "Some random";
            const content = "Testing and more"; 
            const image_url= "image goes here"; 
            const author= "No one knows";
            const date= "12/10/2024";
            const others= "{others: {content}}";

            const metadata = { title, content, image_url, author, date, others };

            // const metadata = { title:"Some random", content: "Testing and more", image_url: "image goes here", aurthor: "No one knows", date: "12/10/2024", others: "{others: {content}}" };

            // Proceed to create the post on the blockchain
            const {signature, program_account} = await createPost(userKeypair, metadata, "");
            console.log(({ status: "True", message: "Post created successfully", edit_key: program_account, signature }) );
            
        } catch (err) {
            console.error("Error creating post:", err);
            console.error("Error during transaction execution:", err.message);
            let blockchain_logs;
            if (err.getLogs) {
                blockchain_logs = await err.getLogs()
                console.log("Logs:", blockchain_logs );
            }
            
            console.log(({ error: "Failed to create post", details: err }) );
        }

    }



d_tester();