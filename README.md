# Next.js Blog CMS

> **Note:** This project is currently on hold. The backend is mostly complete, and the frontend will be finalized soon.

A modern, full-featured blog content management system built with Next.js 15, TypeScript, MongoDB, and NextAuth.js. Features a complete admin panel for managing blogs, categories, and users with role-based permissions.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15 with Turbopack, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with GitHub OAuth and credentials
- **Content Management**: Full CRUD operations for blogs and categories
- **Image Upload**: Cloudinary integration for image hosting
- **Responsive Design**: Mobile-first responsive design
- **SEO Optimized**: Meta tags, structured data (Schema.org)
- **User Management**: Admin panel for user management
- **Rich Text Editor**: Markdown support for blog content

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: NextAuth.js (GitHub OAuth + Credentials)
- **Image Storage**: Cloudinary
- **Styling**: Tailwind CSS with custom components
- **Icons**: React Icons
- **Notifications**: React Toastify

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB database (local or cloud)
- Cloudinary account (for image uploads)
- GitHub OAuth app (for authentication)

## 🚀 Quick Start

### 1. Fork & Clone the Repository

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/nextblog.git
cd nextblog
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory and add the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/nextblog
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nextblog

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-min-32-chars

# GitHub OAuth (Create at: https://github.com/settings/applications/new)
NEXTAUTH_GITHUB_ID=your-github-client-id
NEXTAUTH_GITHUB_SECRET=your-github-client-secret

# Cloudinary (Sign up at: https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Google Gemini AI API Key
GEMINI_API_KEY=gemini_api_key

# Use a powerful password
OWNER_PASSWORD=random123
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/nextblog`

#### Option B: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and replace in `.env.local`

### 5. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Create a new OAuth App with:
   - **Application name**: Your Blog Name
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copy Client ID and Client Secret to `.env.local`

### 6. Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Go to your dashboard
3. Copy Cloud Name, API Key, and API Secret to `.env.local`

### 7. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

### Database Models

- **User**: Authentication, roles, permissions
- **Blog**: Title, content, author, category, visibility
- **Category**: Name, slug, description

### API Routes

- `/api/auth/*` - NextAuth authentication
- `/api/blog` - Blog CRUD operations
- `/api/categories` - Category management
- `/api/users` - User management

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Update `NEXTAUTH_URL` to your production domain

## 🛡️ Security Features

- Environment variable validation
- Role-based access control
- Rate limiting (configurable)
- Input validation and sanitization
- Secure password hashing with bcrypt
- JWT token management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Emirhan Güngör**

**Happy Blogging! 🎉**

For questions or support, please open an issue on GitHub.
