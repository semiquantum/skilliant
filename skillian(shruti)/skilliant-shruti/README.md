# 🚀 Skilliant Contractor Portal

> **Frontend Development • Contractor Management • Responsive Web
> Portal**

Skilliant is a browser-based **Contractor Portal** designed to
centralize labour management, project information, attendance, company
details, documents, notifications, reports, wallet information,
settings, and help resources in one workspace.

This build preserves the existing Skilliant portal structure and UI
while addressing the requested functional and frontend stability issues.

------------------------------------------------------------------------

## ✨ Project Highlights

  Area                  Details
  --------------------- ----------------------------------------
  🖥️ Frontend           HTML5, CSS3, Vanilla JavaScript (ES6)
  📱 Design             Responsive / mobile-friendly interface
  🎨 UI                 Skilliant blue, white & orange theme
  💾 Metadata Storage   Browser LocalStorage
  📁 Document Storage   IndexedDB
  🧩 Architecture       Frontend-only
  ⚙️ Framework          No framework required
  🗄️ Backend            No backend required for this build

------------------------------------------------------------------------

## 📌 Main Modules

### 📊 Dashboard

-   Total Labour summary
-   Active Labour count and percentage
-   Active Projects count
-   Recent Labour records
-   Inactive Projects section
-   Inactive Labour section
-   Company summary information

### 👷 Labour Management

-   Add new labour records
-   Edit existing labour records
-   Delete labour records
-   Search labour
-   Filter by status and skill
-   Labour details view
-   Attendance by worker and date
-   Form validation
-   Optional emergency-contact information

### 🏗️ Projects

-   Active projects
-   Planning projects
-   Inactive projects
-   Shared project data used for dashboard counts
-   Labour/project assignment information

### 🏢 Company

-   Company information management
-   Company details synchronized across the portal

### 📁 Documents

-   Add/upload documents
-   Document listing
-   View documents
-   Delete documents
-   Persistent browser-side document storage through IndexedDB

### 🔔 Notifications

-   Shared activity history
-   Labour activity notifications
-   Project and attendance activity
-   Company/document/profile activity
-   Header notification panel
-   Clear notification history

### ⚙️ Settings

-   Portal preferences
-   Notification preferences
-   Theme controls

### 👤 Profile

-   Profile information
-   Login/logout behavior
-   Header profile display

### 💰 Wallet & 📈 Reports

-   Wallet/payment-related portal area
-   Operational reporting area

------------------------------------------------------------------------

## 🐛 Important Bug Fixes

### 👷 Labour Records

-   Fixed stale labour data after add/edit operations.
-   Labour add, edit, delete and list views use the same stored records.
-   Dashboard and Labour views refresh from shared data.
-   Deleted labour records no longer remain as stale detail views.

### 📝 Labour Form Validation

-   Required fields are validated before submission.
-   Emergency contact fields are **optional**.
-   If an emergency contact is entered, the emergency phone number must
    contain a valid 10-digit number.
-   Validation messages are shown against the relevant fields.
-   Repeated invalid submissions are prevented from creating duplicate
    actions.

### 📁 Documents

-   Document files are stored in IndexedDB instead of storing Base64
    file data in LocalStorage.
-   Newly added documents appear immediately in the Documents table.
-   Documents remain available after browser refresh.
-   View and Delete actions operate on the selected document.

### 🔔 Notifications

-   Activity information is shared between the header notification area
    and Notifications page.
-   Labour, attendance, assignment, company, document, profile,
    login/logout and theme actions can be recorded.
-   Notification history can be cleared from the Notifications page.
-   Duplicate activity generation was reduced so one user action does
    not unnecessarily inflate the activity history.

### 🏗️ Projects

-   Project status views use shared project data.
-   Active Project statistics are calculated from the project data
    rather than a hard-coded number.
-   Active, Planning and Inactive project records remain synchronized
    with dashboard information.

### 📅 Attendance

-   Attendance is stored independently by **worker and date**.
-   Attendance information does not overwrite another worker's record
    for the same date.

### 🏢 Company & Profile

-   Company edits remain synchronized across portal views.
-   Profile information is reflected in the portal header.

------------------------------------------------------------------------

## 💾 Data & Storage

This is a **frontend-only browser application**.

### LocalStorage

Used for operational metadata such as:

-   👷 Labour records
-   🏗️ Project information
-   🏢 Company information
-   👤 Profile information
-   📅 Attendance
-   🔔 Activity/notification metadata
-   ⚙️ Portal settings
-   🎨 Theme preferences

### IndexedDB

Used for:

-   📄 Uploaded document files

Using IndexedDB for files prevents large Base64 document data from
unnecessarily filling LocalStorage.

------------------------------------------------------------------------

## 🛠️ Technologies Used

