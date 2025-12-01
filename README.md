# User Dashboard Application

A full-stack user dashboard application built with Next.js, MongoDB, and Cloudinary. This application provides a complete authentication system, user profile management, and image upload capabilities.

## 🚀 Features

### Authentication
- **User Registration**: Create new accounts with username, email, and password
- **User Login**: Secure login with username/email and password
- **JWT Authentication**: Token-based authentication with HTTP-only cookies
- **Session Management**: Automatic session validation and refresh
- **Logout**: Secure logout functionality

### User Profile Management
- **Profile View**: View complete user profile information
- **Profile Editing**: Update name, email, phone, bio, position, and department
- **Password Management**: Change password with current password verification
- **Avatar Upload**: Upload and update profile avatar images (max 5MB)
- **Banner Upload**: Upload and update profile banner images (max 10MB)

### UI/UX Features
- **Modern Design**: Beautiful, responsive UI with dark theme
- **Toast Notifications**: Real-time success and error notifications
- **Loading States**: Visual feedback during API operations
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image upload and management

## 📁 Project Structure

```
user-dashboard/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── logout/
│   │   │   │   └── me/
│   │   │   └── user/         # User management endpoints
│   │   │       ├── profile/
│   │   │       ├── password/
│   │   │       ├── avatar/
│   │   │       └── banner/
│   │   ├── dashboard/        # Dashboard page
│   │   ├── page.tsx          # Home/Login page
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── auth/             # Authentication components
│   │   │   └── authForm.tsx
│   │   └── ui/               # Reusable UI components
│   │       ├── avatar.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── textarea.tsx
│   │       └── toast.tsx
│   ├── lib/                  # Utility libraries
│   │   ├── auth.ts           # JWT authentication utilities
│   │   ├── mongodb.ts        # MongoDB connection
│   │   ├── cloudinary.ts     # Cloudinary configuration
│   │   ├── axios.ts          # Axios configuration
│   │   └── utils.ts          # General utilities
│   └── models/               # Database models
│       └── User.ts           # User model
├── public/                   # Static assets
├── tests/                    # Test files
├── package.json
├── tsconfig.json
└── next.config.ts
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/pnpm/yarn
- **MongoDB** database (local or MongoDB Atlas)
- **Cloudinary** account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd user-dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/user-dashboard
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database-name

   # JWT Secret (use a strong random string in production)
   JWT_SECRET=your-super-secret-jwt-key-change-in-production

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "name": "johndoe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "johndoe", // username or email
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "bio": "Bio text",
    "position": "Developer",
    "department": "Engineering",
    "avatar": "https://cloudinary.com/avatar.jpg"
  }
}
```

#### Check Authentication Status
```http
GET /api/auth/me
```

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    ...
  }
}
```

#### Logout
```http
POST /api/auth/logout
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

### User Endpoints

#### Get User Profile
```http
GET /api/user/profile
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "bio": "Bio text",
    "position": "Developer",
    "department": "Engineering",
    "avatar": "https://cloudinary.com/avatar.jpg",
    "banner": "https://cloudinary.com/banner.jpg"
  }
}
```

#### Update User Profile
```http
PUT /api/user/profile
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "bio": "Updated bio",
  "position": "Senior Developer",
  "department": "Engineering"
}
```

#### Update Password
```http
PUT /api/user/password
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

#### Upload Avatar
```http
PUT /api/user/avatar
Content-Type: multipart/form-data

Form Data:
  avatar: [image file] (max 5MB)
```

**Response:**
```json
{
  "message": "Avatar updated successfully",
  "avatar": "https://cloudinary.com/avatar.jpg"
}
```

#### Upload Banner
```http
PUT /api/user/banner
Content-Type: multipart/form-data

Form Data:
  banner: [image file] (max 10MB)
```

**Response:**
```json
{
  "message": "Banner updated successfully",
  "banner": "https://cloudinary.com/banner.jpg"
}
```

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 10
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Tokens stored in HTTP-only cookies to prevent XSS attacks
- **Input Validation**: Server-side validation for all inputs
- **File Type Validation**: Image uploads validated for type and size
- **Authentication Middleware**: Protected routes require valid JWT tokens

## 🧪 Testing

The project includes a comprehensive test suite using Jest and React Testing Library.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Test Structure

- **Unit Tests** (`tests/lib/`): Test individual functions and utilities
  - Authentication utilities (token generation, verification)
  - General utilities (class name merging, etc.)

- **API Tests** (`tests/api/`): Test API endpoints and routes
  - Authentication endpoints (login, register, logout, me)
  - User endpoints (profile, password, avatar, banner)

- **Component Tests** (`tests/components/`): Test React components
  - UI components (Button, Toast, etc.)
  - Authentication forms
  - Dashboard components

### Test Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Writing Tests

See `tests/README.md` for detailed testing guidelines, examples, and best practices.

### Example Test

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

## 🏗️ Building for Production

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Start the production server**
   ```bash
   pnpm start
   ```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

## 🎨 Customization

### Styling
The application uses Tailwind CSS. Customize styles in:
- `src/app/globals.css` - Global styles
- Component files - Component-specific styles

### Components
All UI components are in `src/components/ui/` and can be customized as needed.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (if using local instance)
- Verify `MONGODB_URI` is correct
- Check network connectivity for MongoDB Atlas

### Cloudinary Upload Issues
- Verify Cloudinary credentials are correct
- Check file size limits (5MB for avatar, 10MB for banner)
- Ensure image file types are supported

### Authentication Issues
- Clear browser cookies
- Verify `JWT_SECRET` is set
- Check token expiration (default: 7 days)
