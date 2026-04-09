# BTP Document Approval Engine Frontend

## What the Solution Does

This is a React-based frontend application for the SAP BTP Document Approval Engine. It provides a user-friendly dashboard for managing document approval workflows in an enterprise environment. Key features include:

- **Document Creation**: Users can create new documents with supplier details, amounts, dates, and descriptions.
- **Approval Workflow Management**: Documents can be submitted for approval, with automatic level determination based on amount thresholds.
- **Status Tracking**: Real-time status updates for documents (Draft, Submitted, Auto Approved, Pending, Approved, Rejected).
- **Document Details View**: Detailed view of document information including approval levels and current steps.
- **API Integration**: Connects to a backend API for document persistence and workflow initiation.

The application supports multi-level approval processes and integrates with SAP Workflow Management for automated approval routing.

## How to Run It

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Backend API server running (default: http://localhost:3000 or https://btp-document-approval-engine.up.railway.app)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd BTP-Document-Approval-Engine-Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Additional Scripts

- `npm run lint`: Run ESLint for code quality checks
- `npm run format`: Format code with Prettier
- `npm run typecheck`: Run TypeScript type checking

## Tech Stack

- **Frontend Framework**: React 19.2.4 with TypeScript
- **Build Tool**: Vite 7.3.1
- **Styling**: Tailwind CSS 4.2.1 with ShadCN UI components
- **Icons**: Lucide React 1.8.0
- **UI Components**: Radix UI primitives via ShadCN
- **State Management**: React hooks (useState, useEffect)
- **HTTP Client**: Native fetch API
- **Development Tools**:
  - ESLint 9.39.4 for linting
  - Prettier 3.8.1 for code formatting
  - TypeScript 5.9.3 for type checking

The application is designed to work with SAP BTP services and integrates with backend APIs for document management and workflow processing.