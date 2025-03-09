/* 
// Initialize global variables using the window object
if (
    window.location.hostname === "localhost" || 
    window.location.hostname.startsWith("127.") || 
    window.location.hostname === "0.0.0.0"
) {
    // Use localhost URLs
    window.NODE_URL = "http://localhost:3000/cloudS/interact/backend";
    window.PHP_URL = "http://localhost/cloudS/interact/server";
} else {
    // Use live URLs
    window.NODE_URL = "https://roynek.com/cloudS/interact/backend";
    window.PHP_URL = "https://roynek.com/cloudS/interact/server";
}
 */



function getAllUrlParams(url) {
    // Create an object to store the parameters
    let params = {};

    // Get the query string part of the URL
    let queryString = url.split('?')[1];

    if (queryString) {
        // Split the query string into individual key-value pairs
        let pairs = queryString.split('&');

        // Loop through each pair and populate the params object
        pairs.forEach(pair => {
            let [key, value] = pair.split('=');
            params[key] = decodeURIComponent(value || '');
        });
    }

    return params;
}

function getUrlParam(url, paramName) {
    // Get all parameters using the previous function
    let params = getAllUrlParams(url);

    // Return the value of the specified parameter
    return params[paramName] || null;
}

// List of Solana Mainnet RPC endpoints (primary + backups)
var MAINNET_RPC_ENDPOINTS = [
    'https://dry-ancient-lambo.solana-mainnet.quiknode.pro/ed2362f2fb7c1337b00e81d6863eb929d0db2b2e/',
    'https://api.mainnet-beta.solana.com', // Primary
    'https://solana-api.projectserum.com', // Backup 1
    'https://ssc-dao.genesysgo.net', // Backup 2
    'https://solana-mainnet.chainstacklabs.com', // Backup 3
];

// Function to check if an RPC endpoint is reachable
async function isRpcEndpointReachable(url) {
    try {
        const connection = new solanaWeb3.Connection(url, 'confirmed');
        // Fetch the latest block height to test the connection
        await connection.getBlockHeight();
        return true; // Endpoint is reachable
    } catch (error) {
        console.warn(`RPC endpoint ${url} is unreachable:`, error);
        return false; // Endpoint is unreachable
    }
}

// Function to get the first available RPC endpoint
async function getAvailableRpcEndpoint(endpoints) {
    for (const url of endpoints) {
        if (await isRpcEndpointReachable(url)) {
            return url; // Return the first reachable endpoint
        }
    }
    throw new Error('No reachable RPC endpoints found.');
}

// Updated network setup function
async function setupNetwork(network) {
    if (network === "main" || network === "mainnet") {
        window.NODE_URL = "https://roynek.com/veilmatch/backend";
        window.PHP_URL = "https://roynek.com/cloudS/interact/server";
        // Use the first available Mainnet RPC endpoint
        const rpcUrl = await getAvailableRpcEndpoint(MAINNET_RPC_ENDPOINTS);
        window.connection = new solanaWeb3.Connection(rpcUrl, 'confirmed');
        console.log(`Connected to Mainnet RPC: ${rpcUrl}`);
    } else if (network === "dev" || network === "devnet") {
        window.NODE_URL = "https://roynek.com/veilmatch/backend";
        window.PHP_URL = "https://roynek.com/cloudS/interact/server";
        window.connection = new solanaWeb3.Connection('https://spring-quick-surf.solana-devnet.quiknode.pro/016ff48f0f7c3f1520e515c01dca9a83ef528317', 'confirmed');
    } else if (network === "local" || network === "localnet") {
        window.NODE_URL = "http://localhost:3000/veilmatch/backend";
        window.PHP_URL = "http://localhost/cloudS/interact/server";
        window.connection = new solanaWeb3.Connection('http://127.0.0.1:8899', 'confirmed');
    } else {
        throw new Error('Invalid network specified');
    }
}

var url = window.location.href;
// Get all parameters
// let allParams = getAllUrlParams(url);
// console.log(allParams); // { network: 'mainnet', token: 'abc123' }
// Get a specific parameter
var network = getUrlParam(url, 'network');
// console.log(network); // 'mainnet'

// window.NODE_URL = "http://localhost:3000/veilmatch/backend";
// window.NODE_URL = "https://roynek.com/veilmatch/backend";
// window.PHP_URL = "http://localhost";
// window.PHP_URL = "https://roynek.com/cloudS/interact/server";

