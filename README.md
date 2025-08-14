# CarbonTrack

This is a Next.js application designed to help small to medium-sized enterprises (SMEs) track and manage their carbon emissions.

## Getting Started

To run this project locally, you'll need to have Node.js and npm installed.

### 1. Install Dependencies

First, install the project dependencies using npm:

```bash
npm install
```

### 2. Set up Environment Variables

Create a `.env.local` file in the root of the project and add your Google AI API key:

```
GEMINI_API_KEY=your_google_ai_api_key_here
```

You can get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Run the Development Servers

You'll need to run two separate development servers in two separate terminals.

**Terminal 1: Run the Next.js App**

This command starts the main web application.

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

**Terminal 2: Run the Genkit AI Flows**

This command starts the Genkit server that handles the AI-powered features. The `--watch` flag will automatically restart the server when you make changes to the AI flows.

```bash
npm run genkit:watch
```

This will start the Genkit development UI, typically on port 4000. You can use this UI to test your AI flows.
