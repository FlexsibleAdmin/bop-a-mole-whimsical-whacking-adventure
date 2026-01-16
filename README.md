# Bop-a-Mole: Whimsical Whacking Adventure

[aureliabutton]

A vibrant, high-energy 'Whack-a-Mole' style arcade game designed with a 'Kid Playful' aesthetic. This project features a responsive 3x3 grid of colorful burrows where cute, stylized moles pop up randomly. Players must test their reflexes to score points, build combos, and avoid friendly bunnies in a race against the clock.

## 🎮 Game Overview

Bop-a-Mole is a fast-paced arcade clicker built for the web. It combines modern frontend technologies with a delightful user experience.

### Key Features

*   **Fast-Paced Gameplay**: A 60-second timed round where the speed increases as time decreases.
*   **Dynamic Scoring**:
    *   **Standard Moles**: +10 points.
    *   **Golden Moles**: +50 points (Bonus!).
    *   **Friendly Bunnies**: -20 points (Penalty!).
*   **Combo System**: Consecutive hits build a "Heat Meter" that multiplies scores.
*   **Visual Excellence**: Thick borders, flat 2D cartoon style, bouncy animations, and particle effects.
*   **Responsive Design**: Adapts flawlessly from mobile (2 columns) to desktop (3 columns) with large touch targets.
*   **Local Persistence**: High scores are saved locally to challenge players to beat their best.

## 🛠️ Technology Stack

This project is built using a modern, high-performance stack optimized for speed and developer experience.

*   **Core Framework**: React 18 with TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS v3
*   **UI Components**: Shadcn UI (Radix Primitives)
*   **Animations**: Framer Motion & Canvas Confetti
*   **State Management**: Zustand
*   **Icons**: Lucide React
*   **Runtime/Backend**: Cloudflare Workers (Hono)

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

*   **Bun**: This project uses [Bun](https://bun.sh/) as the package manager and runtime. Ensure you have it installed.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd bop-a-mole
    ```

2.  Install dependencies:
    ```bash
    bun install
    ```

### Development

To start the local development server:

```bash
bun run dev
```

The application will be available at `http://localhost:3000` (or the port specified in your terminal).

### Building for Production

To create a production build:

```bash
bun run build
```

To preview the production build locally:

```bash
bun run preview
```

## 📂 Project Structure

*   `src/`: Main source code for the React application.
    *   `components/`: Reusable UI components (Shadcn) and game-specific components.
    *   `pages/`: Application views (Home, Game Arena).
    *   `hooks/`: Custom React hooks.
    *   `lib/`: Utility functions and configurations.
*   `worker/`: Cloudflare Worker code for backend logic (if applicable).
*   `public/`: Static assets.

## ☁️ Deployment

This project is configured for deployment on Cloudflare Workers.

### One-Click Deployment

You can deploy this project instantly using the button below:

[aureliabutton]

### Manual Deployment

1.  Authenticate with Cloudflare:
    ```bash
    npx wrangler login
    ```

2.  Deploy the project:
    ```bash
    bun run deploy
    ```

## 📄 License

This project is open-source and available under the MIT License.