# Shield Frontend

**Vue.js 3 Dashboard for Shield Cybersecurity Operations Center**

## Tech Stack

- **Vue.js 3** - Composition API
- **Vite** - Build tool
- **Pinia** - State management
- **Vue Router** - Routing
- **Axios** - HTTP client

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AlertPanel.vue      # Alert list and details modal
│   │   ├── IncidentLog.vue     # Incident table and details modal
│   │   ├── SimulationPanel.vue # Data stream simulation controls
│   │   └── SystemHealth.vue    # System status cards and details modal
│   ├── views/
│   │   ├── Dashboard.vue       # Main dashboard view
│   │   └── Login.vue           # Login page
│   ├── stores/
│   │   └── auth.js             # Pinia auth store (login/logout, token management)
│   ├── services/
│   │   └── api.js              # Axios API client with interceptors
│   ├── router/
│   │   └── index.js            # Vue Router config with auth guard
│   ├── App.vue                 # Root component
│   └── main.js                 # App entry point
├── public/
│   └── favicon.svg
├── index.html
├── .env                        # Environment variables
├── vite.config.js
└── package.json
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Runs at http://localhost:5173

## Build

```bash
npm run build
```

Output in `dist/` folder.

## Environment Variables

`.env` file:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Components

### Dashboard.vue
`src/views/Dashboard.vue`

Main dashboard view containing:
- Header with logo, status badge, clock, sign out
- SimulationPanel component
- Stats cards (threats, systems, incidents, uptime)
- SystemHealth component
- IncidentLog component
- AlertPanel component

**Status Logic:**
- 0 open incidents → NORMAL (green)
- 1-4 open incidents → WARNING (yellow)
- 5+ open incidents → CRITICAL (red)

### Login.vue
`src/views/Login.vue`

Login form with:
- Email/password inputs
- Show/hide password toggle
- "Load Demo Credentials" button
- Error display

### SimulationPanel.vue
`src/components/SimulationPanel.vue`

Controls for data simulation:
- Start/Stop Stream button
- Streaming status indicator
- Last event display

### SystemHealth.vue
`src/components/SystemHealth.vue`

Displays system status cards:
- System name, type, status (ONLINE/DEGRADED/OFFLINE)
- IP address, last seen, location
- Click to open System Details modal

### IncidentLog.vue
`src/components/IncidentLog.vue`

Incident management:
- Filterable table (severity, status, search)
- Incident count display
- Click row to open Incident Details modal
- Resolve Incident button in modal

### AlertPanel.vue
`src/components/AlertPanel.vue`

Alert management:
- Filter by type dropdown
- Priority-colored alert cards
- Dismiss button (X) on each alert
- Click to open Alert Details modal
- Dismiss Alert button in modal

## Services

### api.js
`src/services/api.js`

Axios client with:
- Base URL from environment
- Request interceptor (adds auth token)
- Response interceptor (handles 401 → redirect to login)

**Available methods:**
- `api.auth.login(credentials)`
- `api.auth.logout()`
- `api.auth.getUser()`
- `api.dashboard.getStats()`
- `api.threats.getAll()`
- `api.systems.getAll()`
- `api.incidents.getAll()` / `.create()` / `.update()` / `.delete()`
- `api.alerts.getAll()` / `.dismiss()`
- `api.simulate.random()` / `.threat()` / `.alert()` / `.incident()`

## Stores

### auth.js
`src/stores/auth.js`

Pinia store for authentication:

**State:**
- `user` - Current user object
- `token` - Auth token

**Getters:**
- `isAuthenticated` - Boolean

**Actions:**
- `login(credentials)` - Login and store token
- `logout()` - Clear token and user

## Router

### index.js
`src/router/index.js`

**Routes:**
- `/login` - Login page
- `/` - Dashboard (requires auth)

**Auth Guard:**
- No token → redirect to `/login`
- Has token on `/login` → redirect to `/`

## Styling

CSS variables defined in `App.vue`:

```css
--color-blue-700: #1a56db
--color-blue-900: #0a2540
--color-success: #16a34a
--color-warning: #ca8a04
--color-danger: #dc2626
--color-bg-primary: #ffffff
--color-bg-secondary: #f8fafc
--color-border: #e2e8f0
--color-text-primary: #0f172a
--color-text-secondary: #64748b
```
