# Mini Expense Tracker

Studio Graphene Full Stack Developer Assessment - Exercise 2.

Mini Expense Tracker is a full-stack expense management app built with React, Vite, Express, MongoDB, and Mongoose. It supports expense CRUD, filtering, analytics, charts, CSV export, budget tracking, and responsive dashboard UI.

## AI Assistance Disclosure

AI tools were used as a development assistant for planning, code review, UI polish ideas, documentation wording, and test coverage checks. Final implementation decisions, feature integration, manual verification, and Git workflow were reviewed and completed by the developer.

## Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- Axios
- Recharts

**Backend**
- Node.js
- Express
- MongoDB
- Mongoose
- Vitest

## Features

- Add, edit, delete, and view expenses
- Category filtering
- Date range filtering
- This month and last month quick filters
- Summary dashboard
- Highest expense insight
- Monthly total
- Category pie chart
- CSV export for visible expenses
- Budget tracking with local persistence
- Loading, empty, error, and validation states
- Mobile responsive UI

## Project Structure

```txt
api/
  server.js
  src/
    app.js
    config/
    controllers/
    middlewares/
    models/
    routes/
    services/
    utils/

web/
  src/
    components/
    constants/
    hooks/
    services/
    utils/
```

## Environment Variables

Create `api/.env`:

```env
PORT=5050
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
```

Optional frontend env:

```env
VITE_API_BASE_URL=http://localhost:5050/api/v1
```

## Run Locally

Install backend dependencies:

```bash
cd api
npm install
```

Start backend:

```bash
npm run dev
```

Install frontend dependencies:

```bash
cd ../web
npm install
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

Backend health check:

```txt
GET http://localhost:5050/api/v1/health
```

## API Endpoints

```txt
GET    /api/v1/health
GET    /api/v1/budgets
PUT    /api/v1/budgets
GET    /api/v1/expenses
POST   /api/v1/expenses
PUT    /api/v1/expenses/:id
DELETE /api/v1/expenses/:id
```

Expense filters:

```txt
GET /api/v1/expenses?category=food
GET /api/v1/expenses?startDate=2026-06-01&endDate=2026-06-30
```

### Health Check

```txt
GET /api/v1/health
```

Request body: not required.

Success response:

```json
{
  "success": true,
  "message": "Expense Tracker API is healthy",
  "timestamp": "2026-06-10T10:30:00.000Z"
}
```

### Get Budgets

```txt
GET /api/v1/budgets
```

Request body: not required.

Success response:

```json
{
  "success": true,
  "message": "Budgets fetched successfully",
  "data": [
    {
      "category": "food",
      "amount": 5000
    },
    {
      "category": "transport",
      "amount": 2000
    }
  ]
}
```

### Update Budgets

```txt
PUT /api/v1/budgets
```

Request body:

```json
{
  "budgets": [
    {
      "category": "food",
      "amount": 5000
    },
    {
      "category": "transport",
      "amount": 2000
    }
  ]
}
```

Success response:

```json
{
  "success": true,
  "message": "Budgets updated successfully",
  "data": [
    {
      "category": "food",
      "amount": 5000
    },
    {
      "category": "transport",
      "amount": 2000
    }
  ]
}
```

Validation error response:

```json
{
  "success": false,
  "message": "Budget validation failed",
  "details": {
    "budgets.0.amount": "Budget amount must be zero or greater"
  }
}
```

### Get Expenses

```txt
GET /api/v1/expenses
```

Optional query params:

```txt
category=food
startDate=2026-06-01
endDate=2026-06-30
```

Success response:

```json
{
  "success": true,
  "message": "Expenses fetched successfully",
  "count": 1,
  "data": [
    {
      "_id": "665f1f77bc8a6e84fd650111",
      "title": "Lunch",
      "amount": 250,
      "category": "food",
      "date": "2026-06-10T00:00:00.000Z",
      "note": "Team lunch",
      "createdAt": "2026-06-10T10:30:00.000Z",
      "updatedAt": "2026-06-10T10:30:00.000Z"
    }
  ]
}
```

### Create Expense

```txt
POST /api/v1/expenses
```

Request body:

```json
{
  "title": "Lunch",
  "amount": 250,
  "category": "food",
  "date": "2026-06-10",
  "note": "Team lunch"
}
```

Success response:

```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "_id": "665f1f77bc8a6e84fd650111",
    "title": "Lunch",
    "amount": 250,
    "category": "food",
    "date": "2026-06-10T00:00:00.000Z",
    "note": "Team lunch",
    "createdAt": "2026-06-10T10:30:00.000Z",
    "updatedAt": "2026-06-10T10:30:00.000Z"
  }
}
```

Validation error response:

```json
{
  "success": false,
  "message": "Expense validation failed",
  "details": {
    "title": "Title is required",
    "amount": "Amount must be greater than 0",
    "category": "Category is invalid"
  }
}
```

### Update Expense

```txt
PUT /api/v1/expenses/:id
```

Request body supports partial updates:

```json
{
  "amount": 300,
  "note": "Updated amount"
}
```

Success response:

```json
{
  "success": true,
  "message": "Expense updated successfully",
  "data": {
    "_id": "665f1f77bc8a6e84fd650111",
    "title": "Lunch",
    "amount": 300,
    "category": "food",
    "date": "2026-06-10T00:00:00.000Z",
    "note": "Updated amount",
    "createdAt": "2026-06-10T10:30:00.000Z",
    "updatedAt": "2026-06-10T10:45:00.000Z"
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Expense id is invalid"
}
```

```json
{
  "success": false,
  "message": "Expense not found"
}
```

### Delete Expense

```txt
DELETE /api/v1/expenses/:id
```

Request body: not required.

Success response:

```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Expense id is invalid"
}
```

```json
{
  "success": false,
  "message": "Expense not found"
}
```

## Testing

Backend tests:

```bash
cd api
npm test
```

Frontend checks:

```bash
cd web
npm run lint
npm run build
```

## Git Workflow

Feature branches used:

```txt
main
develop
feature/expense-crud
feature/expense-filters
feature/analytics-dashboard
feature/charts-visualization
feature/bonus-features
feature/documentation-deployment
```

Each feature was implemented in small commits using Conventional Commits.

## Code Quality Notes

- Comments are intentionally targeted and explain business rules or edge cases, not obvious line-by-line behavior.
- Backend code follows MVC separation with a service layer for database rules and middleware for request validation.
- Frontend code keeps data fetching in hooks, API calls in services, and reusable calculations in utilities.
- UI states cover loading, empty, filtered-empty, error, and mobile layouts to keep the dashboard production-ready.
