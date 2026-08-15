# 🚀 Skilliant Admin Portal

A modern and responsive administrative management portal for **Skilliant — Online Labour Finding Platform**, designed to provide centralized control over users, labourers, contractors, bookings, payments, reports, analytics, notifications, support, administration, and platform settings.

## ✨ Key Features

- 🏠 **Dashboard** — Platform KPIs, financial overview, charts, analytics, and recent activity
- 👥 **User Management** — Manage customer profiles, account status, and user actions
- 👷 **Labour Management** — Manage labourers, skills, availability, verification, and records
- 🏢 **Contractor Management** — Manage contractor profiles, companies, locations, contacts, and verification
- 🗂️ **Categories & Skills** — Create, edit, search, and manage platform categories and professional skills
- 📅 **Booking Management** — Create, view, edit, search, filter, cancel, and manage bookings
- 💳 **Payments & Escrow** — Manage payments, escrow, commissions, payouts, and refunds
- 📊 **Reports & Analytics** — Revenue, booking performance, user growth, financial insights, and platform analytics
- 📥 **Data Export** — Export supported reports and administrative data
- 🔔 **Notifications** — Centralized notification management with read/unread tracking and filtering
- 🎫 **Support Tickets** — Create, assign, prioritize, reply, resolve, reopen, and manage support requests
- 📝 **Activity Logs** — Track important administrative actions with searchable and filterable audit records
- 👤 **Admin Management** — Manage administrator accounts, roles, status, and authorized account information
- 🔐 **Role & Permission Management** — Control administrator access using role-based and action-level permissions
- ⚙️ **Website Settings** — Manage platform, business, notification, appearance, localization, and maintenance settings
- 🔍 **Search & Filtering** — Consistent search and filtering across major administration modules
- 🪟 **Interactive Modals** — Add, view, edit, verify, assign, confirm, reply, resolve, and delete workflows
- 📱 **Responsive Design** — Optimized for desktop, laptop, tablet, and mobile devices
- ♿ **Accessible Frontend** — Semantic HTML, keyboard-friendly controls, ARIA support, focus states, and accessible interactions
- 🌗 **Light & Dark Mode** — Consistent theme experience across the administration portal

## 💰 Management Flow

```text
Booking → Payment → Escrow → Commission / Payout → Revenue → Reports → Analytics → Export
```

The operational and financial modules are connected through centralized application data so that relevant administrative changes can be reflected across related sections.

## 🔐 Role Management

### 👑 Super Admin

Full administrative access to platform management, administrator management, roles, permissions, website settings, financial administration, operational controls, activity logs, and other sensitive system operations.

### 🛠️ Admin

Controlled access to day-to-day platform operations. Admin users cannot access sensitive system-level functions such as administrator management, role configuration, permission management, platform-wide settings, or restricted financial operations.

### 💰 Financial Admin

Focused access to financial operations including payments, escrow, payouts, refunds, revenue, and financial reporting.

### 🔑 Permission System

Permissions are managed at both module and action level.

```text
VIEW:USERS
CREATE:USERS
EDIT:USERS
SUSPEND:USERS

VIEW:LABOUR
CREATE:LABOUR
EDIT:LABOUR
VERIFY:LABOUR
SUSPEND:LABOUR

VIEW:CONTRACTORS
CREATE:CONTRACTORS
EDIT:CONTRACTORS
VERIFY:CONTRACTORS

VIEW:BOOKINGS
CREATE:BOOKINGS
EDIT:BOOKINGS
CANCEL:BOOKINGS

VIEW:PAYMENTS
REFUND:PAYMENTS
MANAGE:PAYOUTS

VIEW:SUPPORT
CREATE:SUPPORT
REPLY:SUPPORT
ASSIGN:SUPPORT
RESOLVE:SUPPORT

VIEW:ACTIVITY
EXPORT:ACTIVITY

MANAGE:ADMINS
MANAGE:ROLES
MANAGE:PERMISSIONS
MANAGE:SETTINGS
```

Sensitive system-level permissions are reserved for the **Super Admin**.

## 📝 Activity & Audit System

Important administrative operations are recorded in the Activity Logs section.

The system can track actions such as:

- 🔐 Login and logout
- 👤 Administrator creation and updates
- 👑 Role changes
- 🔑 Permission changes
- 👥 User changes
- 👷 Labourer changes
- 🏢 Contractor changes
- 📅 Booking changes
- 💳 Payment operations
- 💸 Payout and refund operations
- 🎫 Support ticket operations
- 🔔 Notification operations
- ⚙️ Website setting changes
- 📊 Report exports

```text
Administrator Action
        ↓
Permission Check
        ↓
Data Update
        ↓
Activity Log
        ↓
Notification
        ↓
UI Update
```

## 🎫 Support Ticket Management

The Support Ticket module provides a complete administrative workflow for handling support requests.

```text
Open
  ↓
In Progress
  ↓
Waiting for User
  ↓
Resolved
  ↓
Closed
```

Ticket management includes:

