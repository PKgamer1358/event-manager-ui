# Event Manager - Detailed Code Explanation

This guide provides a file-by-file walkthrough of the application code, designed to help you answer questions during an exam or viva. It explains **what** each file does, **why** it's there, and breaks down the key logic.

---

## 🏗️ Part 1: Frontend (`event-manager-ui`)

The frontend is built with **React**, **TypeScript**, and **Material UI (MUI)**. It uses **Context API** for global state management (Authentication).

### 1. `src/index.tsx` (Entry Point)
**Purpose**: This is the "root" of your React application. It is the first code that runs.
**Key Logic**:
- `ReactDOM.createRoot(...)`: Attaches the React app to the HTML element with `id="root"`.
- `<BrowserRouter>`: Enables routing (navigating between pages without reloading).
- `<AuthProvider>`: Wraps the app to provide user login state (logged in/out) globally.
- `<App />`: Renders the main App component.

### 2. `src/App.tsx` (Routing & Layouts)
**Purpose**: Defines the structure of the application and maps URLs to Pages.
**Key Logic**:
- **`AuthGate`**: A small wrapper that shows "Loading..." while the app checks if the user is logged in. This prevents the user from being kicked to the login screen while the token is being verified.
- **`Routes`**: Defines the paths:
    - `/` -> `Home` page.
    - `/login` -> `Login` page.
    - `/events` -> `EventList` (protected).
- **`PrivateRoute`**: A wrapper used on sensitive routes (like `/events`). If a user isn't logged in, it redirects them to `/login`.

### 3. `src/components/PrivateRoute.tsx` (Security Wrapper)
**Purpose**: Protects pages that require login.
**Key Logic**:
- Uses `useAuth()` to check `isAuthenticated`.
- **Logic**:
    - If `loading`, show nothing (wait).
    - If `!isAuthenticated`, `<Navigate to="/login" />`.
    - If `adminOnly` is true but user is not admin, redirect to `/events`.
    - Otherwise, render the `children` (the actual page).

### 4. `src/components/Navbar.tsx` (Navigation)
**Purpose**: The top bar containing links and the user profile.
**Key Logic**:
- **Conditional Rendering**:
    - If `isAuthenticated` is false, it shows "Login" and "Sign Up" buttons.
    - If true, it shows links like "Events" and the User Avatar.
- **Role-Based Links**: Checks `isAdmin` or `isSuperAdmin` to show/hide "Users" or "All Registrations" links.
- **Mobile Support**: Uses a distinct layout (hamburger menu) for mobile screens (`xs: flex`, `md: none`).

### 5. `src/pages/Login.tsx` (Authentication Page)
**Purpose**: Allows users to sign in.
**Key Logic**:
- **State**: Uses `useState` for `formData` (username, password) and `error` messages.
- **`handleSubmit`**:
    1. Prevents default form submission (browser reload).
    2. Calls `authService.login(formData)`.
    3. On success: Calls `login(token, user)` from context and redirects to `/events`.
    4. On failure: Sets the `error` state to display an alert.

### 6. `src/services/authService.ts` (API Calls)
**Purpose**: Handles communication with the Backend for Login/Signup.
**Key Logic**:
- **`authService.login`**:
    - Sends a POST request to `/api/auth/login`.
    - `FormData` is used because the backend uses OAuth2 standard (expects form fields, not JSON).
    - **`decodeToken`**: After getting the JWT (token), it decodes it to extract user info (ID, Role, Name) and returns a `User` object.

---

## ⚙️ Part 2: Backend (`event-manager-api`)

The backend is built with **FastAPI** (Python), **SQLAlchemy** (Database), and **Pydantic** (Validation).

### 1. `app/main.py` (Server Entry Point)
**Purpose**: Initializes the API server.
**Key Logic**:
- **`FastAPI()`**: Creates the app instance.
- **`CORSMiddleware`**: Crucial for security. It allows your Frontend (running on port 3000) to talk to the Backend (port 8000). Without this, browsers block the request.
- **`app.include_router(...)`**: Registers the different modules (Auth, Events, Users) so their URLs work.

