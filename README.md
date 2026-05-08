# OnlyFunds

A modern personal finance tracker built with the MERN stack. Track subscriptions, manage income streams, log expenses, and calculate savings - all with a sleek, warm dark theme.

## Features

### Subscription Management
- Track recurring subscriptions (weekly, fortnightly, monthly, yearly)
- Automatic next payment date calculation
- Visual indicators for upcoming and overdue payments
- Edit and delete subscriptions with ease

### Income Tracking
- Manage multiple income streams (salary, freelance, passive, other)
- Support for different payment frequencies
- Active/inactive income toggles
- Comprehensive income statistics (weekly, monthly, yearly)

### Expense Tracker
- Log one-off expenses by category
- 10 expense categories: groceries, dining, snacks, gas, transport, entertainment, shopping, health, utilities, other
- Monthly expense summaries with category breakdowns
- Visual month selector to review past expenses

### Savings Calculator
- Calculate potential savings over custom time periods
- Factor in all income streams and subscriptions
- See breakdown of income vs. expenses
- Project future savings

### Modern UI
- Warm dark stone theme (#1C1917 background)
- Rich blue accents (#3B82F6)
- Responsive design for all screen sizes
- IBM Plex Mono + Crimson Pro fonts
- Smooth animations and transitions

## Tech Stack

**Frontend:**
- React 18
- Axios for API calls
- date-fns for date manipulation
- Custom CSS with CSS variables

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- RESTful API architecture
- CORS enabled

**Database:**
- MongoDB (local or Atlas)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed locally OR MongoDB Atlas account
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd onlyfunds
```

2. **Install dependencies**

Install root dependencies:
```bash
npm install
```

Install client dependencies:
```bash
cd client
npm install
cd ..
```

Install server dependencies:
```bash
cd server
npm install
cd ..
```

3. **Configure MongoDB**

Create `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/onlyfunds
PORT=5000
```

For MongoDB Atlas (cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/onlyfunds
PORT=5000
```

4. **Start MongoDB** (if using local)
```bash
# Windows
net start MongoDB

# Mac/Linux
brew services start mongodb-community
# or
sudo systemctl start mongod
```

## Running the App

### Development Mode

**Option 1: One command (recommended)**
```bash
npm start
```
This runs both client and server concurrently.

**Option 2: Separate terminals**

Terminal 1 - Backend:
```bash
cd server
npm start
```

Terminal 2 - Frontend:
```bash
cd client
npm start
```

The app will open at `http://localhost:3000`

### Quick Launch (Desktop Shortcut)

Create `start.bat` in the project root:
```batch
@echo off
npm start
pause
```

Right-click → Send to Desktop (create shortcut)

Now just double-click the shortcut to launch!

## API Endpoints

### Subscriptions
- `GET /api/subscriptions` - Get all subscriptions
- `POST /api/subscriptions` - Create new subscription
- `GET /api/subscriptions/:id` - Get subscription by ID
- `PATCH /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription

### Income
- `GET /api/income` - Get all income streams
- `PATCH /api/income` - Update income streams

### Expenses
- `GET /api/expenses` - Get expenses (with date filters)
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/summary` - Get monthly summary
- `PATCH /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Health Check
- `GET /api/health` - Server health check

## Key Design Decisions

### Billing Cycles
Supported frequencies: `weekly`, `fortnightly`, `monthly`, `yearly`

### Date Calculations
- 1 month = 4.33 weeks (52/12)
- 1 month = 2.165 fortnights
- Uses 30.44 days/month for accurate calculations

### Next Payment Logic
Uses a `while` loop to keep adding billing cycles until a future date is found, preventing "overdue" bugs.

### Income Model
Fields: `userId`, `name`, `amount`, `frequency`, `type`, `isActive`

### Expense Model
Fields: `userId`, `description`, `amount`, `category`, `date`

### Stats Calculation
All income/subscription amounts normalized to monthly first, then converted to weekly/yearly as needed.

## Color Palette

```css
--cream: #1C1917     /* Warm dark stone background */
--black: #E7E5E4     /* Warm stone text */
--gray: #A8A29E      /* Warm gray for secondary text */
--light-gray: #292524 /* Warm subtle borders */
--accent: #3B82F6    /* Rich blue accent */
--success: #10B981   /* Modern emerald green */
--warning: #F97316   /* Warm orange */
```

## Contributing

This is a personal project, but feel free to fork and customize for your own use!

## Future Enhancements

- [ ] Budget planning features
- [ ] Data export (CSV, PDF)
- [ ] Charts and visualizations
- [ ] Multi-currency support
- [ ] Mobile app (React Native or PWA)
- [ ] Recurring expense tracking
- [ ] Financial goal setting

## License

MIT

## Author

Az - 2026

---

**Note:** This app stores data locally in MongoDB. For cloud sync across devices, configure MongoDB Atlas in your `.env` file.