- 🎫 Ticket creation
- 🔍 Search and filtering
- 👤 Assignment
- ⚡ Priority management
- 🔄 Status management
- 💬 Replies
- 📝 Internal notes
- ✅ Resolution
- 🔓 Reopening
- 📜 Ticket history
- 📝 Activity logging

Priority levels include **Low, Medium, High, and Urgent**.

## 🔔 Notification Management

The notification system provides centralized administrative notifications.

- 🔔 View notifications
- 🔍 Search and filter
- 👁️ Read / unread status
- ✅ Mark as read
- 📩 Mark as unread
- ✅ Mark all as read
- 🗑️ Delete notifications
- 🧹 Clear read notifications
- 🔢 Dynamic notification count
- 📋 View notification details

Important administrative operations can generate corresponding notifications.

## ⚙️ Website Settings

The Website Settings module provides centralized configuration for the platform.

### General Settings

- Platform name
- Company information
- Support email
- Support phone
- Address
- Branding

### Business Settings

- Commission configuration
- Working hours
- Currency
- Labour approval settings

### Notification Settings

- Email notifications
- Booking notifications
- Payment notifications
- Support notifications
- Administrative notifications

### Appearance

- Light mode
- Dark mode
- Theme preferences

### Maintenance

- Maintenance mode
- Maintenance message
- Platform availability

## 🎨 UI & Design

The portal follows a clean and professional administrative interface with:

- Responsive sidebar and navigation
- Modern cards and data tables
- KPI dashboards
- Interactive charts
- Consistent buttons and status indicators
- Reusable forms and management modals
- Search and filtering controls
- Light and dark appearance modes
- Responsive layouts
- Accessible frontend components
- Consistent spacing and visual hierarchy

## 🌟 Golden Luxury Theme

The interface uses a warm **Gold + Linen + Espresso** visual system instead of the typical blue or neon dashboard style.

### ☀️ Light Mode

```text
Background:      #FDFBF7
Text:            #2B231D
Gold:            #C5A059
Secondary Gold:  #8E6F3E
```

### 🌙 Dark Mode

```text
Background:      #1B1613
Text:            #EFEAE4
Gold:            #DBC193
Secondary Gold:  #725B38
```

## ♿ Accessibility

The frontend is designed with accessibility in mind.

- Semantic HTML structure
- Proper form labels
- Keyboard-friendly controls
- Visible focus states
- ARIA attributes where required
- Accessible navigation
- Keyboard-friendly modals
- Responsive touch targets
- Accessible status and notification feedback
- Reduced-motion support

## 🛠️ Technology Stack

- 🌐 **HTML5** — Semantic application structure
- 🎨 **CSS3** — Responsive layouts, themes, components, and styling
- ⚡ **Vanilla JavaScript ES6+** — Application logic, interactions, validation, and state management
- 📊 **Chart.js** — Dashboard charts and analytics
- 🎯 **Font Awesome / Material Icons** — Interface icons
- 💾 **Browser LocalStorage** — Frontend data persistence
- 🔧 **Git** — Version control
- 🐙 **GitHub** — Source code management

## 📊 Data & Functionality

The portal provides structured management for:

- Users and labourers
- Contractors
- Categories and skills
- Bookings
- Payments and escrow
- Payouts and refunds
- Revenue and analytics
- Reports and exports
- Notifications
- Support tickets
- Activity logs
- Administrators
- Roles and permissions
- Website settings

The application uses a centralized data service to keep data operations, persistence, activity logging, and notifications consistent across modules.

## 🏗️ Application Architecture

```text
┌─────────────────────────┐
│       index.html        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│         app.js          │
│   Routing / Session     │
└────────────┬────────────┘
             │
      ┌──────┼──────┐
      ▼      ▼      ▼
   Pages  Components Sidebar
      │      │      │
      └──────┼──────┘
             ▼
┌─────────────────────────┐
│      DataService        │
│ Data / State / Logs     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│     LocalStorage        │
└─────────────────────────┘
```

## 📂 Project Structure

```text
skilliant-admin/
│
├── assets/
│   ├── images/
│   └── icons/
│
├── css/
│   ├── variables.css
│   ├── reset.css
│   ├── layout.css
│   ├── components.css
│   ├── animations.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   ├── sidebar.js
│   ├── components.js
│   │
│   ├── pages/
│   │   ├── dashboard.js
│   │   ├── users.js
│   │   ├── labour.js
│   │   ├── contractors.js
│   │   ├── categories.js
│   │   ├── skills.js
│   │   ├── bookings.js
│   │   ├── payments.js
│   │   ├── reports.js
│   │   ├── notifications.js
│   │   ├── support.js
│   │   ├── activity.js
│   │   ├── settings.js
│   │   ├── admins.js
│   │   └── roles.js
│   │
│   └── services/
│       └── dataService.js
│
├── index.html
├── package.json
└── README.md
```

## 💾 Data Storage

The current frontend implementation uses **Browser LocalStorage** for persistence.

Centralized data operations handle:

```text
Create
  ↓
Read
  ↓
Update
  ↓
Delete
  ↓
Persist
  ↓
Log Activity
  ↓
Update UI
```

