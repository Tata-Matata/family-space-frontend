# Family Space – Frontend

> [!WARNING]
> This project is at its **initial bootstrap phase**. Features are minimal, APIs and structure may change without notice, and it is not ready for production use.

Angular web client for **Family Space**, a shared space for families. This repository contains the frontend only; all data and authentication are handled by the backend.

> **Backend:** [Tata-Matata/family-space](https://github.com/Tata-Matata/family-space)

## Features

- User registration and login
- JWT-based authentication with access and refresh tokens
- Automatic token refresh on `401` responses, with logout if the refresh fails
- Home page that reflects the user's authentication state

## Tech stack

- [Angular](https://angular.dev) 21 (standalone components, functional HTTP interceptor)
- TypeScript 5.9, RxJS 7.8
- Vitest + jsdom for unit tests
- Docker + NGINX for production serving

## Prerequisites

- Node.js 20+ and npm
- The [Family Space backend](https://github.com/Tata-Matata/family-space) running locally on `http://localhost:8080`

## Getting started

```bash
git clone https://github.com/Tata-Matata/family-space-frontend.git
cd family-space-frontend
npm install
npm start
```

The app is served at <http://localhost:4200>.

### Connecting to the backend

In development, [proxy.conf.json](proxy.conf.json) forwards these API paths to the backend at `http://localhost:8080`:

| Path        | Purpose                      |
| ----------- | ---------------------------- |
| `/register` | Create a new account         |
| `/login`    | Obtain access/refresh tokens |
| `/refresh`  | Refresh the access token     |
| `/logout`   | Revoke the refresh token     |

Start the backend by following the instructions in its [README](https://github.com/Tata-Matata/family-space), then run the frontend. If the backend runs on a different host or port, update the `target` values in `proxy.conf.json`.

## Scripts

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm start`     | Start the dev server with live reload        |
| `npm run build` | Production build into `dist/`                |
| `npm run watch` | Development build in watch mode              |
| `npm test`      | Run unit tests                               |

## Routes

| Route       | Component            | Description          |
| ----------- | -------------------- | -------------------- |
| `/`         | `HomeComponent`      | Landing / home page  |
| `/login`    | `LoginComponent`     | Sign in              |
| `/register` | `RegisterComponent`  | Create an account    |

## Authentication flow

1. `AuthService` posts credentials to `/login` and keeps the returned access and refresh tokens in memory (they are lost on page reload).
2. `authInterceptor` attaches `Authorization: Bearer <access_token>` to outgoing requests.
3. On a `401`, the interceptor calls `/refresh` and retries the request once; if refresh fails, the user is logged out and redirected to `/login`.
4. `logout()` calls `/logout` to revoke the refresh token and clears local state.

## Project structure

```text
src/app/
├── auth/        # AuthService, HTTP interceptor, login and register components
├── home/        # Home page
├── app.config.ts
├── app.routes.ts
└── app.ts       # Root component
```

## Docker

The [Dockerfile](Dockerfile) builds the app in a Node 20 image and serves the static output with NGINX on port 80:

```bash
docker build -t family-space-frontend .
docker run -p 4200:80 family-space-frontend
```

The dev proxy is not part of the container image, so API requests must be routed to the backend by whatever serves or fronts the container (for example a reverse proxy or an NGINX config).

## Related

- Backend: [Tata-Matata/family-space](https://github.com/Tata-Matata/family-space)

