# my-chat-app
A working chat room frontend to practice React, websockets, and AWS deployment

## Backend Repository
The backend repository for this project can be found here: [my-chat-backend](https://github.com/akenned8/my-chat-backend)

## How to Run Locally

### Prerequisites
- Node installed
- Backend configured and running

### Setup

1. Run the chat server and Localstack (instruction in the backend repository [my-chat-backend](https://github.com/akenned8/my-chat-backend))

2. Install dependencies 
    ```
    npm install
    ```

3. Create a ``.env`` file in the root directory and add the following environment variables:
    ```
    REACT_APP_API_URL=http://localhost:5000
    REACT_APP_WS_URL=http://localhost:5000
    ```

4. Run the application 
    
    a. Deploy it to Localstack's S3
    ```
    make deploy-local
    ```

    b. or, run it locally

    ```
    npm start
    ```

5. Access the chat application.

    a. If deployed to Localstack's S3 

    ``http://my-chat-app-bucket.s3-website.localhost.localstack.cloud:4566/``

    b. If running locally

    ``http://localhost:3000`` 