### 2. `app/database.py` (Database Connection)
**Purpose**: Connects Python to the SQLite/Postgres database.
**Key Logic**:
- **`create_engine`**: Establishes the actual connection.
- **`SessionLocal`**: A factory for creating database sessions.
- **`get_db`**: A helper function ("Dependency") used in every API route. It opens a database session for the request and closes it strictly afterwards, preventing connection leaks.

### 3. `app/models.py` (Database Tables)
**Purpose**: Defines the structure of the database tables (Schema).
**Key Logic**:
- **`User`**: Stores login info (`username`, `password_hash`).
    - `set_password`: Hashes the password using `bcrypt` before saving (never store plain passwords!).
    - `verify_password`: Checks a plain password against the stored hash.
- **`Event`**: Stores event details (`title`, `start_time`, `capacity`).
    - `registrations`: A "relationship" linking an Event to many Registrations.
- **`Registration`**: A link table connecting a `User` and an `Event` (`user_id`, `event_id`).

### 4. `app/schemas.py` (Data Validation)
**Purpose**: Defines what JSON data the API expects (Input) and returns (Output).
**Key Logic**:
- **`UserCreate`**: Ensures sent data has a valid email and password min length.
- **`EventCreate`**: Ensures an event has a title, category, and start time.
- **`EventResponse`**: Controls what data is sent back to the frontend (e.g., hiding private fields). Uses `from_attributes=True` to assume data comes from SQLAlchemy models.

### 5. `app/dependencies.py` (Security & Helpers)
**Purpose**: Reusable logic for protecting routes.
**Key Logic**:
- **`get_current_user`**:
    1. Reads the `Authorization: Bearer <token>` header.
    2. **`verify_token`**: Decodes the JWT using the `SECRET_KEY`.
    3. If valid, fetches the user from the DB.
    4. If invalid, raises `401 Unauthorized`.
- **`get_current_admin_user`**: Checks if `get_current_user` returned a user with `is_admin=True`.

### 6. `app/routers/auth.py` (Authentication Endpoints)
**Purpose**: Handles Login and Signup requests.
**Key Logic**:
- **`POST /signup`**:
    - Checks if `username` already exists.
    - Creates a new `User` and `Student` record.
- **`POST /login`**:
    - Finds user by username.
    - Checks password.
    - Generates a **JWT Token** (`create_access_token`) containing the User ID and Admin status.

### 7. `app/routers/events.py` (Event Management)
**Purpose**: Creating, listing, and registering for events.
**Key Logic**:
- **`GET /events`**:
    - **Timezone Handling**: Compares "Server Time" vs "Local Time" (IST) to correctly sort Upcoming vs Past events.
    - Filters: Supports filtering by `category` or `club`.
- **`POST /events`**:
    - Protected by `get_current_admin_user`.
    - Validates that `end_time` > `start_time`.
- **`POST /events/{id}/upload`**:
    - Handles file uploads to **Cloudinary**.
    - Stores the returned `file_url` in the `EventMedia` table.

---

## 🛠️ Part 3: Tools & Technologies

This section lists the specific libraries used and **why** they are used.

### Frontend (`event-manager-ui`)

#### 1. React
- **Why**: It is the industry-standard "Library" for building interactive User Interfaces. It lets us build reusable components (like a Navbar or Event Card) instead of rewriting HTML for every page.
- **How**:
    - We create components (e.g., `EventCard.tsx`) that take data ("props") and return UI.
    - We use "Hooks" like `useState` to track data (e.g., typed text in a form) and `useEffect` to trigger actions (e.g., load events when page opens).

