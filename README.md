# my-chat-app
A working chat room frontend to practice React, websockets, and AWS deployment

## Backend Repository
The backend repository for this project can be found here: [my-chat-backend](https://github.com/akenned8/my-chat-backend)

## How to Run Locally

### Prerequisites
- Node installed
- Backend configured and running

### Setup

1. Run the chat server (instruction in the backend repository [my-chat-backend](https://github.com/akenned8/my-chat-backend))

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
```
npm start
```

5. Open your browser and navigate to ``http://localhost:3000`` to access the chat application.
