const anchor = require("@project-serum/anchor");
const { PublicKey, SystemProgram } = require("@solana/web3.js");
const fs = require("fs");


const postAccount = anchor.web3.Keypair.generate();

// Manually specify account size
const postAccountSpace = 4 + 256 + 4 + 1024 + 4 + 512 + 4 + 128 + 4 + 64 + 4 + 256;

// Initialize the account
await connection.requestAirdrop(wallet.publicKey, 1e9); // Fund wallet
await program.rpc.createPost(
  "title", "content", "url", "author", "date", "others",
  {
    accounts: {
      postAccount: postAccount.publicKey,
      user: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [postAccount],
    preInstructions: [
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: postAccount.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(postAccountSpace),
        space: postAccountSpace,
        programId,
      }),
    ],
  }
);
