export interface ChatMessage {
    sessionId: string;        // Partition key
    messageId: string;        // Sort key - UUID
    userId: string;          // ID of message sender
    username: string;        // Display name of sender
    content: string;         // Message content
    timestamp: number;       // When message was sent
}