This architecture keeps individual modules from maintaining separate and inconsistent copies of application data.

## 🔐 Authentication & Session

The portal includes administrator authentication and session management.

The active session determines:

- Current administrator
- Current role
- Current permissions
- Authorized navigation
- Authorized actions

After successful sign-in, the administrator's role and permissions are applied immediately without requiring a manual browser refresh.

> **Security Note:** The current implementation is a frontend application using browser storage. Production deployment should use secure server-side authentication, password hashing, HTTPS, backend authorization, and persistent database storage.

## 🔎 Search & Filtering

Major management modules provide consistent search and filtering functionality.

Supported filtering includes:

- Keyword search
- Status
- Priority
- Role
- Date
- Category
- Administrator
- Action
- Entity

## 🪟 Interactive Management

Reusable modal-based workflows are available for administrative operations:

**Create · View · Edit · Delete · Verify · Assign · Reply · Resolve · Reopen · Reset Password · Permissions · Confirmation**

Destructive operations require appropriate authorization and confirmation.

## 📱 Responsive Design

The portal is optimized for:

```text
Desktop
   ↓
Laptop
   ↓
Tablet
   ↓
Mobile
```

Responsive features include:

- Mobile navigation
- Responsive tables
- Responsive cards
- Stacked forms
- Responsive filters
- Responsive modals
- Touch-friendly controls

## 🔄 Administrative State Flow

```text
User Action
    ↓
Validation
    ↓
Permission Check
    ↓
DataService
    ↓
LocalStorage
    ↓
Activity Log
    ↓
Notification
    ↓
UI Refresh
```

This ensures that important changes are reflected consistently across the administration portal.

## 🚀 Getting Started

### Prerequisites

- Modern web browser
- Visual Studio Code
- Git
- Node.js (if using the provided development script)

### Clone Repository

```bash
git clone <repository-url>
```

### Open Project

```bash
cd skilliant-admin
```

### Run Locally

The frontend can be opened directly through:

```text
index.html
```

Or, if the project contains an npm start script:

```bash
npm install
npm start
```

## 🧪 Testing Checklist

| Module | Verification |
|--------|--------------|
| 🔐 Authentication | Login, logout, session and role loading |
| 🏠 Dashboard | KPIs, charts and activity |
| 👥 Users | Search, filter, view and edit |
| 👷 Labour | Search, verification and management |
| 🏢 Contractors | Search, verification and management |
| 🗂️ Categories | Create, edit and delete |
| 🛠️ Skills | Create, edit and delete |
| 📅 Bookings | CRUD, search, filter and status |
| 💳 Payments | Payment and financial operations |
| 📊 Reports | Analytics and export |
| 🔔 Notifications | Read, unread, filter and delete |
| 🎫 Support | Assignment, priority, reply and resolution |
| 📝 Activity Logs | Search, filter and audit tracking |
| 👤 Admin Management | Administrator management |
| 🔐 Roles | Role and permission control |
| ⚙️ Settings | Platform configuration |
| 📱 Responsive UI | Desktop, tablet and mobile |
| ♿ Accessibility | Keyboard and accessible controls |

## 🐛 Bug Fixes & Reliability

The portal includes centralized handling for:

- Form validation
- Duplicate record prevention
- Permission checks
- Route authorization
- Confirmation dialogs
- Error states
- Empty states
- Toast feedback
- Activity logging
- Notification updates
- LocalStorage persistence
- Responsive layout handling

## 🔒 Security Scope

The current version is designed as a **frontend administrative prototype / project implementation**.

For a production environment, the following should be implemented on the server side:

- Secure authentication
- Password hashing
- Server-side RBAC
- API authorization
- Database persistence
- HTTPS
- Rate limiting
- Secure password recovery
- Persistent audit logs
- Secure payment integration

Client-side permissions should never be considered a replacement for server-side authorization in a production system.

## 🔮 Future Enhancements

- 🌐 Backend API integration
- 🗄️ PostgreSQL / MongoDB database
- 🔐 Server-side authentication and RBAC
- 📧 Email and OTP verification
- 🔔 Real-time notifications
- 📱 Push notifications
- 📊 Advanced analytics
- 📥 Advanced report generation
- ☁️ Cloud deployment
- 💳 Production payment gateway
- 📝 Persistent audit infrastructure

## 📌 Project Status

### 🟢 Completed

The Skilliant Admin Portal currently provides the core administrative modules required for centralized platform management:

```text
Dashboard
   │
   ├── User Management
   ├── Labour Management
   ├── Contractor Management
   ├── Categories & Skills
   ├── Booking Management
   │
   ├── Payments & Escrow
   ├── Reports & Analytics
   │
   ├── Notifications
   ├── Support Tickets
   ├── Activity Logs
   │
   ├── Administrator Management
   ├── Roles & Permissions
   └── Website Settings
```

## 📄 License

Developed for **Skilliant — Online Labour Finding Platform**.

Intended for educational, internship, demonstration, and prototype purposes.

---

<p align="center">
  <strong>🚀 Skilliant Admin Portal</strong><br>
  Manage • Monitor • Analyze • Control
</p>
