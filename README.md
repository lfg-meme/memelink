### MemeLink

#### Website Technical Implementation Process

### Project Overview

The main goal of this project is to allow different platforms to use our plugin functionality by sharing links and retrieving metadata through a plugin system. The entire system manages metadata retrieval, transaction signature generation, and platform registration and information management through a series of interfaces and rules.

### Plugin

The plugin is the core component of the system, responsible for the following tasks:

1. **Link Verification**:
   The plugin checks if the domain of the shared link is in the registered platform list by calling the interface that fetches all registered platform information.

2. **Request Rules File**:
   If the link's domain is in the registered list, the plugin requests the `memelinks.json` file from the root path of that domain to obtain the platform's rule information.

3. **Path Matching and API Requests**:
   The plugin checks if the shared link path conforms to the rules based on the rule information. If it does, the plugin constructs the API path according to the rules and sends a request to retrieve the metadata.

4. **Metadata Rendering**:
   The plugin renders the front-end display content based on the returned metadata, providing user interaction.

5. **Transaction Signature Processing**:
   When a user triggers an operation option on the front-end, the plugin requests the transaction signature interface from the server based on the `href` field in the metadata, retrieving and processing the transaction signature.

### Interfaces

1. **Metadata Retrieval**:
   When a user shares a link, the system checks if the link's domain and path conform to the rules in the registered list. If they do, the system constructs the API path according to the rules and requests the metadata from our server, returning it to the front-end for rendering.

2. **Transaction Signature Generation**:
   When a user clicks an operation option on the front-end, the front-end requests the transaction signature generation interface from our server based on the `href` field in the returned metadata, retrieving the raw transaction information.

### Platform User Registration Process

1. **Prepare Registration Information**:
   Platform users need to prepare the following information and edit it into a JSON file format:
   ```json
   {
       "host": "app.uniswap.org",
       "api_host": "interface.gateway.uniswap.org",
       "chain_id": "1",
       "short_host": "uniswap",
       "type": "swap",
       "meta_url": "/metadata",
       "sign_url": "/sign"
   }
   ```

2. **Edit JSON File**:
   Edit the above registration information into a JSON format file.

3. **Submit Application**:
   Submit the edited JSON file to our GitHub repository to apply for registration.

4. **Approval and Branch Merging**:
   Submit to the `memelink-registry` repository. We will review the submitted information, and upon approval, merge the branch. This allows the plugin to support platform rendering and operations.

### Platform Integration Development Process

Below is a detailed development process for how a user platform can integrate with our plugin system, including how to retrieve metadata, obtain transaction signatures, and add a JSON file to the root directory.

#### 1. Retrieve Metadata

**API Definition**

- **Request Method**: GET
- **Response Data Format**:
  ```typescript
  export interface MetadataResponse {
    /** Title */
    title: string;
    /** Icon URL */
    icon: string;
    /** Description */
    description: string;
    /** Label */
    label: string;
    /** Chain ID */
    chainId: string;
    /** Neuron object containing multiple operation options */
    neuron: {
      /** Array of operation options */
      impulses: Array<{
        /** Operation option label */
        label: string;
        /** Operation option link */
        href: string;
        /** Optional array of operation option parameters */
        parameters?: Array<{
          /** Parameter name */
          name: string;
          /** Parameter label */
          label: string;
        }>;
      }>;
    };
  }
  ```

#### 2. Obtain Transaction Signature

**API Definition**

- **Request Method**: POST
- **Request Body**:
  ```typescript
  export interface ActionPostRequest {
    /** User wallet address */
    account: string;
  }
  ```
- **Response Data Format**:
  ```typescript
  export interface ActionPostResponse {
    /** Chain ID */
    chainId: string;
    /** Raw transaction information */
    transaction: string;
    /** Optional message describing the nature of the transaction */
    message?: string;
  }
  ```

#### 3. Add JSON File to Root Directory

**Example JSON File Content**

Users need to add a `memelinks.json` file to the root directory of their platform to define API path rules.

```json
{
    "rules": [
        {
            "pathPattern": "/swap/**",
            "apiPath": "https://api.memelinks.xyz/api/uniswap/swap/**"
        }
    ]
}
```

**Field Explanation**

- **pathPattern**: Path pattern used to match the shared link path.
  - Example value: `"/trade/**"`
  - After `/trade/`, any character can follow, indicating that all paths starting with `/trade/` conform to this rule.
  - For example: `/trade/abc`, `/trade/123`, `/trade/anything`, `/trade?amount=` all conform to this rule.

