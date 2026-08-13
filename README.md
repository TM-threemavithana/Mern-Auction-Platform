# Run BidSpirit locally or prepare it for production

BidSpirit is a full-stack auction platform for Sri Lankan rupees (LKR). It supports public catalogue browsing, bidder registration, auction management, concurrent-safe bidding, watchlists, valuations, commission proofs, and a payment workflow.

The repository runs in two modes. **Demo mode** shows local sample catalogue data when the API is unavailable. **Production mode** never falls back to sample data and rejects mock payments. Do not use the current mock workflow to accept real money.

## What the project includes

- **Auction experience**: responsive catalogue, search, saved lots, image gallery with zoom, auction calendar, leaderboard, and account pages
- **Role controls**: public sign-up permits only bidders and auctioneers; administrator access requires an existing administrator account
- **Bid integrity**: conditional MongoDB updates reject late, early, lower, and unapproved bids
- **Auction integrity**: settled auctions and auctions with bids cannot be republished
- **Settlement worker**: a dedicated worker lease and MongoDB transaction settle each ended auction once
- **Operational controls**: HTTP-only cookies, Helmet, CORS allow-listing, rate limits, upload limits, health endpoints, and production-safe errors
- **Demo workflows**: local-only auction services and mock payment states for UI demonstrations

## Project structure

```text
Mern-Auction-Platform/
├── frontend/                 React and Vite application
│   ├── src/                  Pages, components, Redux state, styles
│   └── .env.example          Frontend environment template
├── backend/                  Express API and settlement worker
│   ├── automation/           Settlement and commission jobs
│   ├── config/               Backend environment template
│   ├── tests/                Environment and MongoDB integration tests
│   ├── server.js             API process entry point
│   └── worker.js             Scheduled settlement worker entry point
└── .github/workflows/ci.yml  Continuous integration checks
```

## Prerequisites

Install the following before running the API:

- Node.js 22 LTS and npm 10 or later
- MongoDB 7 or later for normal development
- A MongoDB replica set for settlement transactions and integration tests
- Cloudinary credentials for user, auction, and proof uploads
- SMTP credentials for email notifications

## Run the demo interface

Use this mode when MongoDB or the API is not available. It shows sample lots in the browser, but it does not create real accounts, auctions, bids, payments, shipping requests, or messages.

```powershell
Set-Location frontend
npm ci
Copy-Item .env.example .env.local
npm run dev -- --host 127.0.0.1 --port 5173
```

Keep `VITE_APP_MODE=demo` in `frontend/.env.local`. Open [http://127.0.0.1:5173](http://127.0.0.1:5173).

## Run the full application locally

The API needs MongoDB, Cloudinary, and SMTP configuration. Copy the backend template and replace every placeholder before starting the API.

```powershell
Copy-Item backend/config/config.env.example backend/config/config.env
Copy-Item frontend/.env.example frontend/.env.local
```

Use these local frontend values:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_MODE=demo
```

Use development values similar to these in `backend/config/config.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/bidspirit
FRONTEND_URL=http://127.0.0.1:5173
JWT_SECRET_KEY=replace_with_a_unique_development_secret_of_at_least_32_characters
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
PAYMENT_PROVIDER=mock
```

Add the required Cloudinary, SMTP, and temporary-upload-directory values from `backend/config/config.env.example`.

Start the API and frontend in separate terminals:

```powershell
Set-Location backend
npm ci
npm run dev
```

```powershell
Set-Location frontend
npm ci
npm run dev -- --host 127.0.0.1 --port 5173
```

Start the settlement worker in a third terminal when MongoDB runs as a replica set:

```powershell
Set-Location backend
npm run worker:dev
```

## Configure environment variables

The backend loads `backend/config/config.env`. Keep this file and `frontend/.env.local` out of source control.

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | Yes | API port |
| `NODE_ENV` | Yes | Use `development` or `production` |
| `MONGO_URI` | Yes | MongoDB connection string |
| `MONGO_DB_NAME` | No | Database name; defaults to `MERN_AUCTION_PLATFORM` |
| `FRONTEND_URL` | Yes | Comma-separated list of trusted frontend origins |
| `JWT_SECRET_KEY` | Yes | JWT signing secret; use a unique value with at least 32 characters in production |
| `JWT_EXPIRE` | Yes | Token lifetime, such as `7d` |
| `COOKIE_EXPIRE` | Yes | Cookie lifetime in days |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | For uploads | Cloudinary credentials |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_MAIL`, `SMTP_PASSWORD` | For email | SMTP configuration |
| `TEMP_FILE_DIR` | For uploads | Writable temporary upload directory |
| `PAYMENT_PROVIDER` | Yes | `mock` only in demo/development; production requires a non-mock provider |
| `VITE_API_URL` | For the frontend | API base URL ending in `/api/v1` |
| `VITE_APP_MODE` | For the frontend | `demo` enables sample-data fallback; use `production` for a live deployment |

## API and worker endpoints

The API exposes these operational endpoints:

| Endpoint | Use |
| --- | --- |
| `GET /healthz` | Liveness check: confirms that the API process responds |
| `GET /readyz` | Readiness check: confirms that MongoDB is connected |
| `/api/v1/user/*` | Authentication, profile, and leaderboard |
| `/api/v1/auctionitem/*` | Catalogue and auction management |
| `/api/v1/bid/*` | Bid placement |
| `/api/v1/tools/*` | Watchlists, auction registration, and valuations |
| `/api/v1/commission/*` | Commission proofs |
| `/api/v1/payments/*` | Payment records and demo-only mock operations |
| `/api/v1/superadmin/*` | Administrator reporting and reviews |

## Understand the payment boundary

The payment screens currently model a workflow only. In demo mode, a winning bidder can mark a mock payment as complete; an administrator can simulate payout, refund, and dispute outcomes. No money, card data, or provider request is involved.

Production startup rejects `PAYMENT_PROVIDER=mock`. Before accepting real payments, implement and verify all of the following:

- A merchant-approved provider integration
- Signed webhook verification with idempotency keys
- A payment ledger that records provider events and settlement state
- Escrow, payout, refund, and dispute processes that match your legal obligations
- Encryption and key management for payout information
- Monitoring, reconciliation, and incident-response procedures

## Run checks

Run the following checks before every deployment:

```powershell
Set-Location frontend
npm run lint
npm run build
npm audit --omit=dev --audit-level=high
```

```powershell
Set-Location backend
npm test
npm audit --omit=dev --audit-level=high
```

`npm test` runs deterministic environment tests. Run the transaction and worker test separately:

```powershell
Set-Location backend
npm run test:integration
```

The integration suite downloads a temporary MongoDB binary into `backend/.mongodb-binaries/` and starts a single-node replica set. Configure CI to permit that download or pre-cache an approved MongoDB binary.

## Deploy safely

Use managed MongoDB with backups, monitoring, alerts, and network restrictions. Configure HTTPS for both the web and API domains. Store every secret in your hosting platform’s secret manager.

Deploy the API and worker as separate services. Run one scheduled worker instance unless you have verified the worker lease and MongoDB transaction behavior under multiple replicas. Monitor `/healthz` and `/readyz` from your hosting platform.

Before a production release, set `VITE_APP_MODE=production`, set `FRONTEND_URL` to trusted HTTPS origins only, use a unique production JWT secret, and configure a real payment provider. Add the MongoDB integration suite as a protected CI job and require it to pass before deployment.

## License

This repository has no open-source license. Add a license before redistributing it publicly.
