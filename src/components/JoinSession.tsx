import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Container,
    Stack,
    Tabs,
    Tab,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { chatApi } from '../api/chatApi';

interface JoinSessionProps {
    onJoinSession: (sessionId: string, userId: string, username: string) => void;
}

export const JoinSession: React.FC<JoinSessionProps> = ({ onJoinSession }) => {
    const [tab, setTab] = useState(0);
    const [username, setUsername] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [error, setError] = useState('');

    const handleCreateSession = async () => {
        try {
            if (!username) {
                setError('Please enter a username');
                return;
            }
            const userId = uuidv4();
            const { sessionId } = await chatApi.createSession(userId);
            await chatApi.joinSession(sessionId, userId, username);
            onJoinSession(sessionId, userId, username);
        } catch (err) {
            setError('Failed to create session');
        }
    };

    const handleJoinSession = async () => {
        try {
            if (!username || !sessionId) {
                setError('Please fill in all fields');
                return;
            }
            const userId = uuidv4();
            await chatApi.joinSession(sessionId, userId, username);
            onJoinSession(sessionId, userId, username);
        } catch (err) {
            setError('Failed to join session');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Chat Room
                </Typography>

                <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} centered sx={{ mb: 3 }}>
                    <Tab label="Create Session" />
                    <Tab label="Join Session" />
                </Tabs>

                <Stack spacing={3}>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                    />

                    {tab === 1 && (
                        <TextField
                            label="Session ID"
                            value={sessionId}
                            onChange={(e) => setSessionId(e.target.value)}
                            fullWidth
                        />
                    )}

                    {error && (
                        <Typography color="error" align="center">
                            {error}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        size="large"
                        onClick={tab === 0 ? handleCreateSession : handleJoinSession}
                        fullWidth
                    >
                        {tab === 0 ? 'Create Session' : 'Join Session'}
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
};
