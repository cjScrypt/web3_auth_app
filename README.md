# Web3 Authentication App

<h2>📚 Table of Contents</h2>

1. [Overview](#overview)
2. [Why Use This](#why-use-this)
3. [How It Works](#how-it-works)
   * [TON Wallet Authentication Flow](#ton-wallet-authentication-flow)
   * [EVM Wallet Authentication Flow](#evm-wallet-authentication-flow)
4. [Installation](#installation)
5. [API Reference](#api-reference)
   * POST /auth/payload
   * POST /auth/verify
6. [Frontend Integration](#frontend-integration)
7. [Security Notes](#security-notes)
8. [Contributing](#contributing)
9. [License](#license)

## Overview
Web3 Auth API is a lightweight and secure authentication service that allows developers to verify the ownership of a user's blockchain wallet, on both EVM compatible networks (e.g Ethereum and Polygon) and The Open Network (TON) blockchain.

Instead of using traditional credentials (email/password), this API enables web services to authenticate users based on cryptographic wallet proofs.

## Why Use This?
* Passwordless login using wallet signatures
* Cross-chain support (EVM + TON)
* Secure: Prevents replay attacks with nonce + timestamps
* Modular: Easy to plug into any web2/web3 frontend

## Installation
* Clone the repository
  ```bash
  git clone https://github.com/cjScrypt/web3_auth_app
  ```
* Install dependencies
  ```bash
  npm install
  # or
  yarn install
  ```
* Set environment variables
  ```vim
  PORT="your_app_port"
  DATABASE_URL="your_db_url"
  JWT_SECRET="your_jwt_secret"
  TON_API_MAINNET="ton_mainnet_api_url"
  TON_API_TESTNET="ton_testnet_api_url"
  ```
* Run the server
  ```bash
  npm run dev
  ```
Server will start on http://localhost:3000 (or the port you configure).

## How it works
![Signin Flowchart](./flowchart.svg)<br>
<br>1. <b>Client Requests Payload</b>
  * The client (frontend) sends a request to the API to generate a payload for authentication.

  * The payload includes a unique nonce and is signed on the server-side.

<br>2. <b>User Signs the Payload</b>

  * The client asks the user to sign the received payload using their wallet (EVM or TON).

 * The wallet returns a signed message (proof).

<br>3. <b>Client Submits Proof</b>

  * The client sends the signed proof, wallet address, and the original payload back to the API for verification.

<br>4. <b>Server Verifies the Proof</b>

  * The server verifies:

    * The proof matches the original payload.

    * The address matches the signer.

    * The payload nonce is still valid and unused.

<br>5. <b>Successful Authentication</b>

  * If all checks pass, the server returns a signed JWT token to the client.

  * The client can now use the JWT token for authenticated requests.


## API Reference
<code>POST /auth/generatePayload</code><br>

* Request Body: <code>GeneratePayloadDto</code>
  ```js
  {
    "address": "",
    "chainId": ""
  }
  ```
* Response Body
  ```js
  {
    "data": "" // payload
  }
  ```
<br>
<code>POST /auth/signin-evm</code><br>

* Request Body: <code>CheckEvmProofDto</code>
  ```js
  {
    "proof": "",
    "address": "0x...",
    "payloadToken": ""
  }
  ```

* Response Body
  ```js
  {
    "data": {
        "token": "",
        "user": {
            "id": "",
            "walletAddress": "0x...",
            "firstName": "",
            "lastName": ""
        }
    }
  }
  ```

<code>POST /auth/signin-ton</code>
  * Request Body: <code>CheckTonProofDto</code>
    ```js
    {
        "address": "",
        "network": "",
        "public_key": "",
        "proof": {
            "timestamp": 1745254673793,
            "domain": {
                "lengthBytes": 1,
                "value": ""
            },
            "payload": "",
            "signature": "",
            "state_init": ""
        }
    }
    ```

Types
  * <code>GeneratePayloadDto</code>:
    * address (string): User's wallet address
    * chainId (string): Blockchain type. Allowed values: `ton` or `evm`

  * <code>CheckEvmProofDto</code>
    * proof (string): Wallet signature of `payloadToken`
    * address (string): User's address
    * payloadToken (string): Payload from the request

  * <code>CheckTonProofDto</code>
    * address: User's TON wallet address,
    *  network (string): Blockchain network. Allowed values: `CHAIN.TESTNET` or `CHAIN.MAINNET`
    * public_key (string): User's public key,
    * proof (string):
      * timestamp (Date): Time of signing (Date.now()),
      * domain:
        * lengthBytes (number): Length of the frontend domain name
        * value (string): Frontend domain name
      * payload (string): Payload from the request
      * signature (string): Base64-encoded signature
      * state_init (string): Wallet state init, used to reconstruct and verify the wallet address

## Frontend Integration
Coming Soon!!

## Security Notes
* <b>Payload Expiration</b>: Payloads are short-lived and expire after a limited time window to reduce the risk of replay attacks.
* <b>Nonce Verification</b>: Payloads are associated with a unique nonce stored temporarily in Redis. This nonce is removed from cache on expiration or successful verification.
* <b>Signature Validation</b>: Wallet signatures are strictly verified against the original payload and expected address

## Contributing
Contributions are welcome. Please open an issue or submit a pull request if you would like to help improve the project. Thank you!

## License
Licensed under the <b>MIT License</b>