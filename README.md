# GoalGuess Arena

Ultimate Football Player Guessing Game - A web-based interactive quiz platform where users test their football knowledge.

## Features

- **Hint Guess Mode**: Guess players from progressive hints (3 pts → 2 pts → 1 pt)
- **Image MCQ Mode**: Identify players from images with 4 options (2 pts for correct)
- **Global Leaderboard**: Track scores and compete with other players
- **Multiple Difficulties**: Easy, Medium, Hard, Expert
- **User Authentication**: Register and login to track progress
- **Real-time Multiplayer**: WebSocket support for live battles

## Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Framer Motion (animations)
- Axios (API client)
- Socket.io (multiplayer)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Socket.io (WebSocket)

## Setup

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd goalguess-arena
```

2. Install dependencies
```bash
npm install
cd client && npm install && cd ..
```

3. Create `.env` file
```bash
cp .env.example .env
```

4. Seed the database
```bash
node server/seeds/seed.js
```

5. Start development servers
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:5000`

## Project Structure

```
goalguess-arena/
├── server/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── seeds/           # Database seeding
│   └── index.js         # Server entry
├── client/
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
├── package.json
└── .env.example
```

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/players` - Get all players
- `GET /api/players/random` - Get random player
- `GET /api/leaderboard` - Get top 100 players
- `POST /api/game/submit-answer` - Submit game answer

## Game Modes

### Hint Mode
1. Player receives 3 progressive hints
2. Correct after hint 1 = 3 points
3. Correct after hint 2 = 2 points
4. Correct after hint 3 = 1 point

### Image Mode
1. Player sees footballer image
2. Choose from 4 options (A, B, C, D)
3. Correct = 2 points

## Future Enhancements

- Multiplayer real-time battles
- Timed quiz mode
- Achievement badges
- Seasonal tournaments
- Mobile app
- AI-generated hints

## License

MIT
