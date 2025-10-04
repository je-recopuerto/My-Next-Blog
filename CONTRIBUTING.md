# Contributing to NextBlog

Thank you for your interest in contributing to NextBlog! 

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Git

### Local Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/next-blog.git
   cd next-blog
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env.local`:
   ```env
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_GITHUB_ID=your_github_id
   NEXTAUTH_GITHUB_SECRET=your_github_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   GEMINI_API_KEY=your_gemini_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🤝 How to Contribute

### Contribution Process

1. **Create an Issue** (for bugs or features)
2. **Fork the Repository**
3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make Your Changes**
5. **Commit Your Changes**
   ```bash
   git commit -m "feat: add new feature"
   ```
6. **Push and Create Pull Request**

## 📋 Guidelines

### Code Style
- Use TypeScript
- Follow ESLint configuration
- Use meaningful names
- Add comments for complex logic

### Commit Messages
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation
- `style:` formatting
- `refactor:` code refactoring

### File Structure
```
src/
├── app/                  # Next.js App Router
│   ├── api/             # API routes
│   ├── components/      # Reusable components
│   ├── admin/           # Admin dashboard
│   └── blog/            # Blog pages
└── lib/                 # Utilities
```

## 🐛 Bug Reports

Include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## ✨ Feature Requests

Provide:
- Description of the feature
- Use case and benefits
- Implementation ideas

## 📞 Getting Help

- Open an issue for questions
- Check existing issues first
- Be respectful and patient

---

Thank you for contributing! 🚀