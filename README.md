# Speed News 24

Speed News 24 is a production-oriented AI-powered news portal built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB Atlas, JWT authentication, automated news aggregation, AI metadata generation, admin management, SEO support, monetization slots, newsletter storage, and Firebase push notification hooks.

## Features

- Premium red, black, and white news-channel UI
- Hindi and English language switch
- Dark mode
- Breaking news ticker and hero slider-ready layout
- Trending, latest, category, featured, video, ad, and newsletter sections
- SEO article pages with Open Graph, Twitter Card, canonical URL, and JSON-LD
- Search, category filters, and infinite loading
- JWT access tokens, refresh tokens, bcrypt password hashing
- Roles: admin, editor, user
- Email verification and password reset token flows
- Comments, replies, likes, and moderation status
- Admin dashboard with analytics and Recharts
- CRUD foundations for news, categories, advertisements, comments, and notifications
- NewsAPI, GNews, and RSS feed ingestion every 15 minutes with `node-cron`
- AI summary, headline, tags, SEO description, keywords, and image fallback integration
- AdSense-ready slots for header, sidebar, between articles, and footer
- Sitemap and robots endpoints
- Vercel frontend config and Render backend config

## Project Structure

```txt
speed-news-24/
  frontend/
    src/
      components/
      contexts/
      hooks/
      layouts/
      pages/
      services/
      utils/
  backend/
    src/
      config/
      controllers/
      cron/
      middlewares/
      models/
      routes/
      services/
      utils/
  render.yaml
  vercel.json
  .env.example
```

## Requirements

- Node.js 20+
- MongoDB Atlas database
- API keys as needed for OpenAI, NewsAPI, GNews, Unsplash, Pexels, Firebase, and SMTP

## Installation

```bash
npm install
npm run install:all
```

Create environment files:

```bash
cp .env.example backend/.env
cp .env.example frontend/.env
```

Edit the values in both files. The frontend uses `VITE_*` variables. The backend uses server-side variables such as `MONGODB_URI`, `JWT_ACCESS_SECRET`, and API keys.

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

Seed an admin account:

```bash
ADMIN_EMAIL=admin@speednews24.com ADMIN_PASSWORD=StrongPassword123 npm run seed:admin
```

Important backend variables:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/speed-news-24
JWT_ACCESS_SECRET=replace-with-strong-access-secret
JWT_REFRESH_SECRET=replace-with-strong-refresh-secret
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=
NEWS_API_KEY=
GNEWS_API_KEY=
UNSPLASH_ACCESS_KEY=
PEXELS_API_KEY=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SITE_URL=http://localhost:5173
VITE_FCM_VAPID_KEY=
```

## API Routes

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/verify-email`
- `POST /api/auth/password-reset/request`
- `POST /api/auth/password-reset/confirm`

Articles:

- `GET /api/articles`
- `GET /api/articles/:slug`
- `GET /api/articles/article/:slug`
- `POST /api/articles`
- `PATCH /api/articles/:id`
- `DELETE /api/articles/:id`

Categories:

- `GET /api/categories`
- `POST /api/categories`
- `PATCH /api/categories/:id`

Comments:

- `GET /api/comments?article=:articleId`
- `POST /api/comments`
- `POST /api/comments/:id/like`
- `PATCH /api/comments/:id/moderate`

Subscribers:

- `POST /api/subscribers`
- `POST /api/subscribers/subscribe`

Admin:

- `GET /api/admin/analytics`
- `POST /api/admin/aggregate-news`
- `GET /api/admin/ads`
- `POST /api/admin/ads`
- `PATCH /api/admin/ads/:id`

SEO:

- `GET /api/seo/sitemap.xml`
- `GET /api/seo/robots.txt`

Notifications:

- `POST /api/notifications`

## Automated News Engine

The backend starts a cron job on server boot:

```txt
*/15 * * * *
```

It fetches NewsAPI, GNews, and RSS feeds, then deduplicates by source URL. Each saved article is enriched with AI metadata and assigned a source image. If no source image exists, it tries Unsplash, then Pexels, then OpenAI image generation, then a final default editorial image.

You can run aggregation manually from the admin dashboard or via:

```bash
POST /api/admin/aggregate-news
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas project and cluster.
2. Create a database user with read/write access.
3. Add your deployment IP addresses or allow `0.0.0.0/0` only when your hosting provider requires it.
4. Copy the connection string into `MONGODB_URI`.

## OpenAI Setup

1. Create an OpenAI API key.
2. Set `OPENAI_API_KEY` in the backend environment.
3. The AI service enriches articles with summaries, optimized headlines, tags, SEO descriptions, and SEO keywords.

## NewsAPI and GNews Setup

1. Create API keys at NewsAPI and GNews.
2. Set `NEWS_API_KEY` and `GNEWS_API_KEY`.
3. The cron job imports Indian top headlines and combines them with RSS feeds.

## Firebase Push Setup

1. Create a Firebase project.
2. Generate a service account key.
3. Set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.
4. Set `VITE_FCM_VAPID_KEY` on the frontend.
5. Use `/api/notifications` to send topic-based breaking news alerts.

## Deployment

### Frontend on Vercel

1. Import the repository in Vercel.
2. Use the included `vercel.json`.
3. Set `VITE_API_URL` to the deployed backend API URL.
4. Deploy.

### Backend on Render

1. Create a Render Blueprint from `render.yaml`, or create a Web Service manually.
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Set all backend environment variables.

## Production Checklist

- Use strong JWT secrets.
- Restrict MongoDB Atlas network access.
- Configure SMTP before enabling user-facing email workflows.
- Configure Firebase service account secrets as protected environment variables.
- Add real AdSense script/code through the admin ads manager.
- Review RSS source terms before commercial deployment.
- Configure custom domain and update `CLIENT_URL`, `API_BASE_URL`, and `VITE_SITE_URL`.
- Run Lighthouse and tune image sizes, caching, and CDN behavior for 90+ scores.

## Troubleshooting

- `MONGODB_URI is required`: set `backend/.env`.
- Login works but admin redirects home: seed an admin account or update user role in MongoDB.
- News import returns zero articles: add NewsAPI/GNews keys or confirm RSS network access from your host.
- AI fields are empty: set `OPENAI_API_KEY`.
- Push notifications skip sending: configure Firebase service account variables.
- CORS errors: set `CLIENT_URL` to the exact frontend URL.
