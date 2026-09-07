# Human+AI Decision Framework – Embedded AI Chat V2.3

Starter app for embedding a controlled AI assistant inside the pilot flow.

## What is already implemented
- Simple mobile-friendly chat UI
- Server-side OpenAI API call
- API key stays on the server
- Configurable model with `OPENAI_MODEL`
- Participant/phase query parameters supported
- `postMessage` event after each AI exchange, ready for later form integration
- Health endpoint at `/health`

## Local start
1. Install Node.js 20+
2. Run `npm install`
3. Copy `.env.example` to `.env`
4. Put your own OpenAI API key in `.env`
5. Run `npm start`
6. Open `http://localhost:3000`

## Important security rule
Never put the OpenAI API key into `public/index.html`, Tally, GitHub source code, or any browser-side JavaScript.
Keep it only as a server environment variable.

## Next integration step
Deploy this app to a public HTTPS host. Then embed that public URL in the relevant Tally pilot pages.
The next development step is to connect each chat exchange to the corresponding Tally participant/phase fields so copying and pasting can be removed completely.
