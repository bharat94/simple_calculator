# simple_calculator

A tiny multi-container example with a Flask backend and an nginx-served static frontend.

Overview
- Backend: Flask app at `/api/calc` (add, sub, mul, div) on port 5000 inside container.
- Frontend: Static HTML served by nginx on port 8080. Nginx proxies `/api/` to the backend service.

Quick start (Docker Compose)

Build and run:

```bash
# From project root
docker-compose up --build
```

Open the UI in your browser: http://localhost:8080

API examples:

GET query example:

```bash
curl "http://localhost:5000/api/calc?a=5&b=3&op=add"
```

POST JSON example:

```bash
curl -X POST http://localhost:5000/api/calc \
  -H 'Content-Type: application/json' \
  -d '{"a": 8, "b": 2, "op": "div"}'
```

Makefile targets

- `make build` — build images
- `make up` — docker-compose up --build
- `make down` — docker-compose down
- `make clean` — remove images/volumes

Git / GitHub

1. Initialize a git repo (if you haven't):

```bash
cd ~/Projects/simple_calculator
git init
git add .
git commit -m "Initial scaffold: flask backend + nginx frontend"
```

2. Create a GitHub repository (use the website or `gh` CLI):

# via gh CLI (optional)
# gh repo create your-username/simple_calculator --public --source=. --remote=origin

3. Add remote and push:

```bash
# replace <your-remote-url> with e.g. git@github.com:you/simple_calculator.git
git remote add origin <your-remote-url>
git branch -M main
git push -u origin main
```

Notes
- The nginx config proxies `/api/` to the `backend` Docker service (internal DNS name). The frontend makes same-origin requests to `/api/calc`, which nginx forwards.
- Replace versions and pins in `requirements.txt` as needed.
