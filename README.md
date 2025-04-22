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
   * TON Frontend Integration
   * EVM Frontend Integration
7. [Security Notes](#security-notes)
8. [Contributing](#contributing)
9. [License](#license)

## Overview
Web3 Auth API is a lightweight and secure authentication service that allows developers to verify the ownership of a user's blockchain wallet, on both EVM compatible networks (e.g Ethereum and Polygon) and The Open Network (TON) blockchain.

Instead of using traditional credentials (email/password), this API enables web services to authenticate users based on cryptographic wallet proofs.

## Why Use This?
* Passwordless login using wallet signatures
* Cross-chain support (EVM + TON)
* Secure: Short signin payload expiration to minimize replay attacks
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
PORT=your_app_port
DATABASE_URL=your_db_url
JWT_SECRET=your_jwt_secret
TON_API_MAINNET=ton_mainnet_api_url
TON_API_TESTNET=ton_testnet_api_url
```
* Run the server
```bash
npm run dev
```
Server will start on http://localhost:3000 (or the port you configure).

## API Reference
<code>POST /auth/generatePayload</code><br>

* Request Body
  ```json
  {
    "address": "0x...",
    "chainId": "string" // evm or ton
  }
  ```
* Response Body
  ```json
  {
    "data": "string" // payload
  }
  ```
<br>
<code>POST /auth/signin-evm</code><br>

* Request Body
  ```json
  {
    "proof": "", //
    "address": "0x...",
    "payloadToken": ""
  }
  ```

* Response Body
  ```json
  {
    "data": {
        "token": "",
        "user": {
            "id": "",
            "walletAddress": "0x...",
            "firstName": "", // string | null
            "lastName": "" // string | null;
        }
    }
  }
  ```

  <code>POST /auth/signin-ton</code>
  * Request Body
    ```json
    {
        "address": "",
        "network": "", // Enum [ CHAIN.MAINNET or CHAIN.TESTNET ]
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