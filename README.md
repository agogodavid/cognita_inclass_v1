# Cognita: Your Smart Study Buddy

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/agogodavid/cognita_inclass_v1)

An AI-powered app that instantly transforms any text into interactive flashcards for effective learning.

Cognita is a whimsical and powerful learning tool designed to make studying more efficient and engaging. Users can paste any text—from textbook chapters to articles—into the application. With a single click, Cognita's AI analyzes the content and intelligently extracts key terms and their corresponding definitions, generating a beautiful set of digital flashcards. These cards are displayed in an organized grid, ready for review. Users can then enter an immersive 'Study Mode' to flip through the cards, test their knowledge, and track their progress. The entire experience is wrapped in a delightful, illustrative design with playful animations, a user-friendly interface, and is powered by Cloudflare's edge network for lightning-fast performance.

## Key Features

-   **AI-Powered Flashcard Generation**: Instantly extracts key terms and definitions from any text.
-   **Interactive Study Mode**: An immersive, full-screen experience to focus on learning.
-   **3D Card Flip Animations**: Smooth and satisfying animations for a delightful user experience.
-   **Responsive Design**: Flawless performance and layout across all devices, from mobile to desktop.
-   **High-Performance**: Built on Cloudflare's edge network for lightning-fast interactions.
-   **Beautiful UI**: A visually stunning and illustrative design that makes studying enjoyable.

## Technology Stack

-   **Frontend**: React, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Zustand
-   **Backend**: Cloudflare Workers, Hono
-   **Stateful Logic**: Cloudflare Agents SDK (Durable Objects)
-   **AI Integration**: Cloudflare AI Gateway

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v20.x or later recommended)
-   [Bun](https://bun.sh/) package manager

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/cognita.git
    cd cognita
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

3.  **Set up environment variables:**

    Create a `.dev.vars` file in the root of the project and add your Cloudflare AI Gateway credentials. This file is used by Wrangler for local development.

    ```ini
    # .dev.vars

    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="your-cloudflare-api-key"
    ```

    Replace `YOUR_ACCOUNT_ID` and `YOUR_GATEWAY_ID` with your actual Cloudflare details.

4.  **Run the development server:**
    ```sh
    bun dev
    ```
    The application will be available at `http://localhost:3000`.

## Usage

1.  Open the application in your browser.
2.  Paste the text you want to study into the large text area.
3.  Click the "Create Flashcards" button.
4.  Wait for the AI to generate your study deck.
5.  Once the cards appear, click the "Study this Deck" button to enter the interactive study mode.
6.  Click on a card to flip it and reveal the definition. Use the navigation buttons to move through the deck.

## Project Structure

-   `src/`: Contains the frontend React application.
    -   `pages/HomePage.tsx`: The main component for the application UI and logic.
    -   `hooks/use-flashcard-store.ts`: Zustand store for managing application state.
    -   `components/`: Reusable React components.
-   `worker/`: Contains the Cloudflare Worker backend code.
    -   `index.ts`: The entry point for the worker.
    -   `agent.ts`: The core `ChatAgent` class that handles AI interactions using the Cloudflare Agents SDK.
    -   `userRoutes.ts`: Defines the API routes for the application.

## Important Note on AI Usage

Please be aware that this application uses AI models that are subject to rate limits. The AI service is shared across all users and applications, and there is a limit on the number of requests that can be made in a given time period. If you encounter errors, please try again after a short wait.

## Deployment

This project is configured for easy deployment to the Cloudflare network.

1.  **Build the application:**
    ```sh
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    Make sure you are logged into your Cloudflare account via the Wrangler CLI.
    ```sh
    bun run deploy
    ```
    This command will deploy the frontend application to Cloudflare Pages and the backend logic to Cloudflare Workers, including the necessary Durable Object bindings.

Alternatively, you can deploy directly from your GitHub repository.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/agogodavid/cognita_inclass_v1)