- **apiPath**: API path defining the API address corresponding to the path pattern, used to request metadata and transaction signatures.
  - Example value: `"https://api.memelinks.xyz/api/lfgmeme/trade/**"`
  - Explanation:
    - `"https://api.memelinks.xyz/api/lfgmeme/trade/**"` indicates replacing the matched path pattern part with the `**` position in the API path to forward the request.
    - For example, if the user shares the link `https://userplatform.com/trade/abc?param=value`,
      the registration information might be:
      ```json
      {
          "host": "userplatform.com",
          "api_host": "api.userplatform.com",
          "chain_id": "1",
          "short_host": "userplatform",
          "type": "trade",
          "meta_url": "/metadata",
          "sign_url": "/sign"
      }
      ```
      Then, according to the rule, accessing the root path `https://userplatform.com/memelinks.json` might return:
      ```json
      {
          "rules": [
              {
                  "pathPattern": "/trade/**",
                  "apiPath": "https://api.memelinks.xyz/api/userplatform/trade/**"
              }
          ]
      }
      ```
      The API request path for metadata on the server would be constructed as `https://api.userplatform.com/metadata/abc?param=value`.

### Integration Example

Below is a detailed development process for how a user platform can integrate with our plugin system, including how to retrieve metadata, obtain transaction signatures, and add a JSON file to the root directory.

#### 1. Retrieve Metadata

**API Definition**

- **Request Method**: GET
- **URL**: `https://api.memelinks.xyz/link/presell/metadata`
- **Response Data Format**:
  ```json
  {
      "title": "Buy with SOL",
      "icon": "https://rwa.trading/lfg/images/ef1bcc1d-9d4b-4827-92f3-0dcada6ff6d3.png",
      "description": "Participate in the presale by transferring SOL. Choose an amount of SOL from the options below, or enter a custom amount.",
      "label": "Buy SOL",
      "chainId": 901,
      "neuron": {
          "impulses": [
              {
                  "label": "0.01 SOL",
                  "href": "/api/memelink/presell/0.01",
                  "parameters": null
              },
              {
                  "label": "0.05 SOL",
                  "href": "/api/memelink/presell/0.05",
                  "parameters": null
              },
              {
                  "label": "0.1 SOL",
                  "href": "/api/memelink/presell/0.1",
                  "parameters": null
              },
              {
                  "label": "Buy hhhh",
                  "href": "/api/memelink/presell/{amount}",
                  "parameters": [
                      {
                          "name": "amount",
                          "label": "Enter a custom SOL amount"
                      }
                  ]
              }
          ]
      }
  }
  ```

#### 2. Obtain Transaction Signature

**API Definition**

- **Request Method**: POST
- **URL**: `https://api.memelinks.xyz/link/presell/sign/0.01`
- **Request Body**:
  ```json
  {
      "account": "0x"  // User wallet address
  }
  ```
- **Response Data Format**:
  ```json
  {
      "chainId": "1",
      "transaction": "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAQABAxRtDq0xuBclWhibsf+JyfulLEt17O0TrSe9Yl85sTlMtLo41TN6W9M2eJJA5QMpp0r3H9MS7GbhndrNdSaXtXoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACpVjSJZQZV6wyW/ZBEmjr6bFhL9zVv6Zfg9ctQYHmSpAQICAAEMAgAAAICWmAAAAAAAAA=="
  }
  ```

#### 3. Add

 JSON File to Root Directory

**URL**: `https://api.memelinks.xyz/memelinks.json`

**Example JSON File Content**

Users need to add a `memelinks.json` file to the root directory of their platform to define API path rules.

```json
{
    "rules": [
        {
            "pathPattern": "/presell/",
            "apiPath": "https://api.memelinks.xyz/api/memelink/presell/**"
        }
    ]
}
```

#### 4. Register JSON File

**Example JSON File Content**

Users need to upload a file to GitHub for registration.

```json
{
    "host": "memelinks.xyz",
    "api_host": "api.memelinks.xyz",
    "chain_id": "1",
    "short_host": "memelink",
    "type": "presell",
    "meta_url": "/link/presell/metadata",
    "sign_url": "/link/presell/sign"
}
```

### Sequence Diagram Explanation

![memelink](./doc/image/memelink.png)

The sequence diagram illustrates the interaction between the tweet, client, and server during the link sharing and transaction process:

1. **User Shares a Link**:
   - Example: `https://memelinks.xyz/presell`
2. **Plugin Requests JSON Configuration File**:
   - URL: `https://memelinks.xyz/memelinks.json`
3. **Plugin Retrieves Rule URL Based on JSON Configuration**:
   - URL: `https://api.memelinks.xyz/api/memelink/presell`
4. **Plugin Requests Metadata Based on Registered Information**:
   - URL: `https://api.memelinks.xyz/link/presell/metadata`
5. **Plugin Renders the Metadata on the Tweet**:
   - The plugin displays the retrieved metadata on the tweet.
6. **User Clicks to Purchase**:
   - User initiates a purchase by clicking on an option.
7. **Plugin Requests to Construct Transaction**:
   - URL: `https://api.memelinks.xyz/api/memelink/presell/0.1`
8. **Plugin Forwards Transaction Information Request and Returns Transaction Information**:
   - URL: `https://api.memelinks.xyz/link/presell/sign/0.1`
9. **Wallet Finalizes the Transaction**:
   - The wallet processes the transaction and completes it.
