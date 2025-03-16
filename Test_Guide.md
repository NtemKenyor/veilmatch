# Testing Guide for VeilMatch

## Overview
VeilMatch simplifies testing by allowing users to switch between different networks using URL parameters. The default network is **Mainnet**, but users can switch to **Testnet (Devnet)** or even a **local server** for testing purposes.

---

## Testing Different Networks

### 1. **Mainnet (Default)**
By default, the project loads on the **Mainnet of VeilMatch**.

- **Localhost:**  
  ```
  http://localhost/veilmatch/frontend/public/
  ```
- **Live Server:**  
  ```
  https://roynek.com/veilmatch/frontend/public/
  ```

### 2. **Testnet (Devnet)**
To test on the **Testnet**, add the `network=devnet` parameter to the URL.

- **Localhost:**  
  ```
  http://localhost/veilmatch/frontend/public/?network=devnet
  ```
- **Live Server:**  
  ```
  https://roynek.com/veilmatch/frontend/public/?network=devnet
  ```

---

## How to Test
1. **Ensure you have a wallet connected** (or create one using the in-built wallet generator).
2. **Check the UI behavior and functionalities** such as:
   - Wallet creation and loading
   - Balance retrieval
   - Transaction execution
3. **Switch between networks using the appropriate URLs** to verify that data loads correctly for each environment.
4. **Test Edge Cases**:
   - Try refreshing after switching networks
   - Test on different browsers and devices
   - Simulate slow network conditions

---

## Additional Notes
- If you encounter errors, check the console (`F12` → Console Tab) for logs.
- The network parameter must be correctly formatted (`devnet`, `mainnet`).
- The local server must be properly set up to serve the files.

For further debugging, reach out to the project maintainers.

Happy Testing!