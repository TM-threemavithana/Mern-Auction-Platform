# BidSpirit

BidSpirit is a responsive online auction platform built with React, Express, MongoDB, and Node.js. It gives bidders a clear way to discover and bid on items, while auctioneers can create listings, manage completed auctions, and submit commission payment proofs.

The project includes production-oriented security controls, role-based access, atomic auction bidding, operational health endpoints, Docker images, and continuous integration checks.

## Highlights

- Responsive auction browsing, search, leaderboard, and account flows
- Role-based experiences for bidders, auctioneers, and administrators
- Concurrent-safe bid placement that rejects late, early, or lower bids
- Secure HTTP-only authentication cookies and protected application routes
- Auction lifecycle controls that protect completed auction and commission history
- Commission proof review and atomic settlement processing
- Cloudinary-backed image uploads with file type and 5 MB size limits
- Rate limiting, security headers, CORS allow-listing, request size limits, and production-safe errors
- Health (`/healthz`) and readiness (`/readyz`) endpoints
- Dockerfiles and GitHub Actions release checks

## Technology

| Area | Stack |
| --- | --- |
| Frontend | React, Vite, Redux Toolkit, Tailwind CSS |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Authentication | JWT in HTTP-only cookies |
| Media | Cloudinary |
| Email | Nodemailer / SMTP |
| CI | GitHub Actions |

## Project layout

```text
Mern-Auction-Platform/
├── frontend/                 # React single-page application
│   ├── src/                  # Pages, components, Redux slices, styles
│   ├── Dockerfile
│   └── .env.example
├── backend/                  # Express API and scheduled auction jobs
│   ├── controllers/
│   ├── models/
│   ├── router/
│   ├── middlewares/
│   ├── automation/
│   ├── config/config.env.example
│   └── Dockerfile
└── .github/workflows/ci.yml  # Automated validation
```

## Prerequisites

- Node.js 22 LTS
- npm 10+
- MongoDB 7+ (local or managed)
- Cloudinary account for profile, auction, and proof images
- SMTP provider for auction and commission emails

## Local development

### 1. Configure the backend

Copy the example file and replace every placeholder with real local-development values.

```powershell
Copy-Item backend/config/config.env.example backend/config/config.env
```

