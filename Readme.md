# SeaBattle: Real-Time Multiplayer Strategy Game

![Language](https://img.shields.io/badge/language-JavaScript-yellow)
![Frontend](https://img.shields.io/badge/frontend-React.js-61DAFB)
![Backend](https://img.shields.io/badge/backend-Node.js-green)
![Real-Time](https://img.shields.io/badge/tech-Socket.io-black)
![License](https://img.shields.io/badge/license-MIT-blue)

**SeaBattle** is a modern, web-based implementation of the classic Battleship strategy game. It features **real-time multiplayer** capabilities, allowing two players to connect and battle instantly.

Built with a full-stack JavaScript architecture (**React** + **Node.js**), leveraging **Socket.io** for bidirectional event-based communication.

## Key Features

* **Real-Time Multiplayer:** Instant moves and updates using WebSockets (Socket.io).
* **Lobby System:** Players can join rooms to start a match.
* **Interactive UI:** Drag-and-drop ship placement mechanics.
* **State Synchronization:** Server-side validation ensures fair play and synchronized game states.
* **Responsive Design:** Playable on various screen sizes.

## Tech Stack

* **Frontend:** React.js, HTML5, CSS3
* **Backend:** Node.js, Express.js
* **Communication:** Socket.io (WebSockets)
* **Package Manager:** NPM / Yarn

## Installation & Usage

To run this project locally, you need to start both the **Server** and the **Client** concurrently.

### 1. Clone the Repository
```bash
git clone https://github.com/aergen29/seabattle.git
cd seabattle
```

### 2. Server Setup (Backend)
Open a terminal and run:
```bash
cd server
npm install
npm run dev
# Server usually runs on port 3001 or 5000
```

### 3. Client Setup (Frontend)
Open a **new terminal** window and run:
```bash
cd client

# Create .env file
echo "REACT_APP_API_URL=http://localhost:3001" > .env

# Install & Start
npm install
npm start
# Client runs on http://localhost:3000
```

## Project Structure

```
seabattle/
├── client/     # React Frontend application
├── server/     # Node.js Backend & Socket.io logic
└── README.md   # Documentation
```

## Author

**Abdullah Ergen**
* GitHub: [@aergen29](https://github.com/aergen29)
* Email: abdullahergeni@yandex.com

## License

This project is open-source and available under the MIT License.
