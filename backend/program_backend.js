const express = require("express");
const cors = require("cors");
const { Connection, PublicKey } = require("@solana/web3.js");
const { deserialize } = require("borsh");

const programId = new PublicKey("7sGT7oBKSetii8mspduzWR8EeYq86z51v9BdwfkEW2Wr");
// const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const connection = new Connection("https://spring-quick-surf.solana-devnet.quiknode.pro/016ff48f0f7c3f1520e515c01dca9a83ef528317 ", "confirmed");


class PostMetadata {
    constructor({ title, content, image_url, author, date, others }) {
        this.title = title;
        this.content = content;
        this.image_url = image_url;
        this.author = author;
        this.date = date;
        this.others = others;
    }
}

const postMetadataSchema = new Map([
    [PostMetadata, { kind: "struct", fields: [
        ["title", "string"],
        ["content", "string"],
        ["image_url", "string"],
        ["author", "string"],
        ["date", "string"],
        ["others", "string"]
    ]}],
]);

async function fetchMetadataForAccounts() {
    const accountMetadata = [];

    try {
        const programAccounts = await connection.getProgramAccounts(programId, {
            commitment: "confirmed",
            encoding: "base64",
        });

        for (const account of programAccounts) {
            const metadata = deserialize(postMetadataSchema, PostMetadata, Buffer.from(account.account.data, 'base64'));
            console.log(`The account ${account.pubkey} has the data ${JSON.stringify(metadata, null, 2)}`);
            accountMetadata.push({
                pubkey: account.pubkey.toString(),
                metadata,
            });
        }

        return accountMetadata;

    } catch (err) {
        console.error("Error fetching account metadata:", err);
        return [];
    }
}

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/api/metadata", async (req, res) => {
    const metadata = await fetchMetadataForAccounts();
    res.json(metadata);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
