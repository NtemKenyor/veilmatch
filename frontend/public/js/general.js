// Toggle Sidebar Function
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('active');
}


// Create Account Function
/*const createAccountBtn = document.getElementById('createAccountBtn');
createAccountBtn.addEventListener('click', function() {
    // Simulate account creation and auto-refresh
    createWallet();
    alert('Account Created!');
    location.reload();  // Simulate auto-refresh after account creation
});*/

// Open Wallet Modal
function openWalletModal() {
    document.getElementById('walletModal').style.display = 'flex';
}

// Close Wallet Modal
function closeWalletModal() {
    document.getElementById('walletModal').style.display = 'none';
}


// Function to format date into a user-friendly string
function formatDate(date) {
    try {
        const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return new Date(date).toLocaleDateString(undefined, options);
    } catch {
        // return "Invalid Date";
        console.log("could not format date properlly");
        return date;
    }
}

// Function to convert markdown content to HTML
function convertMarkdownToHtml(markdown) {
    // Convert headers (e.g., # Heading 1, ## Heading 2, etc.)
    markdown = markdown.replace(/^# (.*?)$/gm, '<h1>$1</h1>');  // Level 1 Header
    markdown = markdown.replace(/^## (.*?)$/gm, '<h2>$1</h2>'); // Level 2 Header
    markdown = markdown.replace(/^### (.*?)$/gm, '<h3>$1</h3>'); // Level 3 Header
    markdown = markdown.replace(/^#### (.*?)$/gm, '<h4>$1</h4>'); // Level 4 Header
    markdown = markdown.replace(/^##### (.*?)$/gm, '<h5>$1</h5>'); // Level 5 Header
    markdown = markdown.replace(/^###### (.*?)$/gm, '<h6>$1</h6>'); // Level 6 Header

    // Convert bold (e.g., **bold** or __bold__)
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    markdown = markdown.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Convert italic (e.g., *italic* or _italic_)
    markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');
    markdown = markdown.replace(/_(.*?)_/g, '<em>$1</em>');

    // Convert images (e.g., ![alt text](image_url))
    markdown = markdown.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    // Convert images (e.g., ![alt text](image_url))
    markdown = markdown.replace(/##\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    // Convert links (e.g., [text](url))
    markdown = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    
    // Convert unordered lists (e.g., - item or * item)
    markdown = markdown.replace(/^\s*[\*\-\+]\s*(.*)$/gm, '<ul><li>$1</li></ul>');

    // Convert ordered lists (e.g., 1. item)
    markdown = markdown.replace(/^\d+\.\s*(.*)$/gm, '<ol><li>$1</li></ol>');

    // Convert inline code (e.g., `code`)
    markdown = markdown.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert block code (e.g., ```code block```)
    markdown = markdown.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');

    // Convert newlines to <br> for paragraphs
    markdown = markdown.replace(/\n/g, '<br>');

    // markdown = markdown.replace(
    //     /\{\{element\|type=([^\|]+)\|src=([^\|]+)\|width=([^\|]+)\|height=([^\|]+)\}\}/g,
    //     '<$1 class="some_more_content" src="$2" width="$3" height="$4" frameborder="0" allowfullscreen></$1>'
    // );

    markdown = markdown.replace(
        /\{\{element\|type=([^\|]+)\|src=([^\|]+)\}\}/g,
        '<$1 class="some_more_content" src="$2" frameborder="0" allowfullscreen></$1>'
    );

    return markdown;
}


// Function to sort posts by date (valid dates first, invalid ones at the bottom)
function sortPostsByDate(posts) {
    try {
        return posts.sort((a, b) => {
            const dateA = new Date(a.metadata.date);
            const dateB = new Date(b.metadata.date);

            if (isNaN(dateA) && isNaN(dateB)) return 0; // Both invalid
            if (isNaN(dateA)) return 1; // A is invalid
            if (isNaN(dateB)) return -1; // B is invalid

            return dateB - dateA; // Most recent first
        });
    } catch (error) {
        console.warn("Error during sorting. Falling back to default order:", error);
        return posts; // Return posts unsorted as fallback
    }
}

// Check if solanaWeb3 is defined
if (typeof solanaWeb3 === 'undefined') {
    alert("solanaWeb3 is not defined. Make sure the Solana Web3 library is loaded.");
}

let keypair;

// Function to determine if running on localhost
/* function isLocalhost() {
    // Check for typical localhost scenarios
    const hostname = typeof window !== 'undefined' ? window.location.hostname : null;
    return hostname === "localhost" || hostname === "127.0.0.1";
};

// Set connection endpoint based on environment
const rpcUrl = isLocalhost()
    ? "http://127.0.0.1:8899" // Localhost endpoint
    : "https://spring-quick-surf.solana-devnet.quiknode.pro/016ff48f0f7c3f1520e515c01dca9a83ef528317 "; // Live server endpoint

const connection = new Connection(rpcUrl, "confirmed");
    */

// const connection = new solanaWeb3.Connection('https://spring-quick-surf.solana-devnet.quiknode.pro/016ff48f0f7c3f1520e515c01dca9a83ef528317 ', 'confirmed');
// const connection = new solanaWeb3.Connection('http://127.0.0.1:8899', 'confirmed');


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
/* var MAINNET_RPC_ENDPOINTS = [
    'https://dry-ancient-lambo.solana-mainnet.quiknode.pro/ed2362f2fb7c1337b00e81d6863eb929d0db2b2e/',
    'https://api.mainnet-beta.solana.com', // Primary
    'https://solana-api.projectserum.com', // Backup 1
    'https://ssc-dao.genesysgo.net', // Backup 2
    'https://solana-mainnet.chainstacklabs.com', // Backup 3
];
 */
var MAINNET_RPC_ENDPOINTS = [
    'https://rpc.mainnet-alpha.sonic.game',
    'https://api.mainnet-alpha.sonic.game', // Primary
    'https://sonic.helius-rpc.com/', // Backup 1
    // 'https://ssc-dao.genesysgo.net', // Backup 2
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
async function setupNetworkbyUrl(network) {
    if (network === "main" || network === "mainnet") {
        window.NODE_URL = "https://roynek.com/veilmatch/backend";
        window.PHP_URL = "https://roynek.com/cloudS/interact/server";
        // Use the first available Mainnet RPC endpoint
        const rpcUrl = await getAvailableRpcEndpoint(MAINNET_RPC_ENDPOINTS);
        window.connection = await new solanaWeb3.Connection(rpcUrl, 'confirmed');
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


// console.log(network); // 'mainnet'

async function setupNetwork(network){
    // Initialize global variables using the window object
    if(network != null){
        (async () => {
            try {
                await setupNetwork(network); // or 'devnet', 'localnet'
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
            // window.NODE_URL = "https://roynek.com/veilmatch/backend";
            // window.PHP_URL = "https://roynek.com/cloudS/interact/server";
            // window.connection = new solanaWeb3.Connection('https://spring-quick-surf.solana-devnet.quiknode.pro/016ff48f0f7c3f1520e515c01dca9a83ef528317', 'confirmed');
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
    console.log("Current Blockchain Network:", window.connection);
}


// Initialize global variables using the window object
/* if (
    window.location.hostname === "localhost" || 
    window.location.hostname.startsWith("127.") || 
    window.location.hostname === "0.0.0.0"
) {
    // Use localhost URLs
    window.NODE_URL = "http://localhost:3000/veilmatch/backend";
    window.PHP_URL = "http://localhost/cloudS/interact/server";
    window.connection = new solanaWeb3.Connection('http://127.0.0.1:8899', 'confirmed');
} else {
    // Use live URLs
    window.NODE_URL = "https://roynek.com/veilmatch/backend";
    // window.NODE_URL = "http://localhost:3000/program-NtemKenyor/backend"; // jUST NODE LOCALHOST TO TEST HERE..
    window.PHP_URL = "https://roynek.com/cloudS/interact/server";
    window.connection = new solanaWeb3.Connection('https://spring-quick-surf.solana-devnet.quiknode.pro/016ff48f0f7c3f1520e515c01dca9a83ef528317 ', 'confirmed');
} */


/* async function loadPosts() {
    try {
        const response = await fetch(window.NODE_URL+"/api/metadata");
        const data = await response.json();

        console.log("Fetched Data:", data);

        // Try to sort posts
        const sortedData = sortPostsByDate(data);

        const postsContainer = document.getElementById("d_post_arena");
        postsContainer.innerHTML = "";

        sortedData.forEach((entry) => {
            const post = entry.metadata;
            const postDiv = document.createElement("div");
            postDiv.className = "post";

            // Trim lengthy author names and add tooltip/popover for the full content
            const trimmedAuthor = post.author.length > 15 
                ? `${post.author.slice(0, 12)}...` 
                : post.author;

            const imageTag = post.image_url ? `<img src="${post.image_url}" alt="Post Image">` : "";
            const titleDiv = post.title ? `<div class="title">${post.title}</div>` : "";

            // Convert markdown to HTML content
            const postContent = convertMarkdownToHtml(post.content);

            postDiv.innerHTML = `
                ${imageTag}
                <div class="post-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M5.5 21h13a8.4 8.4 0 0 0-13 0z"></path>
                    </svg>
                    <span class="username" title="${post.author}">${trimmedAuthor}</span>
                </div>
                ${titleDiv}
                <div class="content">${postContent}</div>
                <div class="date">${post.date}</div>
                <div class="author">Posted by: ${post.author}</div>
                <div class="post-actions">
                    <button class="like-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                            <path d="M8.864.46c-.743-.794-1.97-.795-2.714-.003-.329.354-.597.906-.89 1.54-.29.632-.591 1.295-.806 1.977-.214.678-.432 1.519-.579 2.59-.146 1.053-.279 2.113-.34 2.978h4.448c.416 0 .768.275.855.68l.262 1.18c.117.523.323.799.543.9.227.106.462.113.774.113.303 0 .616-.002.927-.002.682 0 1.423.078 2.02.482.604.407.993 1.105.993 2.516 0 .87-.256 1.336-.638 1.52-.369.177-.874.255-1.304.255-.393 0-.897-.065-1.261-.264-.366-.199-.632-.513-.762-.857a1.5 1.5 0 0 1-.781 1.008c-.406.228-.91.306-1.349.306H9c-1.454 0-2.208-.895-2.438-1.745l-.766-3.532H1.5a.5.5 0 0 1-.5-.5v-1.4a.5.5 0 0 1 .5-.5H6c.015-.513.022-1.024.05-1.548.036-.619.093-1.252.175-1.885.165-1.263.402-2.507.682-3.368C7.1 1.393 7.345.99 7.598.773 7.861.548 8.142.45 8.864.46z"/>
                        </svg>
                        Like
                    </button>
                    <button class="share-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                            <path d="M13.5 1a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5V5.707l-2.146 2.147a.5.5 0 0 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V9h5V2.5A1.5 1.5 0 0 1 13.5 1z"/>
                        </svg>
                        Share
                    </button>
                </div>
            `;

            // Add event listeners for like and share buttons
            postDiv.querySelector(".like-button").addEventListener("click", (event) => {
                event.stopPropagation();
                alert(`You liked: "${post.title}"`);
            });

            postDiv.querySelector(".share-button").addEventListener("click", (event) => {
                event.stopPropagation();
                alert(`You shared: "${post.title}"`);
            });

            postsContainer.appendChild(postDiv);
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}
*/

const default_post = [
    {
        "pubkey": "5vDfnGGr6VzDCM2hAtCx3h1G113FC5SFm5hMs88Nf7yR",
        "metadata": {
            "title": "The Ocean Side: Play Now.",
            "content": "In the deepest part of the Ocean, A man survived with animals that are yet to be known to humans. Here is his story: Play Now:\n\n{{element|type=iframe|src=https://roynek.com/cloudS/interact/public/aquatic_SOON/index.html}}",
            "image_url": "",
            "author": "Game Republic",
            "date": "2024-12-22T20:06:54.116Z",
            "others": "{\"nft\":\"false\",\"nude\":\"false\",\"encryption\":\"\",\"share\":\"false\",\"comment\":\"false\",\"main_post_id\":\"\",\"category\":\"entertainment\",\"hash\":\"\",\"pubkey\":\"BSsCnFimdYBKhrt4gvaCePxiXcooVZvexs39yEzwoMp1\",\"ip\":\"\",\"geo\":\"LAT, LONG\",\"others\":\"\"}"
        }
    },
    {
        "pubkey": "7e7hsdUV7zYHFocoDqL6TDBBtt28Z1o9sTj3aThPrQx8",
        "metadata": {
            "title": "",
            "content": "Glad to be here and thank you all for having me.",
            "image_url": "",
            "author": "BSsCnFimdYBKhrt4gvaCePxiXcooVZvexs39yEzwoMp1",
            "date": "2024-12-22T08:20:28.863Z",
            "others": "{\"nft\":\"false\",\"nude\":\"false\",\"encryption\":\"\",\"share\":\"false\",\"comment\":\"false\",\"main_post_id\":\"\",\"category\":\"entertainment\",\"hash\":\"\",\"pubkey\":\"BSsCnFimdYBKhrt4gvaCePxiXcooVZvexs39yEzwoMp1\",\"ip\":\"\",\"geo\":\"LAT, LONG\",\"others\":\"\"}"
        }
    },
    {
        "pubkey": "6EeY4ZMyWBzJZktvmb3ssW2U7u3XhJspn3kWCvAy4JAm",
        "metadata": {
            "title": "Love can break boundaries .",
            "content": "Love is in the air.\n\n![Image Description](https://i.pinimg.com/originals/46/6d/e2/466de2542ca09cc32296f192828ca97f.jpg)",
            "image_url": "",
            "author": "Caterine",
            "date": "2024-12-05T08:35:06.671Z",
            "others": "{\"nft\":\"false\",\"nude\":\"false\",\"encryption\":\"\",\"share\":\"false\",\"comment\":\"false\",\"main_post_id\":\"\",\"category\":\"entertainment\",\"hash\":\"\",\"pubkey\":\"CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP\",\"ip\":\"\",\"geo\":\"LAT, LONG\",\"others\":\"\"}"
        }
    },
    {
        "pubkey": "D4dmhxMz8hC3giooJGu5ZgSMhh3UZawcoZZTNqYwJiEZ",
        "metadata": {
            "title": "",
            "content": "I love sharing my ideas with my man.\n\n![Image Description](https://img.freepik.com/free-photo/sexy-business-woman-wearing-blue-suit-sitting-summer-cafe_285396-7921.jpg)",
            "image_url": "",
            "author": "CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP",
            "date": "2024-12-05T08:33:10.923Z",
            "others": "{\"nft\":\"false\",\"nude\":\"false\",\"encryption\":\"\",\"share\":\"false\",\"comment\":\"false\",\"main_post_id\":\"\",\"category\":\"entertainment\",\"hash\":\"\",\"pubkey\":\"CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP\",\"ip\":\"\",\"geo\":\"LAT, LONG\",\"others\":\"\"}"
        }
    },
    {
        "pubkey": "CkbgVhTUYZqhRd5AcRvHKTiWztKBozPvnFVhmnvq5NxT",
        "metadata": {
            "title": "",
            "content": "Protecting my personality and beauty.\n\n![Image Description](https://i0.wp.com/hellobombshell.com/wp-content/uploads/2018/11/aissatatdiallo_93101829_3163076930391575_4234537518130603650_n.jpg)",
            "image_url": "",
            "author": "CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP",
            "date": "2024-12-05T08:31:22.163Z",
            "others": "{\"nft\":\"false\",\"nude\":\"false\",\"encryption\":\"\",\"share\":\"false\",\"comment\":\"false\",\"main_post_id\":\"\",\"category\":\"entertainment\",\"hash\":\"\",\"pubkey\":\"CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP\",\"ip\":\"\",\"geo\":\"LAT, LONG\",\"others\":\"\"}"
        }
    },
    {
        "pubkey": "BcPTqZjSrhLdDenoayb2Mjkt6Ki9rEbgDbf4neby9HCG",
        "metadata": {
            "title": "",
            "content": "Love is all I want.\n\n![Image Description](https://i0.wp.com/hellobombshell.com/wp-content/uploads/2020/10/megan.milan_93029884_101970378117711_6091947512926847953_n.jpg?resize=820%2C1024&ssl=1)",
            "image_url": "",
            "author": "CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP",
            "date": "2024-12-05T08:29:52.593Z",
            "others": "{\"nft\":\"false\",\"nude\":\"false\",\"encryption\":\"\",\"share\":\"false\",\"comment\":\"false\",\"main_post_id\":\"\",\"category\":\"entertainment\",\"hash\":\"\",\"pubkey\":\"CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP\",\"ip\":\"\",\"geo\":\"LAT, LONG\",\"others\":\"\"}"
        }
    },
    {
        "pubkey": "Nvme9TgVcQLZQBQDGq44x3tAv7ULxZTSth3wKnpHorB",
        "metadata": {
            "title": "",
            "content": "Open to date. Hit me up...",
            "image_url": "https://w0.peakpx.com/wallpaper/256/100/HD-wallpaper-beautiful-girl-cute-pretty-sexy-girl.jpg",
            "author": "Pauline",
            "date": "2024-12-05T08:27:43.925Z",
            "others": "{\"nft\":\"false\",\"nude\":\"false\",\"encryption\":\"\",\"share\":\"false\",\"comment\":\"false\",\"main_post_id\":\"\",\"category\":\"entertainment\",\"hash\":\"\",\"pubkey\":\"CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP\",\"ip\":\"\",\"geo\":\"LAT, LONG\",\"others\":\"\"}"
        }
    },
    {
        "pubkey": "2nfmBr7dxUQyuYSrrpcZnoByBXe2gmGYLbZaCAgLtZgM",
        "metadata": {
            "title": "",
            "content": "I am an adult movie star and I really want someone that would love me for me. I have been into a lot of relationships and people just keep judging me because of the nature of my job. I want a relationship that helps me grow.\n\n![Image Description](https://thumbs.dreamstime.com/b/pretty-sexy-cute-girl-woman-tight-dress-shows-off-legs-long-curly-blonde-hair-curls-urban-portraits-setting-143928000.jpg)",
            "image_url": "",
            "author": "CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP",
            "date": "2024-12-05T08:26:16.800Z",
            "others": "{\"nft\":\"false\",\"nude\":\"false\",\"encryption\":\"\",\"share\":\"false\",\"comment\":\"false\",\"main_post_id\":\"\",\"category\":\"entertainment\",\"hash\":\"\",\"pubkey\":\"CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP\",\"ip\":\"\",\"geo\":\"LAT, LONG\",\"others\":\"\"}"
        }
    },
    {
        "pubkey": "EW12GRfpm4XZxZM47Te8ZafVVztiZywuTYDcKxuDmAtg",
        "metadata": {
            "title": "In search of Love.",
            "content": "I am a bold proud African Lady. I want to connect with non-African men(Because I just love diversity and foreigners ).\n\n",
            "image_url": "https://source.boomplaymusic.com/buzzgroup2/M00/38/09/rBEe_GKrLp6AQZ57AAIEdn_WNt8502.jpg",
            "author": "EKo",
            "date": "2024-12-05T08:22:49.035Z",
            "others": "{\"nft\":\"false\",\"nude\":\"false\",\"encryption\":\"\",\"share\":\"false\",\"comment\":\"false\",\"main_post_id\":\"\",\"category\":\"entertainment\",\"hash\":\"\",\"pubkey\":\"CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP\",\"ip\":\"\",\"geo\":\"LAT, LONG\",\"others\":\"\"}"
        }
    },
    {
        "pubkey": "Cjb2KsSbBivyef5aGaFkDGxnsFFVpXjxiZqd7S9eVJ1N",
        "metadata": {
            "title": "",
            "content": "I love fashion and I need a man that can share the same dreams as I do...\n\n![Image Description](https://i.pinimg.com/736x/2c/9b/5a/2c9b5a9fded5276ee4312f884b15f42f.jpg)",
            "image_url": "",
            "author": "Helen",
            "date": "2024-12-05T08:20:08.428Z",
            "others": "{\"nft\":\"false\",\"nude\":\"false\",\"encryption\":\"\",\"share\":\"false\",\"comment\":\"false\",\"main_post_id\":\"\",\"category\":\"entertainment\",\"hash\":\"\",\"pubkey\":\"CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP\",\"ip\":\"\",\"geo\":\"LAT, LONG\",\"others\":\"\"}"
        }
    },
    {
        "pubkey": "FEdrJv5oFfs6L7Pd9VTHVEhT78EKXs7nr6pcSRf96w9B",
        "metadata": {
            "title": "Looking for Love.",
            "content": "I and my sister are so connected that we both have agreed to get in a relationship with a man. We just need a man that would treat us together as one and that would deeply love us.\n\n![Our Photo](https://thumbs.dreamstime.com/b/two-pretty-girl-friends-17593144.jpg)\n\nAbove is our photo.",
            "image_url": "",
            "author": "Joy and Mary",
            "date": "2024-12-05T08:15:04.699Z",
            "others": "{\"nft\":\"false\",\"nude\":\"false\",\"encryption\":\"\",\"share\":\"false\",\"comment\":\"false\",\"main_post_id\":\"\",\"category\":\"entertainment\",\"hash\":\"\",\"pubkey\":\"CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP\",\"ip\":\"\",\"geo\":\"LAT, LONG\",\"others\":\"\"}"
        }
    },
    {
        "pubkey": "ED7izbxoAkhNKWnYKukmrmw7DuT5QbvCkY23vrGkFSMr",
        "metadata": {
            "title": "",
            "content": "I am Andre Jane and I love men that are God fearing and are financially free. I am a CEO and I am looking out for men that would fit my energy and style. I am open to conversations:\n\n![Andre's Photo](https://i.pinimg.com/736x/6d/59/36/6d59367f06bd7350e087785cd5653c28.jpg)",
            "image_url": "",
            "author": "CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP",
            "date": "2024-12-05T08:10:50.488Z",
            "others": "{\"nft\":\"false\",\"nude\":\"false\",\"encryption\":\"\",\"share\":\"false\",\"comment\":\"false\",\"main_post_id\":\"\",\"category\":\"entertainment\",\"hash\":\"\",\"pubkey\":\"CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP\",\"ip\":\"\",\"geo\":\"LAT, LONG\",\"others\":\"\"}"
        }
    },
    {
        "pubkey": "C7sdVRG9PkRdi61yNLiLUY1QQWb3vXtjMRY6cWNH3zfa",
        "metadata": {
            "title": "",
            "content": "All I want is true love and I am in search of true love. hit me up, I am willing to connect.",
            "image_url": "",
            "author": "CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP",
            "date": "2024-12-05T07:49:48.526Z",
            "others": "{\"nft\":\"false\",\"nude\":\"false\",\"encryption\":\"\",\"share\":\"false\",\"comment\":\"false\",\"main_post_id\":\"\",\"category\":\"entertainment\",\"hash\":\"\",\"pubkey\":\"CvPigo8NKEtYhAKGuwaYxtBv76F4a6kXYYfSPpwZK7pP\",\"ip\":\"\",\"geo\":\"LAT, LONG\",\"others\":\"\"}"
        }
    }
]

/* // Default posts to use if the server fetch fails or to append to the fetched data
const default_post = [
    {
        "pubkey": "5vDfnGGr6VzDCM2hAtCx3h1G113FC5SFm5hMs88Nf7yR",
        "metadata": {
            "title": "The Ocean Side: Play Now.",
            "content": "In the deepest part of the Ocean, A man survived with animals that are yet to be known to humans. Here is his story: Play Now:\n\n{{element|type=iframe|src=https://roynek.com/cloudS/interact/public/aquatic_SOON/index.html}}",
            "image_url": "",
            "author": "Game Republic",
            "date": "2024-12-22T20:06:54.116Z",
            "others": "{\"nft\":\"false\",\"nude\":\"false\",\"encryption\":\"\",\"share\":\"false\",\"comment\":\"false\",\"main_post_id\":\"\",\"category\":\"entertainment\",\"hash\":\"\",\"pubkey\":\"BSsCnFimdYBKhrt4gvaCePxiXcooVZvexs39yEzwoMp1\",\"ip\":\"\",\"geo\":\"LAT, LONG\",\"others\":\"\"}"
        }
    },
    // Add more default posts here...
]; */

// Function to randomly shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function loadPosts() {
    try {
        // Fetch posts from the server
        const response = await fetch(window.NODE_URL + `/api/metadata?network=${network}`);
        const data = await response.json();

        console.log("Fetched Data:", data);

        // Randomly shuffle the default posts
        const shuffledDefaultPosts = shuffleArray([...default_post]);

        // Sort the combined data by date
        const sortedData = sortPostsByDate(data);

        // Combine fetched data with shuffled default posts
        // const combinedData = [...data, ...shuffledDefaultPosts];
        sortedData = [...sortedData, ...shuffledDefaultPosts];

        // // Sort the combined data by date
        // const sortedData = sortPostsByDate(combinedData);

        // Render the posts
        const postsContainer = document.getElementById("d_post_arena");
        postsContainer.innerHTML = "";

        sortedData.forEach((entry) => {
            const post = entry.metadata;
            const postDiv = document.createElement("div");
            postDiv.className = "post";

            const trimmedAuthor = post.author.length > 15
                ? `${post.author.slice(0, 12)}...`
                : post.author;

            const imageTag = post.image_url ? `<img src="${post.image_url}" alt="Post Image">` : "";
            const titleDiv = post.title ? `<div class="title">${post.title}</div>` : "";

            postDiv.innerHTML = `
                ${imageTag}
                <div class="post-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M5.5 21h13a8.4 8.4 0 0 0-13 0z"></path>
                    </svg>
                    <span class="username" title="${post.author}">${trimmedAuthor}</span>
                </div>
                ${titleDiv}
                <div class="content">${convertMarkdownToHtml(post.content)}</div>
                <div class="date">${formatDate(post.date)}</div>
                <div class="author" title="${post.author}>Posted by: ${trimmedAuthor}</div>
                <br/>
                
                <div class="post-actions">
                    <button class="like-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                            <path d="M8.864.46c-.743-.794-1.97-.795-2.714-.003-.329.354-.597.906-.89 1.54-.29.632-.591 1.295-.806 1.977-.214.678-.432 1.519-.579 2.59-.146 1.053-.279 2.113-.34 2.978h4.448c.416 0 .768.275.855.68l.262 1.18c.117.523.323.799.543.9.227.106.462.113.774.113.303 0 .616-.002.927-.002.682 0 1.423.078 2.02.482.604.407.993 1.105.993 2.516 0 .87-.256 1.336-.638 1.52-.369.177-.874.255-1.304.255-.393 0-.897-.065-1.261-.264-.366-.199-.632-.513-.762-.857a1.5 1.5 0 0 1-.781 1.008c-.406.228-.91.306-1.349.306H9c-1.454 0-2.208-.895-2.438-1.745l-.766-3.532H1.5a.5.5 0 0 1-.5-.5v-1.4a.5.5 0 0 1 .5-.5H6c.015-.513.022-1.024.05-1.548.036-.619.093-1.252.175-1.885.165-1.263.402-2.507.682-3.368C7.1 1.393 7.345.99 7.598.773 7.861.548 8.142.45 8.864.46z"/>
                        </svg>
                        Like
                    </button>
                    <button class="share-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                            <path d="M13.5 1a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5V5.707l-2.146 2.147a.5.5 0 0 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V9h5V2.5A1.5 1.5 0 0 1 13.5 1z"/>
                        </svg>
                        Share
                    </button>
                </div>
            `;

            // Like Button Alert
            postDiv.querySelector(".like-button").addEventListener("click", async (event) => {
                event.stopPropagation();
                await d_post_liker(entry);
                alert(`You liked: "${post.title}"`);
            });

            // Share Button Alert
            postDiv.querySelector(".share-button").addEventListener("click", async (event) => {
                event.stopPropagation();
                await d_post_sharer(entry);
                alert(`You shared: "${post.title}"`);
            });

            // Add an onclick event for the entire post
            postDiv.addEventListener("click", (event) => {
                if (event.target.closest("button")) return; // Ignore clicks on buttons
                showPostPopup(post);
            });

            postsContainer.appendChild(postDiv);
        });
    } catch (error) {
        console.error("Error loading posts:", error);

        // If fetching fails, use the shuffled default posts
        const shuffledDefaultPosts = shuffleArray([...default_post]);
        const sortedData = sortPostsByDate(shuffledDefaultPosts);

        const postsContainer = document.getElementById("d_post_arena");
        postsContainer.innerHTML = "";

        sortedData.forEach((entry) => {
            const post = entry.metadata;
            const postDiv = document.createElement("div");
            postDiv.className = "post";

            const trimmedAuthor = post.author.length > 15
                ? `${post.author.slice(0, 12)}...`
                : post.author;

            const imageTag = post.image_url ? `<img src="${post.image_url}" alt="Post Image">` : "";
            const titleDiv = post.title ? `<div class="title">${post.title}</div>` : "";

            postDiv.innerHTML = `
                ${imageTag}
                <div class="post-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M5.5 21h13a8.4 8.4 0 0 0-13 0z"></path>
                    </svg>
                    <span class="username" title="${post.author}">${trimmedAuthor}</span>
                </div>
                ${titleDiv}
                <div class="content">${convertMarkdownToHtml(post.content)}</div>
                <div class="date">${formatDate(post.date)}</div>
                <div class="author" title="${post.author}>Posted by: ${trimmedAuthor}</div>
                <br/>
                
                <div class="post-actions">
                    <button class="like-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                            <path d="M8.864.46c-.743-.794-1.97-.795-2.714-.003-.329.354-.597.906-.89 1.54-.29.632-.591 1.295-.806 1.977-.214.678-.432 1.519-.579 2.59-.146 1.053-.279 2.113-.34 2.978h4.448c.416 0 .768.275.855.68l.262 1.18c.117.523.323.799.543.9.227.106.462.113.774.113.303 0 .616-.002.927-.002.682 0 1.423.078 2.02.482.604.407.993 1.105.993 2.516 0 .87-.256 1.336-.638 1.52-.369.177-.874.255-1.304.255-.393 0-.897-.065-1.261-.264-.366-.199-.632-.513-.762-.857a1.5 1.5 0 0 1-.781 1.008c-.406.228-.91.306-1.349.306H9c-1.454 0-2.208-.895-2.438-1.745l-.766-3.532H1.5a.5.5 0 0 1-.5-.5v-1.4a.5.5 0 0 1 .5-.5H6c.015-.513.022-1.024.05-1.548.036-.619.093-1.252.175-1.885.165-1.263.402-2.507.682-3.368C7.1 1.393 7.345.99 7.598.773 7.861.548 8.142.45 8.864.46z"/>
                        </svg>
                        Like
                    </button>
                    <button class="share-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                            <path d="M13.5 1a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5V5.707l-2.146 2.147a.5.5 0 0 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V9h5V2.5A1.5 1.5 0 0 1 13.5 1z"/>
                        </svg>
                        Share
                    </button>
                </div>
            `;

            // Like Button Alert
            postDiv.querySelector(".like-button").addEventListener("click", async (event) => {
                event.stopPropagation();
                await d_post_liker(entry);
                alert(`You liked: "${post.title}"`);
            });

            // Share Button Alert
            postDiv.querySelector(".share-button").addEventListener("click", async (event) => {
                event.stopPropagation();
                await d_post_sharer(entry);
                alert(`You shared: "${post.title}"`);
            });

            // Add an onclick event for the entire post
            postDiv.addEventListener("click", (event) => {
                if (event.target.closest("button")) return; // Ignore clicks on buttons
                showPostPopup(post);
            });

            postsContainer.appendChild(postDiv);
        });
    }
}

/* async function loadPosts() {
    try {
        // const response = await fetch( window.NODE_URL+"/api/metadata");
        const response = await fetch( window.NODE_URL+"/api/metadata");
        // https://api.quicknode.com/functions/rest/v1/functions/383e033e-937a-4338-8e7a-129e357baed5/call
        const data = await response.json();

        console.log("Fetched Data:", data);

        const sortedData = sortPostsByDate(data);

        const postsContainer = document.getElementById("d_post_arena");
        postsContainer.innerHTML = "";

        sortedData.forEach((entry) => {
            const post = entry.metadata;
            const postDiv = document.createElement("div");
            postDiv.className = "post";

            const trimmedAuthor = post.author.length > 15
                ? `${post.author.slice(0, 12)}...`
                : post.author;

            // const trimmedPubkey = entry.pubkey.length > 15
            //     ? `${entry.pubkey.slice(0, 12)}...`
            //     : entry.pubkey;

            const imageTag = post.image_url ? `<img src="${post.image_url}" alt="Post Image">` : "";
            const titleDiv = post.title ? `<div class="title">${post.title}</div>` : "";

            postDiv.innerHTML = `
                ${imageTag}
                <div class="post-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M5.5 21h13a8.4 8.4 0 0 0-13 0z"></path>
                    </svg>
                    <span class="username" title="${post.author}">${trimmedAuthor}</span>
                </div>
                ${titleDiv}
                <div class="content">${convertMarkdownToHtml(post.content)}</div>
                <div class="date">${formatDate(post.date)}</div>
                <div class="author" title="${post.author}>Posted by: ${trimmedAuthor}</div>
                <br/>
                
                <div class="post-actions">
                    <button class="like-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                            <path d="M8.864.46c-.743-.794-1.97-.795-2.714-.003-.329.354-.597.906-.89 1.54-.29.632-.591 1.295-.806 1.977-.214.678-.432 1.519-.579 2.59-.146 1.053-.279 2.113-.34 2.978h4.448c.416 0 .768.275.855.68l.262 1.18c.117.523.323.799.543.9.227.106.462.113.774.113.303 0 .616-.002.927-.002.682 0 1.423.078 2.02.482.604.407.993 1.105.993 2.516 0 .87-.256 1.336-.638 1.52-.369.177-.874.255-1.304.255-.393 0-.897-.065-1.261-.264-.366-.199-.632-.513-.762-.857a1.5 1.5 0 0 1-.781 1.008c-.406.228-.91.306-1.349.306H9c-1.454 0-2.208-.895-2.438-1.745l-.766-3.532H1.5a.5.5 0 0 1-.5-.5v-1.4a.5.5 0 0 1 .5-.5H6c.015-.513.022-1.024.05-1.548.036-.619.093-1.252.175-1.885.165-1.263.402-2.507.682-3.368C7.1 1.393 7.345.99 7.598.773 7.861.548 8.142.45 8.864.46z"/>
                        </svg>
                        Like
                    </button>
                    <button class="share-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                            <path d="M13.5 1a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5V5.707l-2.146 2.147a.5.5 0 0 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V9h5V2.5A1.5 1.5 0 0 1 13.5 1z"/>
                        </svg>
                        Share
                    </button>
                </div>
            `;


            // document.getElementById('postForm').addEventListener('submit', async (event) => {});

            // Like Button Alert
            postDiv.querySelector(".like-button").addEventListener("click", async (event) => {
                event.stopPropagation();
                await d_post_liker(entry);
                alert(`You liked: "${post.title}"`);
            });

            // Share Button Alert
            postDiv.querySelector(".share-button").addEventListener("click", async (event) => {
                event.stopPropagation();
                await d_post_sharer(entry);
                alert(`You shared: "${post.title}"`);
            });

            // Add an onclick event for the entire post
            postDiv.addEventListener("click", (event) => {
                if (event.target.closest("button")) return; // Ignore clicks on buttons
                showPostPopup(post);
            });

            postsContainer.appendChild(postDiv);
        });
    } catch (error) {
        console.error("Error loading posts:", error);
    }
} */


// Function to show post details in a popup
function showPostPopup(post) {
    const popupContainer = document.createElement("div");
    popupContainer.className = "popupFullPost-container";

    popupContainer.innerHTML = `
        <div class="popup-box-drill">
            <button class="close-popup-FullPost">&times;</button>
            <h2>${post.title || ""}</h2>
            <br/>
            ${post.image_url ? `<img src="${post.image_url}" alt="Post Image">` : ""}
            <br/>
            <div>${convertMarkdownToHtml(post.content)}</div>
            <br/>
            <p><strong>Author:</strong> ${post.author}</p>
            <p><strong>Date:</strong> ${formatDate(post.date)}</p>
        </div>
    `;

    // Close popup logic
    popupContainer.querySelector(".close-popup-FullPost").addEventListener("click", () => {
        popupContainer.remove();
    });

    document.body.appendChild(popupContainer);
}



// Display Balance (example logic, replace with actual blockchain connection logic)
let userWallet = localStorage.getItem('userWallet');
const balanceDisplay = document.getElementById('balance');
const publicKeyDisplayer = document.getElementById('publicKey');

// if (userWallet) {
//     balanceDisplay.textContent = 'Balance: ' + (Math.random() * 100).toFixed(2) + ' SOL';  // Example balance
// } else {
//     createAccountBtn.style.display = 'block';
// }

// Create Wallet Function (already in your code)
/*  async function createWallet() {
    keypair = solanaWeb3.Keypair.generate();
    localStorage.setItem('solana_private_key', JSON.stringify(Array.from(keypair.secretKey)));
    displayWalletInfo();
    closeWalletModal();
    alert('New wallet created successfully!');
} */



// Create a new wallet and save private key in localStorage
async function createWallet() {
    keypair = solanaWeb3.Keypair.generate();
    localStorage.setItem('solana_private_key', JSON.stringify(Array.from(keypair.secretKey)));
    displayWalletInfo();
    closeWalletModal();
    alert('New wallet created successfully!');
    location.reload();
}

// Display public key and balance
function displayWalletInfo() {
    // document.getElementById('publicKey').textContent = keypair.publicKey.toBase58();
    getBalance();
}

// Retrieve private key from localStorage
/* function loadStoredWallet() {
    const privateKey = localStorage.getItem('solana_private_key');
    if (privateKey) {
        keypair = solanaWeb3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(privateKey)));
        displayWalletInfo();
    } else {
        createAccountBtn.style.display = 'block';
        alert('No wallet found. Please create a new wallet.');
    }
} */

function loadStoredWallet() {
    const privateKey = localStorage.getItem('solana_private_key');
    const accountIcon = document.getElementById('accountIcon');
    const postBtn = document.getElementById("createPostBtn");

    if (privateKey) {
        keypair = solanaWeb3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(privateKey)));
        displayWalletInfo();
        accountIcon.style.display = 'block';  // Show the icon if the wallet is loaded
        postBtn.style.display = 'block';
    } else {
        accountIcon.style.display = 'none';  // Hide the icon if no wallet is found
        createAccountBtn.style.display = 'block';
        document.getElementById("profilepopup").style.display = "none";
        // alert('No wallet found. Please create a new wallet.');
    }
}


// Download private key as a JSON file
function downloadPrivateKey() {
    if (!keypair) {
        alert('No wallet found. Create or load a wallet first.');
        return;
    }
    const privateKey = JSON.stringify(Array.from(keypair.secretKey));
    const blob = new Blob([privateKey], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'solana_private_key.json';
    link.click();
}

// Load private key from uploaded file
function loadPrivateKeyFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const privateKeyArray = JSON.parse(e.target.result);
        keypair = solanaWeb3.Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
        // displayWalletInfo();

        // loading up everything.
        localStorage.setItem('solana_private_key', JSON.stringify(Array.from(keypair.secretKey)));
        // displayWalletInfo();
        closeWalletModal();
        location.reload();
        alert('Wallet loaded successfully!');
        
    };
    reader.readAsText(file);

    
}

// Connect to the Solana devnet
// const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

// Fetch wallet balance
async function getBalance() {
    if (!keypair) {
        alert('No wallet found. Create or load a wallet first.');
        return;
    }
    // const balance = await window.connection.getBalance(keypair.publicKey);
    const balance = await window.connection.getBalance(keypair.publicKey);
    console.log("The Wallet balance: " + balance);

    // document.getElementById('balance').textContent = 'Balance: ' + (balance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(2) + ' SOL';
    document.getElementById('balance').textContent = 'Balance: ' + (Math.floor((balance / solanaWeb3.LAMPORTS_PER_SOL) * 100) / 100) + ' SOL';

    // little_profile();
}

// async function little_profile(){
//     // const balanceDisplay = document.getElementById('balance');
//     const publicKeyDisplayer = document.getElementById('publicKey');
//     publicKeyDisplayer.value = keypair.publicKey.toBase58();

// }

async function redirectToPageWithData(pageUrl, publicKey) {
    const urlWithParams = `${pageUrl}?public_key=${encodeURIComponent(publicKey)}`; // Add data to URL
    window.location.href = urlWithParams; // Redirect to new URL
}

async function userRedirect(pageUrl) {
    if (!keypair) {
        showToast('No wallet found. Create or load a wallet first.');
        return;
    }
    redirectToPageWithData(pageUrl, keypair.publicKey);
}

async function getPublicKeyFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('public_key'); // Get the 'public_key' parameter
}

async function getAccountDetails() {
    if (!keypair) {
        alert('No wallet found. Create or load a wallet first.');
        return;
    }

    try {
        // Get balance in SOL
        const balanceLamports = await window.connection.getBalance(keypair.publicKey);
        const balanceSOL = balanceLamports / solanaWeb3.LAMPORTS_PER_SOL;

        // Get account info
        const accountInfo = await window.connection.getAccountInfo(keypair.publicKey);

        if (accountInfo) {
            // Displaying the balance and account info
            document.getElementById('balance').textContent = balanceSOL + ' SOL';
            document.getElementById('owner').textContent = accountInfo.owner.toBase58(); // Account owner
            document.getElementById('lamports').textContent = accountInfo.lamports; // Balance in lamports
            document.getElementById('executable').textContent = accountInfo.executable ? 'Yes' : 'No'; // Is the account executable
            document.getElementById('rentEpoch').textContent = accountInfo.rentEpoch; // Rent epoch
            document.getElementById('accountData').textContent = accountInfo.data.length > 0
                ? new TextDecoder().decode(accountInfo.data) // Decoded account data, if any
                : "No data";
        } else {
            alert("Account not found or has no associated data.");
        }
    } catch (error) {
        console.error("Failed to fetch account details:", error);
        alert("An error occurred while fetching account details. Please try again.");
    }
}

async function getAccountDetailsPublic() {
    // if (!keypair) {
    //     alert('No wallet found. Create or load a wallet first.');
    //     return;
    // }
    let publicKey = getPublicKeyFromUrl();

    try {
        // Get balance in SOL
        // const balanceLamports = await window.connection.getBalance(publicKey);
        // const balanceSOL = balanceLamports / solanaWeb3.LAMPORTS_PER_SOL;

        // Get account info
        const accountInfo = await window.connection.getAccountInfo(publicKey);

        if (accountInfo) {
            // Displaying the balance and account info
            return accountInfo;
            
        } else {
            console.log("Account not found or has no associated data.");
            return None;
        }
    } catch (error) {
        console.error("Failed to fetch account details:", error);
        alert("An error occurred while fetching account details. Please try again.");
        return None;
    }
}

async function displayAccountDetials(){
    accountInfo = getAccountDetailsPublic();
    if(accountInfo){
        document.getElementById('balance').textContent = balanceSOL + ' SOL';
        document.getElementById('owner').textContent = accountInfo.owner.toBase58(); // Account owner
        document.getElementById('lamports').textContent = accountInfo.lamports; // Balance in lamports
        document.getElementById('executable').textContent = accountInfo.executable ? 'Yes' : 'No'; // Is the account executable
        document.getElementById('rentEpoch').textContent = accountInfo.rentEpoch; // Rent epoch
        document.getElementById('accountData').textContent = accountInfo.data.length > 0
            ? new TextDecoder().decode(accountInfo.data) // Decoded account data, if any
            : "No data";
    }else{
        showToast("We are having some errors with displaying the account information.");
    }
    
}


// Send SOL to another address
/* async function sendSol() {
    if (!keypair) {
        alert('No wallet found. Create or load a wallet first.');
        return;
    }

    const recipientAddress = document.getElementById('recipient').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!recipientAddress || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid recipient address and amount.');
        return;
    }

    const recipientPublicKey = new solanaWeb3.PublicKey(recipientAddress);
    const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: recipientPublicKey,
            lamports: amount * solanaWeb3.LAMPORTS_PER_SOL,
        })
    );

    try {
        const signature = await solanaWeb3.sendAndConfirmTransaction(window.connection, transaction, [keypair]);
        showToast('Transaction successful! Signature: ' + signature);
        // document.getElementById('transactionStatus').textContent = 'Transaction successful! Signature: ' + signature;
    } catch (error) {
        showToast('Transaction failed: ' + error.message);
        // document.getElementById('transactionStatus').textContent = 'Transaction failed: ' + error.message;
    }
} */


/* async function sendSol({
    recipientAddress = document.getElementById('recipient')?.value,
    amount = parseFloat(document.getElementById('amount')?.value),
} = {}) {
    try {
        // Check if the wallet exists
        if (!keypair) {
            showToast('No wallet found. Create or load a wallet first.');
            return;
        }

        console.log(recipientAddress, amount);

        // Validate recipient address and amount
        if (!recipientAddress || isNaN(amount) || amount <= 0) {
            showToast('Please enter a valid recipient address and amount.');
            return;
        }

        // Convert recipient address to PublicKey
        const recipientPublicKey = new solanaWeb3.PublicKey(recipientAddress);

        // Create the transaction
        const transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
                fromPubkey: keypair.publicKey,
                toPubkey: recipientPublicKey,
                lamports: amount * solanaWeb3.LAMPORTS_PER_SOL,
            })
        );

        // Attempt to send and confirm the transaction
        const signature = await solanaWeb3.sendAndConfirmTransaction(window.connection, transaction, [keypair]);
        
        alert(`Transaction successful! Signature: ${signature}`);

        // Success notification
        showToast(`Transaction successful! Signature: ${signature}`);
        
    } catch (error) {
        alert(`Transaction failed: ${error.message}`);
        
        // Failure notification
        showToast(`Transaction failed: ${error.message}`);
        
    }
} */

    
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 5000);
}


// Create Account Button Event
const createAccountBtn = document.getElementById('createAccountBtn');
createAccountBtn.addEventListener('click', openWalletModal);

// Use an anonymous function to prevent immediate invocation


document.getElementById('profile')?.addEventListener('click', () => userRedirect("profile.html"));
document.getElementById('transfer')?.addEventListener('click', () => userRedirect("send.html"));
document.getElementById('home')?.addEventListener('click', () => userRedirect("index.html"));
document.getElementById('message_item')?.addEventListener('click', () => userRedirect("messenger.html"));
document.getElementById('games')?.addEventListener('click', () => userRedirect("games.html"));
document.getElementById('about_us')?.addEventListener('click', () => userRedirect("white-paper.html") );


// const profileElement = document.getElementById('profile');
// if (profileElement) {
//     profileElement.addEventListener('click', () => userRedirect("profile.html"));
// }
// document.getElementById('profile').addEventListener('click', () => userRedirect("profile.html"));
// document.getElementById('transfer').addEventListener('click', () => userRedirect("send.html"));


// Create Account Button Event
// const createAccountBtn = document.getElementById('createAccountBtn');
// createAccountBtn.addEventListener('click', openWalletModal);

// document.getElementById('profile').addEventListener('click', userRedirect("profile.html"));
// document.getElementById('transfer').addEventListener('click', userRedirect("send.html"));


var url = window.location.href;
// Get all parameters
// let allParams = getAllUrlParams(url); - not sued yet. can be used when the params are many and we need them all at once...
// console.log(allParams); // { network: 'mainnet', token: 'abc123' }

// Get a specific parameter
var network = getUrlParam(url, 'network');



document.addEventListener("DOMContentLoaded", async () => {
    await setupNetwork(network);  // Ensure connection is established before loading the wallet
    loadStoredWallet();
    loadPosts();
});

/* document.addEventListener("DOMContentLoaded", () => {
    loadStoredWallet();

    loadPosts();

});
 */
