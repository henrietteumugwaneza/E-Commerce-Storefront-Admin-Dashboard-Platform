# Admin Dashboard Platform - E-Commerce Management System

A modern, full-featured e-commerce admin dashboard built with React, TypeScript, and Vite. This platform provides comprehensive tools for managing products, orders, categories, and users with role-based access control.

## 🚀 Features

- **Role-Based Authentication**: Separate interfaces for Admin and User roles
- **Product Management**: Full CRUD operations for products with image support
- **Order Management**: Track and update order statuses (Pending, Processing, Shipped, Delivered, Cancelled)
- **Category Management**: Organize products into categories
- **User Management**: Admin can view and manage user accounts
- **Shopping Cart**: Full cart functionality with checkout process
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Form Validation**: Zod schema validation with React Hook Form

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript 6
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API + React Query
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Build Tool**: Vite 8
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## 🔧 Local Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Admin Dashboard Platform/ecommerce-platform"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

**Note:** The application connects to a live backend API at `https://e-commas-apis-production.up.railway.app`

## 🔑 Admin Mock Login Credentials

**For grading purposes, use these credentials to access the Admin Dashboard:**

```
Email: admin@admin.com
Password: admin123
```

**Note:** The admin account exists in the backend database with ADMIN role. The JWT token contains the real role which the app reads automatically.

### Additional Test Accounts

You can register any new account which will have USER role by default.

## 📁 Project Structure

```
ecommerce-platform/
├── src/
│   ├── api/              # API configuration and mock data
│   ├── components/       # Reusable UI components
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── public/       # Public pages (Login, Register)
│   │   └── user/         # User-facing pages
│   ├── routes/           # Route configuration
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── package.json
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication Flow

1. Users can register a new account or login with existing credentials
2. Admin users are redirected to `/admin/dashboard`
3. Regular users are redirected to `/shop`
4. Protected routes ensure proper access control
5. JWT tokens are stored in localStorage for session management

## 📊 Admin Dashboard Features

- **Dashboard Overview**: Key metrics and statistics
- **Product Management**: Add, edit, delete products with image uploads
- **Order Management**: View all orders, update order status
- **Category Management**: Create and manage product categories
- **User Management**: View registered users and their roles

## 🛒 User Features

- Browse products by category
- Search and filter products
- Add items to cart
- Checkout with multiple payment options (Credit Card, Mobile Money, PayPal, Cash on Delivery)
- View order history
- Update profile information

## 🎨 UI Components

- Responsive navigation bar
- Product cards with image galleries
- Data tables with sorting and filtering
- Modal dialogs for forms
- Toast notifications for user feedback
- Loading states and error handling

## 🔄 State Management

- **AuthContext**: Manages authentication state and user sessions
- **React Query**: Handles server state, caching, and data synchronization
- **Custom Hooks**: useAuth, useCart, useProducts for business logic

## 🌐 API Integration

The application connects to a live backend API:
- **Backend URL**: `https://e-commas-apis-production.up.railway.app`
- **Authentication**: JWT tokens stored in localStorage
- **Automatic token injection**: Axios interceptors handle authentication headers
- **Error handling**: Centralized error messages via interceptors

## 📝 Environment Variables

The app is configured to use the Railway backend. To change the API endpoint, update `baseURL` in `src/api/axios.ts`:

```typescript
export const api = axios.create({
  baseURL: "https://your-api-url.com/api",
});
```

## 🚧 Future Enhancements

- Real backend API integration
- Advanced analytics and reporting
- Email notifications
- Product reviews and ratings
- Inventory management
- Multi-language support
- Dark mode theme

## 📄 License

This project is created for educational purposes.

## 👥 Support

For any questions or issues, please contact the development team.

---

**Note**: This application uses a real backend API hosted on Railway. All data is persisted on the server.
