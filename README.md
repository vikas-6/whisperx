# Whispr - Anonymous Chat Application

A real-time anonymous chat application built with React, Socket.IO, and TypeScript. Users can create or join chat rooms and communicate anonymously with others.

## Features

- Create private chat rooms
- Join existing rooms with room ID
- Real-time messaging
- Typing indicators
- Anonymous usernames
- System messages for user join events
- Responsive design
- Dark mode UI

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Socket.IO Client
  - Lucide React (icons)
  - React Router DOM

- Backend:
  - Node.js
  - Express
  - Socket.IO
  - Unique Names Generator

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start the Socket.IO server:
```bash
npm run server
```

3. In a new terminal, start the frontend development server:
```bash
npm run dev
```

## Common Issues and Solutions

### Message Sending/Receiving Issues

If messages aren't being received properly or causing black screens, check these files:

1. `server/index.js`:
   - Use `io.in(roomId)` instead of `io.to(roomId)` for broadcasting
   - Ensure proper message structure with ID and timestamp
   - Verify room joining logic

2. `src/context/SocketContext.tsx`:
   - Implement proper message handling with useCallback
   - Add reconnection options
   - Clean up event listeners
   - Handle socket connection/disconnection properly

3. `src/components/ChatInput.tsx`:
   - Structure message data correctly
   - Handle typing indicators
   - Clear timeouts properly

4. `src/components/ChatMessage.tsx`:
   - Pass currentUserId directly instead of using context
   - Handle system messages separately
   - Apply correct styling based on message sender

### Connection Issues

If experiencing connection problems:

1. Check server URL in SocketContext
2. Verify CORS settings in server
3. Ensure proper socket event handling
4. Check reconnection settings

## Project Structure

```
├── src/
│   ├── components/      # React components
│   ├── context/        # React context providers
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── server/
│   └── index.js        # Socket.IO server
└── public/             # Static assets
```

## Best Practices

1. Always handle socket cleanup in useEffect
2. Use proper TypeScript types for messages and users
3. Implement error handling for socket events
4. Handle edge cases (disconnections, reconnections)
5. Use proper room management
6. Clean up timeouts and event listeners

## Environment Variables

The application uses these default ports:
- Frontend: 5173 (Vite default)
- Backend: 3001 (Socket.IO server)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## License

MIT License