// Initialize global variables using the window object
if(network != null){
    (async () => {
        try {
            await setupNetwork('mainnet'); // or 'devnet', 'localnet'
            console.log('Network setup complete:', window.connection);
        } catch (error) {
            console.error('Error setting up network:', error);
        }
    })();

    // alert("network provided: "+ network);
}else{
    // alert("no network provided");
    if (
        window.location.hostname === "localhost" || 
        window.location.hostname.startsWith("127.") || 
        window.location.hostname === "0.0.0.0"
    ) {
        // Use localhost URLs
        window.NODE_URL = "http://localhost:3000/veilmatch/backend";
        window.PHP_URL = "http://localhost/cloudS/interact/server";
        window.connection = new solanaWeb3.Connection('http://127.0.0.1:8899', 'confirmed');
        // window.connection = 'http://127.0.0.1:8899';
    } else {
        // Use live URLs - mainnet by default...
        network = "mainnet"; // devnet
        (async () => {
            try {
                await setupNetwork(network); // or 'devnet', 'localnet'
                console.log('Network setup complete:', window.connection);
            } catch (error) {
                console.error('Error setting up network:', error);
            }
        })();
    }
}




// Log the current URLs being used for easy tracking
console.log("Current NODE_URL:", window.NODE_URL);
console.log("Current PHP_URL:", window.PHP_URL);


const baseUrl = window.PHP_URL+'/app.php'; // Replace this with your server URL

if (typeof solanaWeb3 === 'undefined') {
    console.log("solanaWeb3 is not defined. Make sure the Solana Web3 library is loaded.");
}

let keypair;

// Create a new wallet and save private key in localStorage
// async function createWallet() {
//     keypair = solanaWeb3.Keypair.generate();
//     localStorage.setItem('solana_private_key', JSON.stringify(Array.from(keypair.secretKey)));
//     displayWalletInfo();
// }

// Display public key and balance
function displayWalletInfo() {
    document.getElementById('publicKey').textContent = keypair.publicKey.toBase58();
    getBalance();
}

// Retrieve private key from localStorage
function loadStoredWallet() {
    const privateKey = localStorage.getItem('solana_private_key');
    if (privateKey) {
        keypair = solanaWeb3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(privateKey)));
        // displayWalletInfo();
    } else {
        if (confirm('No wallet found. Would you like to go to the homepage to create a new wallet?')) {
            window.location.href = 'index.html'; // Redirects to the homepage
        }
    }
}

let publicKey;


// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadStoredWallet();
    publicKey = keypair.publicKey.toBase58(); // Fetch global public key from cookies
    console.log("The Public Key: ". publicKey);
    
    if (!publicKey) {
        console.log("could not get user Public Key")
    }

    const urlParams = new URLSearchParams(window.location.search);
    const receiverKey = urlParams.get('receiver_publickey');

    if (receiverKey) {
        setActiveChat(receiverKey);
    } else {
        console.log('Please select a receiver to start chatting.');
    }

    fetchConversations();
    // document.getElementById('send-button').addEventListener('click', sendMessage );
    document.getElementById('send-button').addEventListener('click', () => sendMessage());


});

// Fetch public key from cookies
function getPublicKeyFromCookies() {
    const match = document.cookie.match(/(?:^|;\s*)publicKey=([^;]+)/);
    return match ? match[1] : null;
}

// Set or create public key
// async function createAccount() {
//     // Simulate account creation
//     publicKey = 'new-generated-public-key'; // Replace with actual public key generation logic
//     document.cookie = `publicKey=${publicKey}; path=/;`;
//     alert('Account created successfully!');
//     location.reload(); // Reload to initialize the app with the new public key
// }

