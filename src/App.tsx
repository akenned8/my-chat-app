import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { JoinSession } from './components/JoinSession';
import { ChatRoom } from './components/ChatRoom';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
  },
});

export default function App() {
  const [session, setSession] = useState<{
    sessionId: string;
    userId: string;
    username: string;
  } | null>(null);

  const handleJoinSession = (sessionId: string, userId: string, username: string) => {
    setSession({ sessionId, userId, username });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!session ? (
        <JoinSession onJoinSession={handleJoinSession} />
      ) : (
        <ChatRoom {...session} />
      )}
    </ThemeProvider>
  );
}