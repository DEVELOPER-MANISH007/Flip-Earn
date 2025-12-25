# Social Media Account Marketplace

Yeh ek full-stack web application hai jo social media accounts ko buy aur sell karne ke liye marketplace provide karti hai. Isme users apne social media accounts ko list kar sakte hain aur buyers unhein purchase kar sakte hain.

## 🚀 Project Overview

Yeh project ek **Social Media Account Marketplace** hai jahan:
- Sellers apne social media accounts (YouTube, Instagram, TikTok, Facebook, etc.) ko list kar sakte hain
- Buyers different platforms ke accounts ko search, filter, aur purchase kar sakte hain
- Real-time chat system hai buyers aur sellers ke beech communication ke liye
- Admin panel hai listing verification, credential management, aur transaction handling ke liye
- Payment processing Stripe ke through hota hai
- Withdrawal system hai sellers ke liye earnings withdraw karne ke liye

## 📁 Project Structure

```
.
├── client/                          # Frontend (React + Vite)
│   ├── public/                      # Public static files
│   │   ├── favicon.ico
│   │   └── vite.svg
│   ├── src/
│   │   ├── App/                     # Redux store aur slices
│   │   │   ├── Features/
│   │   │   │   ├── chatSlice.js     # Chat state management
│   │   │   │   └── ListingSlice.js  # Listing state management
│   │   │   └── Store.js             # Redux store configuration
│   │   │
│   │   ├── components/              # Reusable components
│   │   │   ├── admin/               # Admin-specific components
│   │   │   │   ├── AdminNavbar.jsx          # Admin navigation bar
│   │   │   │   ├── AdminSidebar.jsx         # Admin sidebar navigation
│   │   │   │   ├── AdminTitle.jsx           # Admin page titles
│   │   │   │   ├── CredentialChangeModal.jsx # Credential change modal
│   │   │   │   ├── CredentialVerifyModal.jsx # Credential verification modal
│   │   │   │   ├── ListingDetailsModal.jsx   # Listing details modal
│   │   │   │   └── WithdrawalDetail.jsx      # Withdrawal details component
│   │   │   │
│   │   │   ├── ChatBox.jsx                  # Real-time chat component
│   │   │   ├── CredentialSubmission.jsx      # Credential submission form
│   │   │   ├── CTA.jsx                      # Call-to-action component
│   │   │   ├── FilterSideBar.jsx            # Marketplace filter sidebar
│   │   │   ├── Footer.jsx                   # Footer component
│   │   │   ├── Hero.jsx                     # Landing page hero section
│   │   │   ├── LatestListings.jsx           # Latest listings display
│   │   │   ├── ListingCard.jsx              # Individual listing card
│   │   │   ├── Navbar.jsx                   # Main navigation bar
│   │   │   ├── Plans.jsx                    # Pricing plans component
│   │   │   ├── StatCard.jsx                 # Statistics card component
│   │   │   ├── Title.jsx                    # Page title component
│   │   │   └── WithdrawModal.jsx            # Withdrawal modal
│   │   │
│   │   ├── pages/                    # Page components
│   │   │   ├── admin/                # Admin pages
│   │   │   │   ├── AllListings.jsx           # View all listings
│   │   │   │   ├── CredentialChange.jsx      # Credential change requests
│   │   │   │   ├── CredentialVerify.jsx      # Credential verification
│   │   │   │   ├── Dashboard.jsx             # Admin dashboard
│   │   │   │   ├── Layout.jsx                # Admin layout wrapper
│   │   │   │   ├── Transactions.jsx          # Transaction management
│   │   │   │   └── Withdrawal.jsx            # Withdrawal management
│   │   │   │
│   │   │   ├── Home.jsx                      # Landing/home page
│   │   │   ├── ListingDetails.jsx            # Listing detail page
│   │   │   ├── Loading.jsx                   # Loading page
│   │   │   ├── ManageListing.jsx             # Create/Edit listing page
│   │   │   ├── MarketPlace.jsx               # Marketplace browse page
│   │   │   ├── Messages.jsx                  # Messages/chat page
│   │   │   ├── MyListings.jsx                # User's listings page
│   │   │   └── MyOrders.jsx                  # User's orders page
│   │   │
│   │   ├── configs/                   # Configuration files
│   │   │   └── axios.js               # Axios HTTP client configuration
│   │   │
│   │   ├── assets/                    # Images aur static files
│   │   │   ├── assets.jsx             # Asset exports
│   │   │   ├── favicon.ico
│   │   │   ├── image_1.jpg
│   │   │   ├── image_2.jpg
│   │   │   ├── image_3.jpg
│   │   │   ├── image_4.jpg
│   │   │   ├── logo.svg
│   │   │   ├── schema.prisma
│   │   │   └── user_profile.png
│   │   │
│   │   ├── context/                   # React context (if any)
│   │   │
│   │   ├── App.jsx                     # Main App component with routes
│   │   ├── main.jsx                    # Application entry point
│   │   └── index.css                   # Global styles
│   │
│   ├── eslint.config.js               # ESLint configuration
│   ├── index.html                     # HTML template
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.js                 # Vite configuration
│   └── vercel.json                    # Vercel deployment config
│
└── server/                            # Backend (Node.js + Express)
    ├── config/                        # Configuration files
    │   ├── Imagekit.js                # ImageKit configuration
    │   ├── Multer.js                  # File upload configuration
    │   ├── Nodemailer.js              # Email service configuration
    │   └── prisma.js                  # Prisma client configuration
    │
    ├── controllers/                   # Business logic controllers
    │   ├── Admincontroler.js          # Admin operations controller
    │   ├── ChatController.js          # Chat operations controller
    │   ├── ListingControllers.js      # Listing operations controller
    │   └── stripeWebhooks.js          # Stripe webhook handler
    │
    ├── routes/                        # API routes
    │   ├── adminRoutes.js             # Admin API routes
    │   ├── ChatRoutes.js              # Chat API routes
    │   └── ListingRoutes.js           # Listing API routes
    │
    ├── middlewares/                   # Express middlewares
    │   └── authMiddleware.js          # Authentication middleware
    │
    ├── Models/                        # Data models
    │   └── Auth.js                    # Authentication model
    │
    ├── Inngest/                       # Background job processing
    │   └── index.js                   # Inngest functions configuration
    │
    ├── prisma/                        # Database schema
    │   └── schema.prisma              # Prisma database schema
    │
    ├── package.json                   # Backend dependencies
    ├── prisma.config.ts               # Prisma configuration
    ├── server.js                      # Express server entry point
    └── vercel.json                    # Vercel deployment config
```

