# Yugens-Hub

A clean, minimal subscription management app built with the MERN stack. Track your recurring payments, view upcoming charges, and monitor your monthly/yearly spending.

## Features

- ✓ Add, edit, and delete subscriptions
- ✓ Automatic next payment date calculation
- ✓ Visual payment status indicators (overdue, today, soon, upcoming)
- ✓ Monthly and yearly spending overview
- ✓ Support for weekly, monthly, and yearly billing cycles
- ✓ Clean, minimal interface with refined typography
- ✓ Responsive design for mobile and desktop

## Tech Stack

**Frontend:**
- React 18
- Axios for API calls
- date-fns for date manipulation
- Custom CSS with distinctive typography (IBM Plex Mono + Crimson Pro)

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- RESTful API architecture

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### 1. Clone and Install

```bash
# Navigate to the project
cd subscription-tracker

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/subscription-tracker
PORT=5000
```

For MongoDB Atlas, use your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/subscription-tracker
```

### 3. Start MongoDB (if using local installation)

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 4. Run the Application

**Option A: Run both servers separately**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

**Option B: Use concurrently (recommended)**

First, install concurrently in the root:
```bash
npm install concurrently
```

Then add this to root `package.json`:
```json
{
  "scripts": {
    "dev": "concurrently \"cd server && npm run dev\" \"cd client && npm start\""
  }
}
```

Run both servers:
```bash
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## API Endpoints

```
GET    /api/subscriptions       - Get all subscriptions
GET    /api/subscriptions/:id   - Get single subscription
POST   /api/subscriptions       - Create new subscription
PATCH  /api/subscriptions/:id   - Update subscription
DELETE /api/subscriptions/:id   - Delete subscription
GET    /api/health              - Health check
```

## Usage

### Adding a Subscription

1. Click the `+` button in the header
2. Fill in the subscription details:
   - Service name (e.g., "Spotify")
   - Cost (e.g., "11.00")
   - Billing cycle (weekly/monthly/yearly)
   - Last payment date
3. Click "Add Subscription"

### Viewing Subscriptions

The app displays:
- **Payment status badge**: Shows overdue, today, tomorrow, or days until next payment
- **Next payment date**: Full date when the next payment is due
- **Cost**: Amount charged per billing cycle

Status colors:
- 🔴 Red border: Overdue payments
- 🟠 Orange badge: Due today or within 7 days
- ⚫ Black border: Upcoming payments

### Editing and Deleting

- Click the pencil icon (✎) to edit a subscription
- Click the × icon to delete a subscription

## Project Structure

```
subscription-tracker/
├── client/                    # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── SubscriptionForm.js
│   │   │   ├── SubscriptionList.js
│   │   │   └── Stats.js
│   │   ├── styles/
│   │   │   └── App.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                    # Node.js backend
│   ├── config/
│   ├── models/
│   │   └── Subscription.js
│   ├── routes/
│   │   └── subscriptions.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Design Philosophy

This app follows a **clean minimal** aesthetic with:
- Refined typography pairing (IBM Plex Mono + Crimson Pro)
- Cream (#FFFEF9) and black (#0A0A0A) color scheme
- Subtle borders instead of shadows
- Intentional spacing and alignment
- Smooth micro-interactions
- Progressive disclosure of information

## Future Enhancements

- [ ] Email/SMS notifications for upcoming payments
- [ ] Payment history tracking
- [ ] Budget alerts and spending insights
- [ ] Categories and tags for subscriptions
- [ ] Export data to CSV
- [ ] Dark mode toggle
- [ ] Multi-currency support
- [ ] Shared subscriptions for families

## Troubleshooting

**MongoDB Connection Error:**
- Verify MongoDB is running: `mongosh` (should connect without errors)
- Check your connection string in `.env`
- For Atlas, ensure IP whitelist includes your IP

**Port Already in Use:**
- Change PORT in server `.env` file
- Kill process using the port: `lsof -ti:5000 | xargs kill -9`

**CORS Errors:**
- Ensure proxy is set in client `package.json`: `"proxy": "http://localhost:5000"`
- Backend CORS middleware should allow all origins in development

## License

MIT

---

Built with ☕ by Azariah
