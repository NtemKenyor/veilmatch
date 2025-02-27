### Using the Solana Program

Once the program is deployed, you can interact with it using JavaScript/Anchor in your frontend or backend code.


### 3. **`backend/README.md`**

# Backend API for Solana DApp

This directory contains the Node.js backend that provides an API for interacting with the Solana blockchain. The API allows the frontend to interact with the Solana program by fetching metadata, creating posts, and managing data.

## Directory Structure

- **createPost.js**: Handles the logic for creating new posts on Solana.
- **fetchMetadata.js**: Fetches metadata related to posts stored on the blockchain.
- **get_contract.js**: Contains logic for interacting with the deployed Solana contract.
- **server.js**: The main API server that runs on Node.js and exposes endpoints for the frontend.
- **send_metadata.js**: Sends metadata to the blockchain for storage.
- **node_modules/**: Contains installed dependencies.

## Running the Server

To run the backend server, use the following command:
```bash
node server.js
```
This starts a server on `http://localhost:5000` (or whichever port you configure) and exposes endpoints for the frontend to call.