## 🛠️ Technologies Used

### Frontend Technologies

- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool aur development server
- **Redux Toolkit 2.10.1** - State management
- **React Router DOM 7.9.6** - Client-side routing
- **Clerk 5.56.2** - Authentication aur user management
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **Axios 1.13.2** - HTTP client for API calls
- **React Hot Toast 2.6.0** - Toast notifications
- **Lucide React 0.554.0** - Icon library
- **Date-fns 4.1.0** - Date formatting utilities

### Backend Technologies

- **Node.js** - Runtime environment
- **Express.js 5.2.1** - Web framework
- **Prisma 7.0.1** - ORM (Object-Relational Mapping)
- **PostgreSQL** - Database (via Neon Serverless)
- **Clerk Express 1.7.53** - Backend authentication
- **Stripe 20.1.0** - Payment processing
- **ImageKit 6.0.0** - Image storage aur CDN
- **Cloudinary 2.8.0** - Alternative image storage
- **Nodemailer 7.0.12** - Email sending (Brevo/Sendinblue SMTP)
- **Inngest 3.46.0** - Background job processing
- **WebSocket (ws 8.18.3)** - Real-time chat functionality
- **Multer 2.0.2** - File upload handling
- **Bcrypt 6.0.0** - Password hashing
- **JSON Web Token 9.0.2** - Token-based authentication
- **CORS 2.8.5** - Cross-origin resource sharing

### Database Schema

**Models:**
- **User** - User information, earnings, withdrawals
- **Listing** - Social media account listings with details
- **Chat** - Chat conversations between users
- **Message** - Individual chat messages
- **PlatformMessage** - System/platform messages
- **Transaction** - Payment transactions
- **Withdrawal** - Withdrawal requests
- **Credential** - Account credentials (original aur updated)

**Enums:**
- **Platform**: YouTube, Instagram, TikTok, Facebook, Twitter, LinkedIn, Pinterest, Snapchat, Twitch, Discord
- **Niche**: Lifestyle, Fitness, Food, Travel, Tech, Gaming, Fashion, Beauty, Business, Education, Entertainment, Music, Art, Sports, Health, Finance, Other
- **Status**: Active, Ban, Sold, Deleted, Inactive

## ✨ Features

### User Features
- ✅ User authentication (Clerk integration)
- ✅ Create aur manage listings
- ✅ Browse marketplace with filters
- ✅ Search listings by platform, niche, price range
- ✅ View detailed listing information
- ✅ Real-time chat with sellers/buyers
- ✅ Order management
- ✅ Earnings tracking
- ✅ Withdrawal requests

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ Listing management (approve, ban, delete)
- ✅ Credential verification system
- ✅ Credential change approval
- ✅ Transaction monitoring
- ✅ Withdrawal approval system

### Technical Features
- ✅ Real-time chat using WebSocket
- ✅ Payment processing via Stripe
- ✅ Email notifications via Nodemailer
- ✅ Image upload aur storage via ImageKit
- ✅ Background job processing via Inngest
- ✅ Responsive design with Tailwind CSS
- ✅ State management with Redux Toolkit

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 ya higher)
- npm ya yarn
- PostgreSQL database (Neon Serverless recommended)
- Clerk account (for authentication)
- Stripe account (for payments)
- ImageKit account (for image storage)
- Brevo/Sendinblue account (for emails)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "New folder"
```

2. **Install Client Dependencies**
```bash
cd client
npm install
```

3. **Install Server Dependencies**
```bash
cd ../server
npm install
```

4. **Setup Environment Variables**

**Client (.env)**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=your_api_url
```

