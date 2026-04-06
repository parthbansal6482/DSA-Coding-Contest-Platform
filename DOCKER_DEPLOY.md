# Docker Deployment Guide (Full Project)

This guide deploys the **entire project** (frontend + backend) as one container image, while still using Docker for code execution sandboxes.

## What You Get

- Single app container serving:
  - React frontend (built with Vite)
  - Node/Express API
  - Socket.IO
- Separate `code-executor:latest` image for running user submissions securely

## Prerequisites

- Docker installed and running
- MongoDB connection strings ready (`MONGODB_URI` and `MONGODB_PRACTICE_URI`)
- Google OAuth client configured (if using Duality login)

## 1. Build the Code Executor Image

The backend expects `code-executor:latest` to exist.

```bash
cd server/docker
./build-executor.sh
cd ../..
```

Confirm:

```bash
docker images | grep code-executor
```

## 2. Create Production Env File

Create `server/.env.production`:

```env
NODE_ENV=production
PORT=5001

MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
MONGODB_PRACTICE_URI=mongodb+srv://<user>:<pass>@<cluster>/<practice-db>

JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRE=7d

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

CLIENT_URL=https://your-domain.com
ALLOWED_ORIGINS=https://your-domain.com
```

Notes:
- If backend and frontend are served from the same domain, a single origin in `ALLOWED_ORIGINS` is enough.
- If you have multiple domains, separate them with commas.

## 3. Build the Full App Image

From project root:

```bash
docker build -t duality-extended:latest .
```

## 4. Run the App Container

From project root:

```bash
docker run -d \
  --name duality-extended-app \
  --restart unless-stopped \
  -p 5001:5001 \
  --env-file server/.env.production \
  -v /var/run/docker.sock:/var/run/docker.sock \
  duality-extended:latest
```

Why mount Docker socket:
- The backend uses `dockerode` to launch isolated execution containers for submissions.

## 5. Verify Deployment

Health endpoint:

```bash
curl http://localhost:5001/api/health
```

Expected response includes:
- `"success": true`
- `"message": "Server is running"`

## 6. Reverse Proxy (Recommended)

Put Nginx/Caddy in front of port `5001` and terminate TLS there.

Minimum requirements:
- HTTPS enabled
- Proxy WebSocket upgrades (`/socket.io`)
- Forward normal HTTP requests to `http://127.0.0.1:5001`

## 7. Updating to a New Version

```bash
docker stop duality-extended-app
docker rm duality-extended-app

docker build -t duality-extended:latest .

docker run -d \
  --name duality-extended-app \
  --restart unless-stopped \
  -p 5001:5001 \
  --env-file server/.env.production \
  -v /var/run/docker.sock:/var/run/docker.sock \
  duality-extended:latest
```

## Troubleshooting

- `Cannot connect to Docker daemon`:
  - Ensure Docker is running on the host.
  - Ensure `/var/run/docker.sock` is mounted.
- `No such image: code-executor:latest`:
  - Rebuild executor with `server/docker/build-executor.sh`.
- CORS blocked in browser:
  - Fix `ALLOWED_ORIGINS` and `CLIENT_URL` in env file.
- OAuth login fails:
  - Ensure Google OAuth allowed origins include your production domain.
