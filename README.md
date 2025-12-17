# Thumbinator starter: Spring Boot + React

Starter client/server application featuring a Java 21 Spring Boot backend and a React single-page frontend. The backend exposes a REST endpoint consumed by the React app to display a greeting.

## Structure

```
thumbinator/
├─ backend/        # Spring Boot REST API
├─ frontend/       # React SPA built with Vite
├─ build.gradle    # Root dependency + plugin catalog
└─ settings.gradle # Project composition
```

## Prerequisites

- Java 21+
- Node.js is automatically downloaded by Gradle for the frontend build.

## Running the full stack

Use a single command to build the React app, bundle it into the Spring Boot resources, and start the server:

```bash
./gradlew bootRun
```

The backend listens on `http://localhost:8080` and serves the compiled React app. The SPA issues a request to `/api/greeting` and renders `Hello: {name}` from the JSON response.

### Development tips
- For frontend-only iteration, you can run `npm install` then `npm run dev` inside `frontend/`; requests to `/api` proxy to `http://localhost:8080`.
- The backend includes CORS rules for the Vite dev server on port 5173.
- The `bootJar`/`bootRun` tasks depend on the frontend build (`frontend:buildFrontend`), ensuring fresh assets are packaged.