**Server (.env)**
```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Clerk
CLERK_SECRET_KEY=your_clerk_secret_key

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email (Brevo/Sendinblue)
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SENDER_EMAIL=your_sender_email

# Server
PORT=5000

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

5. **Setup Database**
```bash
cd server
npx prisma generate
npx prisma migrate dev
```

6. **Run the Application**

**Start Server:**
```bash
cd server
npm run server  # Development mode with nodemon
# ya
npm start      # Production mode
```

**Start Client:**
```bash
cd client
npm run dev    # Development server
# ya
npm run build  # Production build
npm run preview # Preview production build
```

## 📝 Available Scripts

### Client Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server Scripts
- `npm run server` - Start development server with nodemon
- `npm start` - Start production server
- `npm run postinstall` - Generate Prisma client

## 🗂️ API Routes

### Listing Routes (`/api/listing`)
- GET `/` - Get all public listings
- GET `/user` - Get user's listings
- GET `/:id` - Get listing details
- POST `/` - Create new listing
- PUT `/:id` - Update listing
- DELETE `/:id` - Delete listing

### Chat Routes (`/api/chat`)
- GET `/` - Get user's chats
- GET `/:chatId` - Get chat messages
- POST `/` - Create new chat
- POST `/:chatId/message` - Send message
- WebSocket connection for real-time messaging

### Admin Routes (`/api/admin`)
- GET `/dashboard` - Admin dashboard stats
- GET `/listings` - All listings
- GET `/transactions` - All transactions
- GET `/withdrawals` - All withdrawal requests
- PUT `/verify-credentials/:listingId` - Verify credentials
- PUT `/change-credentials/:listingId` - Approve credential change
- PUT `/withdrawal/:id` - Approve withdrawal

### Stripe Webhooks (`/api/stripe`)
- POST `/` - Handle Stripe webhook events

## 🎨 Pages & Components

### Pages
- **Home** - Landing page with featured listings
- **Marketplace** - Browse all listings with filters
- **My Listings** - User's own listings
- **Listing Details** - Detailed view of a listing
- **Manage Listing** - Create/Edit listing form
- **Messages** - Chat interface
- **My Orders** - User's purchase history
- **Admin Dashboard** - Admin overview
- **Admin Credential Verify** - Verify seller credentials
- **Admin Credential Change** - Approve credential changes
- **Admin Transactions** - View all transactions
- **Admin Withdrawals** - Manage withdrawal requests

### Key Components
- **Navbar** - Navigation bar
- **Hero** - Landing page hero section
- **ListingCard** - Listing card component
- **FilterSideBar** - Marketplace filters
- **ChatBox** - Real-time chat component
- **WithdrawModal** - Withdrawal request modal
- **CredentialSubmission** - Credential submission form
- **AdminSidebar** - Admin navigation sidebar

## 🔐 Authentication

Project mein **Clerk** use kiya gaya hai authentication ke liye:
- User sign up/sign in
- Protected routes
- User profile management
- JWT-based authentication

## 💳 Payment Integration

**Stripe** integration hai payment processing ke liye:
- Payment processing
- Webhook handling
- Transaction management
- Secure payment flow

## 📧 Email Service

**Nodemailer** with **Brevo (Sendinblue)** SMTP:
- Email notifications
- Transaction confirmations
- Credential verification emails
- Withdrawal notifications

## 🖼️ Image Storage

**ImageKit** use kiya gaya hai image storage aur CDN ke liye:
- Image upload
- Image optimization
- CDN delivery
- Cloudinary bhi available hai as alternative

## 🔄 Background Jobs

**Inngest** use kiya gaya hai background job processing ke liye:
- Async task processing
- Scheduled jobs
- Event-driven workflows

## 🌐 Deployment

Project **Vercel** ke liye configured hai:
- `vercel.json` files available hain client aur server dono mein
- Serverless function support
- Environment variables setup required

## 📦 Dependencies Summary

### Frontend Dependencies
- React ecosystem (React, React DOM, React Router)
- State management (Redux Toolkit, React Redux)
- UI (Tailwind CSS, Lucide React)
- Utilities (Axios, Date-fns, React Hot Toast)
- Authentication (Clerk React)

### Backend Dependencies
- Web framework (Express)
- Database (Prisma, Neon Serverless)
- Authentication (Clerk Express)
- Payments (Stripe)
- File handling (Multer)
- Real-time (WebSocket)
- Email (Nodemailer)
- Image storage (ImageKit, Cloudinary)
- Background jobs (Inngest)
- Security (Bcrypt, JWT, CORS)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

ISC License

## 👨‍💻 Author

Project created with Dev.Manish❤️

---

**Note:** Is project ko run karne se pehle ensure karein ki saare environment variables properly set kiye gaye hain aur database connection working hai.

