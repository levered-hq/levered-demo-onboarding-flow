# Leverd Demo Onboarding Flow

This repo contains an onboarding flow for a fictitious spend management application called Hay. We use it to demonstrate how to use levered to create self-optimizing variant in the onboarding flow.

## Getting Started

1. Make sure you have the `levered-services` and the `levered-client` repo available locally.
1. Install dependencies by runnint `npm install`
1. Link the `levered-client` into this repo by running `just relink-client`. This step is necessary for as long as the client is not yet distributed via `npm`
1. Initialize levered by running `levered init` (your secret key is `secret_key_for_writing` and your public key is `public_key_for_reading`; set the levered URL to `http://localhost:8000`)
1. Scan components in the app by running `levered scan`

> Important: Before deploying a new version with the app, make sure to create a new branch
