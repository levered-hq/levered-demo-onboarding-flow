# Leverd Demo Onboarding Flow

This repo contains an onboarding flow (a Next.js app) for a fictitious spend management application called "Hay". It's used to demonstrate how to use Levered to create self-optimizing user iterfaces.

## Getting Started

1. Install dependencies by running `npm install`
2. Create a `.env` file by copying `.env.example`. You can generate a secure AUTH_SECRET by running `openssl rand -base64 32` in your terminal.
3. Run the app: `npm run dev`

### Using leverd to create UI variants (alpha-version)

1. Make sure you have the `levered-services` ([link](https://github.com/levered-hq/levered-services))and the `levered-client` ([link](https://github.com/levered-hq/levered-client)) repo available locally.
2. Link the `levered-client` into this repo by running `just relink-client` from this repo (i.e. the sample app). This step is necessary for as long as the client is not yet distributed via `npm`
3. Initialize levered by running `levered init` (your secret key is `secret_key_for_writing` and your public key is `public_key_for_reading`; set the levered URL to `http://localhost:8000`)
4. Scan components in the app by running `levered scan`