-   **HTML5** --- semantic page structure
-   **CSS3** --- responsive layout, styling, cards, tables and portal UI
-   **JavaScript ES6** --- application logic and interactions
-   **LocalStorage API** --- browser-side metadata persistence
-   **IndexedDB API** --- document-file persistence
-   **DOM APIs** --- dynamic rendering and interactions

No external framework or package installation is required.

------------------------------------------------------------------------

## ▶️ How to Run

### Option 1 --- Open Directly

1.  Extract the project ZIP.
2.  Open the `skilliant/index.html` file in a modern browser.
3.  The portal will load locally.

### Option 2 --- Run a Local Server

From the folder containing `index.html`, run:

``` bash
python -m http.server 8000
```

Then open:

``` text
http://localhost:8000/
```

> 💡 A local server is recommended when testing browser storage,
> IndexedDB and file-related functionality.

------------------------------------------------------------------------

## 📂 Project Structure

``` text
skilliant/
│
├── index.html
│
├── css/
│   └── contractor.css
│
├── js/
│   └── contractor.js
│
└── README.md
```

### 📄 `index.html`

Contains the portal pages, navigation, forms, tables, dashboard sections
and UI components.

### 🎨 `css/contractor.css`

Contains the Skilliant visual system, responsive layouts, component
styling, forms, tables, navigation and portal theme.

### ⚙️ `js/contractor.js`

Contains application logic including:

-   Navigation
-   Labour CRUD
-   Validation
-   Attendance
-   Project rendering
-   Dashboard statistics
-   Notifications
-   Documents
-   Company/profile handling
-   Settings
-   Theme handling
-   Browser storage

------------------------------------------------------------------------

## 📱 Responsive Design

The portal is designed to work across:

-   📱 Mobile screens
-   📲 Tablet screens
-   💻 Desktop screens

Responsive behavior includes:

-   Compact navigation
-   Responsive forms
-   Flexible cards
-   Contained tables
-   Mobile-friendly controls
-   Consistent spacing and alignment

------------------------------------------------------------------------

## 🎨 UI / UX

The interface follows the existing Skilliant visual direction:

-   🔵 Blue
-   ⚪ White
-   🟠 Orange/gold accents
-   🧊 Modern card-based interface
-   📐 Consistent spacing
-   🔘 Clear primary and secondary actions
-   ✨ Subtle transitions and interactions
-   ♿ Accessible labels and semantic structure

------------------------------------------------------------------------

## 🔒 Scope & Limitations

This project is a **frontend-only implementation**.

The following production-level capabilities are outside the current
scope:

-   ❌ Production backend/API integration
-   ❌ Server-side database
-   ❌ Production authentication/authorization
-   ❌ Server-side document security
-   ❌ Production-scale file storage
-   ❌ Deployment hardening
-   ❌ Full production device/browser QA

Browser LocalStorage and IndexedDB limits should be considered before
production deployment.

------------------------------------------------------------------------

## 🧪 Testing Areas

The portal has been checked across the following functional areas:

-   ✅ Navigation
-   ✅ Buttons
-   ✅ Forms
-   ✅ Form validation
-   ✅ Search
-   ✅ Filters
-   ✅ Modals
-   ✅ Dropdowns
-   ✅ Tabs
-   ✅ Toast notifications
-   ✅ Loading states
-   ✅ Empty states
-   ✅ Error states
-   ✅ Dark/theme controls
-   ✅ JavaScript interactions
-   ✅ Responsive layouts
-   ✅ Browser-side persistence

------------------------------------------------------------------------

## 👨‍💻 Development Notes

The project intentionally uses **Vanilla JavaScript** instead of a
frontend framework so that the application can run without:

-   Node.js
-   npm
-   Build tools
-   Package installation
-   Framework dependencies

This makes the project easy to extract, inspect, run and demonstrate
locally.

------------------------------------------------------------------------

## 📦 Deliverable

The final project package contains the complete frontend implementation
and supporting files required to run the Skilliant Contractor Portal
locally.

### ✅ Ready For

-   🎓 Internship demonstration
-   🧪 Frontend testing
-   💻 Local development
-   📱 Responsive UI demonstration
-   📊 Project presentation
-   🔧 Further backend integration

------------------------------------------------------------------------

## 👩‍💻 Project Information

**Project:** Skilliant --- Contractor Portal\
**Module:** Contractor Portal\
**Development Type:** Frontend Development\
**Technology:** HTML5, CSS3, Vanilla JavaScript (ES6)\
**Storage:** LocalStorage + IndexedDB

------------------------------------------------------------------------

## ⭐ Final Note

Skilliant provides a centralized contractor workspace for managing
labour, projects, attendance, documents, company information and
operational activity.

The current build focuses on **functional frontend stability, responsive
UI, shared browser-side data and reliable cross-module behavior**, while
keeping the existing portal structure intact.