Minimum local values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/bidspirit
FRONTEND_URL=http://127.0.0.1:5174
JWT_SECRET_KEY=use-a-long-random-development-secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
```

Keep the Cloudinary and SMTP variables as well if you plan to create accounts, publish auctions, or process commission notifications.

### 2. Configure the frontend

```powershell
Copy-Item frontend/.env.example frontend/.env.local
```

For local development, retain:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Install and start

Open two terminals.

```powershell
# Terminal 1 — API
Set-Location backend
npm ci
npm run dev
```

```powershell
# Terminal 2 — web app
Set-Location frontend
npm ci
npm run dev -- --host 127.0.0.1 --port 5174
```

Open [http://127.0.0.1:5174](http://127.0.0.1:5174).

## Configuration reference

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | Yes | API listening port |
| `NODE_ENV` | Yes | Use `production` in deployed environments |
| `MONGO_URI` | Yes | MongoDB connection string |
| `MONGO_DB_NAME` | No | Database name; defaults to `MERN_AUCTION_PLATFORM` |
| `FRONTEND_URL` | Yes | Allowed frontend origin; comma-separate multiple origins |
| `JWT_SECRET_KEY` | Yes | JWT signing secret; at least 32 characters in production |
| `JWT_EXPIRE` | Yes | JWT lifetime, such as `7d` |
| `COOKIE_EXPIRE` | Yes | Cookie lifetime in days |
| `CLOUDINARY_*` | Yes for uploads | Cloudinary credentials |
| `SMTP_*` | Yes for emails | SMTP server credentials |
| `TEMP_FILE_DIR` | Yes for uploads | Writable temporary upload directory |
| `VITE_API_URL` | Yes for separate frontend/API domains | Public API base URL ending in `/api/v1` |

Never commit `backend/config/config.env`, `frontend/.env.local`, private keys, or provider credentials.

## API operations

| Endpoint | Purpose |
| --- | --- |
| `GET /healthz` | Liveness probe; confirms the process is running |
| `GET /readyz` | Readiness probe; confirms MongoDB is connected |
| `/api/v1/user/*` | Registration, login, profile, logout, leaderboard |
| `/api/v1/auctionitem/*` | Auction browsing, creation, management, republishing |
| `/api/v1/bid/*` | Bid placement |
| `/api/v1/commission/*` | Commission proof submission |
| `/api/v1/superadmin/*` | Administrative review and reporting |

## Security and integrity controls

- Public registration permits only `Bidder` and `Auctioneer`; administrators cannot self-register.
- Authentication is delivered through HTTP-only, SameSite cookies; production cookies are secure-only.
- Bid updates are conditional database operations, preventing lower bids and race-condition overwrites.
- A completed auction with bids, a winner, or prior settlement cannot be republished.
- Each approved commission proof is atomically claimed before processing and may create only one commission record.
- Requests are protected with Helmet, CORS allow-listing, body limits, file limits, and rate limits.
- Production error responses do not expose internal error details.

## Demo payment workflow

The included payment centre is intentionally a **mock gateway** for product demonstrations. It models the complete auction-payment lifecycle without collecting card details or transferring real money:

1. After an auction closes, a payment record is created for the winning bidder.
2. The winning bidder opens **My Payments** and completes a demo checkout.
3. The payment becomes `payout_pending`; an administrator may release the simulated seller payout.
4. Buyers can request refunds and either party can open a dispute.
5. An administrator resolves a refund or dispute to a simulated refund or payout release.

Set `PAYMENT_PROVIDER=mock` until a merchant account and signed provider integration are available. A real Sri Lankan gateway integration requires merchant approval, provider-issued credentials, public webhook URLs, and legal review of marketplace settlement and disputes.

## Auction settlement worker

The API process does not settle auctions. Run one or more dedicated worker processes instead:

```powershell
Set-Location backend
npm run worker
```

Each worker takes a short-lived MongoDB lease before processing ended auctions. It then claims each auction and performs the winner totals, payment creation, and final settlement state in one MongoDB transaction. This prevents duplicate settlement when the worker is restarted or more than one worker is deployed.

MongoDB transactions require a replica set. Use MongoDB Atlas or a self-managed replica set in every environment that runs settlement; a standalone local MongoDB instance is not sufficient.

## Quality checks

Run these checks before every release:

```powershell
# Frontend
Set-Location frontend
npm run lint
npm run build
npm audit --omit=dev --audit-level=high

# Backend
Set-Location ../backend
npm test
npm audit --omit=dev --audit-level=high
```

The GitHub Actions workflow runs these checks for pull requests and pushes to `main`.

### MongoDB integration tests

`npm test` includes MongoDB-backed settlement integration tests. The first run downloads a temporary MongoDB binary into `backend/.mongodb-binaries/` and starts a single-node replica set, which is required to verify transactions and worker leases. CI runners must permit downloads from `fastdl.mongodb.org`, or provide a pre-cached MongoDB binary through the `mongodb-memory-server` configuration.

## Docker

Build the API image:

```powershell
docker build -t bidspirit-api ./backend
docker run --env-file ./backend/config/config.env -p 5000:5000 bidspirit-api
```

Build the frontend image. For separate deployments, use the final HTTPS API URL.

```powershell
docker build --build-arg VITE_API_URL=https://api.example.com/api/v1 -t bidspirit-web ./frontend
docker run -p 8080:80 bidspirit-web
```

For a single-domain deployment, configure your reverse proxy to route `/api/v1` to the API service and build the frontend with `VITE_API_URL=/api/v1`.

## Production checklist

- [ ] Use managed MongoDB with backups, alerts, and IP/network restrictions.
- [ ] Store every secret in the hosting platform’s secret manager.
- [ ] Configure HTTPS for both web and API domains.
- [ ] Set `NODE_ENV=production` and a unique 32+ character `JWT_SECRET_KEY`.
- [ ] Set `FRONTEND_URL` to only trusted HTTPS origins.
- [ ] Configure Cloudinary upload restrictions and SMTP credentials.
- [ ] Monitor `/healthz` and `/readyz`.
- [ ] Run the quality checks and dependency audit in CI before deploys.
- [ ] Deploy the API separately from one or more `npm run worker` worker instances; never start the worker from the API process.
- [ ] Use MongoDB Atlas or another replica-set deployment so settlement transactions are available.

## License

This project is currently provided without an explicit open-source license. Add a license before public redistribution.