#### 2. TypeScript
- **Why**: JavaScript is "loosely typed" (variables can be anything), which leads to crashes. TypeScript adds safety by forcing us to define what each variable is (Structure).
- **How**:
    - We define `interfaces` (e.g., `User` has `id`, `name`, `email`).
    - If we try to access `user.phone` but didn't define it, TypeScript blocks the code from running, preventing bugs before they happen.

#### 3. Material UI (MUI)
- **Why**: Building beautiful buttons, inputs, and layouts from scratch takes too long. MUI provides Google-standard "Material Design" components ready to use.
- **How**:
    - Instead of writing `<div class="box">`, we use `<Box sx={{ padding: 2 }}>`.
    - We use the `ThemeProvider` to set our brand colors (Primary, Secondary) globally, so changing one color updates the whole app.

#### 4. React Router
- **Why**: A "Single Page Application" (SPA) shouldn't reload the browser when you click a link. React Router swaps the page content instantly.
- **How**:
    - Defined in `App.tsx` using `<Routes>` and `<Route>`.
    - We use `navigate("/events")` in code to switch pages programmatically afteractions like logging in.

#### 5. Axios
- **Why**: The standard browser `fetch` command is basic. Axios automatically handles transforming JSON data and makes error handling easier.
- **How**:
    - We created an "instance" in `src/utils/axios.ts` that includes the base URL (`http://localhost:8000`).
    - We use it in Services: `axios.get('/events')`. It sends our JWT token automatically if we configure interceptors.

#### 6. Capacitor
- **Why**: We want a Mobile App (APK) but only know Web Code. Capacitor wraps our website in a "Web View" so it runs like a native app on Android.
- **How**:
    - We run `npx cap sync` to copy our build folder to the `android/` folder.
    - Plugins like `@capacitor/status-bar` let us control phone features (like the top status bar color) from JavaScript.

### Backend (`event-manager-api`)

#### 1. FastAPI
- **Why**: It is one of the fastest Python frameworks. It validates data automatically and creates the `/docs` page for free.
- **How**:
    - We define "Routes" (URL paths) like `@app.get("/events")`.
    - It uses "Type Hints" (`def create_event(event: EventCreate)`) to know what data to expect. If you send the wrong data, FastAPI rejects it automatically.

#### 2. SQLAlchemy
- **Why**: Writing raw SQL queries (`SELECT * FROM users...`) is error-prone. SQLAlchemy lets us work with Python "Objects".
- **How**:
    - We define a Class `User` in `models.py`.
    - To get data, we write `db.query(User).filter(User.username == "john").first()`. SQLAlchemy translates this to SQL for us.

#### 3. Pydantic
- **Why**: We need to be strict about what data enters our API. Pydantic guarantees data integrity.
- **How**:
    - We create "Schemas" in `schemas.py` (e.g., `EventCreate`).
    - When a user sends JSON, Pydantic checks: "Is email an email format?", "Is age a number?". If not, it throws a clear 422 error.

#### 4. Alembic
- **Why**: Database tables change (e.g., adding a "phone_number" column). We can't just delete the database every time. Alembic tracks these changes.
- **How**:
    - We generate a "migration script" that says `op.add_column(...)`.
    - Running `alembic upgrade head` applies this change to the real database safely.

#### 5. Python-Jose (JWT)
- **Why**: We need a way to keep users logged in securely. JWT (JSON Web Tokens) allow this without storing sessions in the database.
- **How**:
    - When logging in, we use `jwt.encode()` to wrap the User ID into a secret string.
    - In `dependencies.py`, we use `jwt.decode()` to unwrap it and find out who is making the request.

#### 6. Cloudinary
- **Why**: Our API runs on servers (like Vercel) that delete files after a few minutes (Ephemeral storage). We need a permanent place for images.
- **How**:
    - In `routers/events.py`, we accept a file upload.
    - We send this file to Cloudinary's API.
    - Cloudinary gives us a permanent URL (e.g., `https://res.cloudinary...`), which we save in our database.

