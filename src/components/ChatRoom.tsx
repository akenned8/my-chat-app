import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    TextField,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Container,
    AppBar,
    Toolbar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '../types/customTypes';
import { chatApi } from '../api/chatApi';

interface ChatRoomProps {
    sessionId: string;
    userId: string;
    username: string;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ sessionId, userId, username }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_WS_URL || 'http://localhost:5000');

        newSocket.emit('join session', { sessionId, userId, username });

        newSocket.on('chat message', (message: ChatMessage) => {
            setMessages(prev => [...prev, message]);
        });

        newSocket.on('user joined', ({ username }) => {
            setMessages(prev => [
                ...prev,
                {
                    sessionId,
                    messageId: crypto.randomUUID(),
                    userId: 'system',
                    username: 'System',
                    content: `${username} joined the chat`,
                    timestamp: Date.now()
                }
            ]);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [sessionId, userId, username]);

    useEffect(() => {
        // Load existing messages
        chatApi.getSessionMessages(sessionId).then(setMessages);
    }, [sessionId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() && socket) {
            socket.emit('chat message', newMessage);
            setNewMessage('');
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        Chat Room: {sessionId}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container sx={{ flex: 1, overflow: 'auto', py: 2 }}>
                <Paper elevation={3} sx={{ height: '100%', p: 2, overflow: 'auto' }}>
                    <List>
                        {messages.map((message) => (
                            <ListItem
                                key={message.messageId}
                                sx={{
                                    justifyContent: message.userId === userId ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        maxWidth: '70%',
                                        bgcolor: message.userId === userId ? 'primary.light' : 'grey.100',
                                    }}
                                >
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {message.username}
                                    </Typography>
                                    <Typography>{message.content}</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </Typography>
                                </Paper>
                            </ListItem>
                        ))}
                        <div ref={messagesEndRef} />
                    </List>
                </Paper>
            </Container>

            <Container sx={{ py: 2 }}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type a message..."
                            variant="outlined"
                        />
                        <IconButton
                            color="primary"
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                        >
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};