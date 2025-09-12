# SNiC website


Hi there! You are the new developer for the SNiC website. Welcome! This document will guide you through the project and help you get started. If you have any questions, feel free to ask the previous developer or the SNiC board.

## Initial setup

1. Clone this repository.
2. Install NodeJS 24, e.g. via Node Version Manager.
3. Install dependencies by running `npm install` inside the `backend` folder.
4. Copy the `.env.sample` file in the `backend` folder to `.env` and fill in the required values.
5. Run `npm run db:seed` inside the `backend` folder to create the database schema and optionally create an admin account.
6. Run `npm run dev` inside the `backend` folder to start the backend.


## Development

1. Seed the database with some initial data by running `npm run db:seed` inside the `backend` folder.
3. Start the frontend and backend as described in the initial setup.

### New/changed API routes

When changing or adding new API routes, make sure to update the OpenAPI specification with the command `npm run tsoa`. This will generate the new routes and types in the `backend/src/generated` folder. 


## Emails

For more information on how to set up email sending, see the `backend/README.md` file.

## Deployment

The website must be hosted on your own server. For this **via** in 2024 used kubernetes, helm charts can be found in the `charts/` folder. Another way is to use a simple docker-compose setup, which is also provided in the `docker-compose.yml` file.


## What to do in the new year?

1. Copy this repo (KEEPING THE HISTORY) to a new repository, e.g. `snic-website-2026`.
2. Replace logo's and titles with the new year.
