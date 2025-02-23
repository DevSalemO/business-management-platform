# Business Management Platform

A modern, responsive web application for managing business operations, including product management, order tracking, and sales analytics.

## Sprints Graduation Project - Team One

### 💻 Members and tasks
- Salem: Sales & Order Tracking + Overall Fixes
- Nouf: Layout and Styling
- Maryam: Product Inv Module
- Tiba: Dashboard & Charts
- Mehaina: Dashboard
- Kefah: User Management Module

_Other related tasks and cleanup were shared amongst members for simplicity_

## 🌟 Application Features

### 📼 Video Demo of the Application

```
https://www.youtube.com/watch?v=36puDqm--os
```

### 📊 Dashboard
- Real-time sales overview with interactive charts
- Category distribution analysis
- Sales channel performance metrics
- Key business metrics at a glance

### 📦 Product Management
- Add, edit, and delete products
- Product categorization
- Inventory tracking
- Product performance analytics

### 🛍️ Order Management
- Create and process orders
- Order status tracking
- Order history
- Customer information management

### 👥 User Management
- Secure authentication system
- User roles and permissions
- Profile management
- Account settings

### 🎨 Modern UI/UX
- Responsive design for all devices
- Collapsible sidebar navigation
- Dark/light mode support
- Interactive charts and visualizations

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DevSalemO/business-management-platform.git
cd business-management-platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Built With

- **Frontend Framework**: React.js
- **Styling**: Tailwind CSS
- **Charts**: Chart.js / React Chart.js 2
- **Form Handling**: Formik with Yup validation
- **State Management**: React Context API
- **Authentication**: JWT with local storage
- **Icons**: Heroicons

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── dashboard/      # Dashboard-specific components
│   ├── Layout.jsx      # Main layout component
│   └── Sidebar.jsx     # Navigation sidebar
├── context/            # React Context providers
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   ├── Dashboard.jsx   # Main dashboard
│   └── ...            # Other pages
└── utils/             # Utility functions
```

