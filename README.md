# NexusCRM - Modern Full-Stack SaaS CRM

A complete, modern, full-stack Customer Relationship Management (CRM) web application inspired by **HubSpot** and **Pipedrive**. Built strictly with **JavaScript (no TypeScript)**, React, Tailwind CSS, Node.js, Express, and MongoDB. Styled in a **Dark Monokai + Teal** theme.

---

## 🚀 Features Overview

### 1. Layout & Design
- **Collapsible Navigation Sidebar**:
  - Smooth collapsible sidebar featuring **Dashboard**, **Contacts**, **Sales Pipeline**, **Tasks**, and **Settings**.
  - Active page states highlighted in glowing Teal with Monokai border indicators.
  - Organization workspace branding and plan badge.
- **Top Header**:
  - **Global Search Bar** (`Ctrl+K` shortcut) with instant fuzzy search across contacts, deals, and tasks.
  - **'+ New' Quick Action Button** with instant dropdown for adding contacts, deals, or tasks.
  - **User Profile Menu** with workspace details, one-click demo data population, and sign-out.
- **Floating Action Button (FAB)**:
  - Circular floating '+' button in the bottom-right corner with a pulse glow effect.
  - Clicking opens a speed-dial menu to quickly create contacts, deals, or follow-up tasks from anywhere in the app.
- **Dark Monokai + Teal Color Scheme**:
  - Deep Monokai background (`#1a1b18`), elevated panels (`#242520`), borders (`#3c3d36`), and text (`#f8f8f2`).
  - Vibrant Teal brand accents (`#14b8a6`, `#2dd4bf`) and Monokai syntax highlights (yellow, green, pink, cyan).

### 2. Authentication & Private Workspaces
- **JWT Authentication** with password hashing via `bcryptjs`.
- Simple Sign Up and Login system.
- Every user has their own private CRM workspace (`userId` scoping on Contacts, Deals, Tasks, and Activities).
- **1-Click Demo Login** button for instant access during evaluation (`demo@nexuscrm.io` / `demo1234`).

### 3. Executive Dashboard
- **4 Summary Cards**:
  1. **Total Contacts** (active leads directory)
  2. **Active Deals** (count + active pipeline dollar volume)
  3. **Total Revenue Won** (live sum of all Closed Won deals)
  4. **Pending Tasks** (urgent follow-ups & scheduled tasks)
- **Monthly Sales Performance Bar Chart**:
  - Custom responsive SVG bar chart displaying Closed-Won deal revenue and deal counts over recent months.
  - Interactive hover tooltips and dynamic scale calculations.
- **Today's Follow-ups**:
  - Urgent task manager widget with quick-completion checkboxes.
  - Overdue warning badges and direct links to customer profiles.
- **Pipeline Stage Value Summary**:
  - Pipedrive-style stage cards showing dollar values and deal counts per stage.

### 4. Contacts Directory & Activity Timeline
- **Searchable & Filterable Table**:
  - Columns: **Name**, **Email**, **Phone Number**, **Company**, **Lead Status** (New, Contacted, Qualified, Lost), and **Last Contacted Date**.
  - Real-time text search and quick status filter chips.
- **Full Detail & Activity Timeline Modal**:
  - Clicking any contact opens a clean modal with full details.
  - **Interactive Activity Timeline**: log notes about **Phone Calls**, **Meetings**, **Emails**, or **Notes**.
  - Logging an activity **automatically updates the contact's "Last Contacted Date"**!
  - Full **Create, Edit, and Delete** options with confirmation dialogs.

### 5. Visual Sales Pipeline (Kanban Board)
- **Interactive Drag-and-Drop Board** across 5 columns:
  1. `Lead In`
  2. `Contact Made`
  3. `Proposal Sent`
  4. `Negotiation`
  5. `Closed Won`
- **Deal Cards** display:
  - **Deal Title**
  - **Customer Name** (clickable link to customer profile)
  - **Deal Value ($)** formatted in bold currency
  - **Expected Close Date** (with overdue indicators)
  - Priority badge (High, Medium, Low)
- **Dynamic Revenue Sync**:
  - Dragging a card to **'Closed Won'** immediately updates the stage and **automatically recalculates total revenue won on the dashboard**!
  - Column headers display live deal counts and cumulative dollar totals.

### 6. Tasks & Follow-up Reminders
- Simple, powerful task manager to schedule follow-up reminders.
- Link tasks directly to specific customer contacts.
- Due date, priority level (High, Medium, Low), and task type (Call, Meeting, Email, Follow-up, Review).
- Interactive completion checkbox with strike-through styling.
- Filter by **All**, **Today's Due**, **Upcoming**, and **Completed**.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 (strictly JavaScript, no TypeScript), Tailwind CSS, Lucide React, Vite
- **Backend**: Node.js, Express, MongoDB with Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, CORS
- **Database**: MongoDB running on `mongodb://127.0.0.1:27017/crm_db`

---

## 🏃‍♂️ Quick Start Guide

### Start the Servers:

1. **Backend Server** (runs on port 5000):
   ```bash
   cd server
   npm start
   ```

2. **Frontend Client** (runs on port 3000):
   ```bash
   cd client
   npm run dev
   ```

3. Open **`http://localhost:3000`** in your browser.

### Instant Demo Access:
- Click the **"Instant Demo Access (1-Click)"** button on the login screen.
- Or sign up with any email and password.
- From the user profile menu or Settings page, click **"Seed Sample Demo Data"** to instantly populate realistic contacts, multi-stage deals, timeline entries, and follow-ups.