// Fetch conversations
async function fetchConversations() {
    try {
        const response = await fetch(`${baseUrl}?conversations=true&pubkey=${publicKey}`);
        const conversations = await response.json();
        const conversationList = document.getElementById('conversations-list');
        conversationList.innerHTML = '';

        conversations.forEach(convo => {
            const convoItem = document.createElement('div');
            convoItem.classList.add('conversation');
            convoItem.textContent = convo.other_pubkey;
            convoItem.addEventListener('click', () => setActiveChat(convo.other_pubkey));
            conversationList.appendChild(convoItem);
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
    }
}

// Set active chat user and update URL
async function setActiveChat(user) {
    document.getElementById('active-chat-user').textContent = user;
    const url = new URL(window.location);
    url.searchParams.set('receiver_publickey', user);
    history.replaceState(null, '', url); // Update URL without reloading
    await fetchMessages(user);
}


// Fetch messages for the active chat
/* async function fetchMessages(user) {
    try {
        const response = await fetch(`${baseUrl}?pubkey=${publicKey}&category=chat&r_pubkey=${user}`);
        const messages = await response.json();
        const messagesDisplay = document.getElementById('messages-display');
        messagesDisplay.innerHTML = '';

        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            // messageDiv.classList.add(msg.sender === "You" ? "sender" : "receiver");
            messageDiv.classList.add(msg.sender_pubkey === publicKey ? "sender" : "receiver");
            
            if(msg.media_src){
                // messageDiv.innerHTML = "<img src="+msg.media_src+"/>";
                const img = document.createElement('img');
                img.src = msg.media_src;
                messageDiv.appendChild(img);
            }
            messageDiv.textContent = msg.message;
            messagesDisplay.appendChild(messageDiv);
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}
 */


 // Fetch messages for the active chat
async function fetchMessages(user) {
    try {
        const response = await fetch(`${baseUrl}?pubkey=${publicKey}&category=chat&r_pubkey=${user}`);
        const messages = await response.json();
        const messagesDisplay = document.getElementById('messages-display');
        messagesDisplay.innerHTML = ''; // Clear the display

        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add(msg.sender_pubkey === publicKey ? "sender" : "receiver");

            // Check if media_src is present
            if (msg.media_src) {
                console.log("we got in...");
                // Determine if the media is an image or a video
                // const fileExtension = msg.media_src.split('.').pop().toLowerCase();
                const fileExtension = msg.media_src.split('?')[0].split('.').pop().toLowerCase();

                if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
                    console.log("media is an image");
                    const img = document.createElement('img');
                    img.src = msg.media_src;
                    img.alt = 'Sent Media';
                    img.style.maxWidth = '100%'; // Optional styling
                    messageDiv.appendChild(img);
                } else if (['mp4', 'avi', 'wmv', 'mov', 'mkv'].includes(fileExtension)) {
                    const video = document.createElement('video');
                    video.src = msg.media_src;
                    video.controls = true; // Adds playback controls
                    video.style.maxWidth = '100%'; // Optional styling
                    messageDiv.appendChild(video);
                } else {
                    console.warn(`Unsupported media type: ${msg.media_src}`);
                }
            }

            // Add the text message
            const text = document.createElement('p');
            text.textContent = msg.message;
            messageDiv.appendChild(text);

            // Append the message div to the messages display
            messagesDisplay.appendChild(messageDiv);
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}


 async function sendMessage(senderPubKey=null, receiverPubKey = null, message = "", media = null) {
    // If parameters are not provided, fallback to fetching from DOM or URL
    if (!receiverPubKey) {
        const urlParams = new URLSearchParams(window.location.search);
        receiverPubKey = urlParams.get('receiver_publickey');
    }

    if (!senderPubKey || senderPubKey === null) {
        if (typeof publicKey === 'undefined' || !publicKey) {
            alert('Sender public key is missing. Please login or select a sender.');
            return;
        }
        console.log("senting the pub key");
        var senderPubKey1 = publicKey; // Assume `publicKey` is a global variable 
        // toString to ensure the entire string is returned. and not the pointer
    }else{
        console.log("finding pub key");
        var senderPubKey1 =senderPubKey;
    }

    if (!receiverPubKey) {
        alert('Please select a receiver to start chatting.');
        return;
    }

    // If message is empty, fallback to the input field's value
    if (!message) {
        message = document.getElementById('message-input').value;
    }

    // If media is not provided, fallback to the file input
    if (!media) {
        media = document.getElementById('media-input').files[0];
    }

    const formData = new FormData();
    formData.append('send_message', true);
    formData.append('sender_pubkey', senderPubKey1);
    formData.append('receiver_pubkey', receiverPubKey);
    formData.append('message', message);
    if (media) {
        formData.append('media', media);
    }

    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        console.log(result);

        // Check if the status is "True"
        if (result.status === "True") {
            // alert('Message sent successfully!');
            var relativePub = (senderPubKey1 === publicKey) ? receiverPubKey : senderPubKey1;
            fetchMessages(relativePub); // Refresh messages
            document.getElementById('message-input').value = ""; // Clear message input
            if (receiverPubKey === "AI" || receiverPubKey === "AI-Image-creator"){
                await sendMessage(receiverPubKey, senderPubKey1, message); // reverse it making the AI the sender.
            }
        } else {
            alert('Failed to send message.');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('An error occurred while sending the message.');
    }
}



