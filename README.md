# HelloDoctor Telehealth USSD

A **USSD-style telehealth service** for HelloDoctor: terminal runner and an **HTML phone simulator** for client demos. Built with JavaScript (Node.js), no backend APIs—everything is mocked for presentation.

## Features

- **Full USSD flow**: Welcome menu, book consultation (department → date → time → name → phone → confirm), my appointments, health tips, speak to agent (callback).
- **Terminal mode**: Run the same flow in the terminal for development.
- **Phone simulator**: HTML page that looks like a phone with keypad and screen—ideal for presenting to clients without using the terminal.
- **Session state**: Per-session state and history (back navigation).
- **No external APIs**: All data is mocked (departments, dates, times, sample appointments).

## Quick Start

### 1. Phone simulator (recommended for client presentation)

```bash
npm run simulator
```

Then open **http://localhost:3333** in your browser. You’ll see a phone mockup; tap **#** or **Send** to “dial” *333# and get the main menu. Use the keypad or the text box + Send to choose options.

### 2. Terminal

```bash
npm start
```

Simulates the same USSD flow in the terminal. Type the option number and press Enter (e.g. `1` for Book consultation, `0` for Back).

## Project structure

```
hello_doctor/
├── package.json
├── server.js              # Serves simulator + /api/ussd
├── README.md
├── src/
│   ├── flow.js            # HelloDoctor USSD flow (menus, booking, mock data)
│   ├── session.js         # Session state per user/sessionId
│   └── terminal.js        # Terminal entry (npm start)
└── public/
    └── simulator.html     # Phone simulator UI
```

## USSD flow summary

1. **Welcome**  
   - 1 = Book consultation  
   - 2 = My appointments  
   - 3 = Health tips  
   - 4 = Speak to agent  
   - 5 = Exit  

2. **Book consultation**  
   Department → Date → Time → Full name → Phone number → Confirm (1) or Cancel (2). Back (0) at each step.

3. **My appointments**  
   Lists mock upcoming appointments; 0 = Back.

4. **Health tips**  
   Shows mock tips; 0 = Back.

5. **Speak to agent**  
   Request callback (mock); 1 = Yes, 0 = Back.

## Tech notes

- **Node.js** with ES modules (`"type": "module"`).
- **Single flow engine** in `src/flow.js` used by both terminal and simulator.
- Simulator talks to the same logic via **POST /api/ussd** (JSON: `sessionId`, `input`; response: `text`, `end`).
- Sessions are in-memory; restarting the server clears them.

## Adding real backend APIs later

- Replace mock data in `src/flow.js` (e.g. `MOCK_DEPARTMENTS`, `MOCK_DATES`, `MOCK_APPOINTMENTS`) with `fetch()` or a backend client.
- Keep the same request/response shape for `processInput()` so the terminal and simulator keep working without UI changes.
