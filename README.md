# BidSpirit

Production-ready MERN auction platform with role-based access, secure bidding, commission settlement, and responsive auction workflows.

## Run locally

1. Copy `backend/config/config.env.example` to `backend/config/config.env` and supply real values.
2. In `backend`, run `npm ci` then `npm start`.
3. In `frontend`, copy `.env.example` to `.env.local`, run `npm ci`, then `npm run dev`.

The frontend expects `VITE_API_URL=http://localhost:5000/api/v1` locally. In production, set it to the HTTPS API URL or deploy both behind one domain and use `/api/v1`.

## Production release gate

- `frontend`: `npm run lint && npm run build`
- `backend`: `npm test && npm audit --omit=dev --audit-level=high`
- Configure HTTPS, production MongoDB, Cloudinary, SMTP, and a 32+ character JWT secret.
- Probe `/healthz` for liveness and `/readyz` for database readiness.
- Never commit `config.env`, `.env.local`, keys, or credentials.

## Deployment

Both applications include production Dockerfiles. Build the frontend with `VITE_API_URL` pointing at the final HTTPS API endpoint. Run the backend with all variables from `backend/config/config.env.example` supplied by the deployment platform’s secret manager.
