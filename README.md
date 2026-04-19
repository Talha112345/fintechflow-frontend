# FintechFlow — Personal Finance & Loan Manager

## Project Description
FintechFlow is a full-stack personal finance management web application built for BS Fintech Web Programming Assignment. It allows users to manage a digital wallet (deposits/withdrawals), apply for micro-loans, view transaction history, check loan statuses, and calculate EMI for loans. All data is stored in-memory on the server. Built with React.js (frontend) and Node.js/Express.js (backend) communicating via a RESTful API.

## Live Links
- **Frontend (Vercel):** https://fintechflow-frontend-six.vercel.app
- **Backend (Railway):** https://fintechflow-backend-production.up.railway.app

---

## How to Run Locally

### Prerequisites
- Node.js installed (v18 or above)
- Git installed

### 1. Clone the repositories
```bash
git clone https://github.com/Talha112345/fintechflow-backend.git
git clone https://github.com/Talha112345/fintechflow-frontend.git
```

### 2. Run the Backend
```bash
cd fintechflow-backend
npm install
node server.js
# Server runs at http://localhost:5000
```

### 3. Run the Frontend
```bash
cd fintechflow-frontend
npm install
```
Create a `.env` file inside the frontend folder:
VITE_API_URL=http://localhost:5000
Then start the dev server:
```bash
npm run dev
# App runs at http://localhost:5173
```

---

## API Endpoint Table

### Wallet & Transaction Endpoints

| Method | Endpoint | Description | Request Body | Status Codes |
|--------|----------|-------------|--------------|--------------|
| GET | /api/wallet | Returns wallet object with balance, currency, owner | None | 200 |
| POST | /api/wallet/deposit | Adds amount to balance. Rejects if amount ≤ 0 | `{ amount: 5000 }` | 200 / 400 |
| POST | /api/wallet/withdraw | Deducts amount. Rejects if insufficient balance or amount ≤ 0 | `{ amount: 1200 }` | 200 / 400 |
| GET | /api/transactions | Returns all transactions newest-first. Supports `?type=credit` or `?type=debit` | None (query param optional) | 200 |

### Loan Management & EMI Endpoints

| Method | Endpoint | Description | Request Body | Status Codes |
|--------|----------|-------------|--------------|--------------|
| POST | /api/loans/apply | Accepts loan application. Validates all fields. Auto-assigns id and sets status = pending | `{ applicant, amount, purpose, tenure }` | 201 / 400 |
| GET | /api/loans | Returns all loan applications stored in memory | None | 200 |
| PATCH | /api/loans/:id/status | Updates loan status to approved or rejected | `{ status: 'approved' }` | 200 / 400 / 404 |
| GET | /api/emi-calculator | Computes EMI server-side. Returns emi, totalPayable, totalInterest | Query params: `?principal=&annualRate=&months=` | 200 / 400 |

---

## Author
- **Name:** Talha Akbar
- **Roll Number:** 23i-5573
- **University:** FAST-NUCES Islamabad
