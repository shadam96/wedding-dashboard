# Wedding Dashboard

A wedding planning dashboard for managing guests, tasks, budget, venues, and transportation. Built with Next.js and designed for Hebrew RTL — fully open-source and free to self-host.

## Features

- Guest list management with RSVP tracking, +1s, and children
- Task board with owner assignment and priority levels
- Budget tracker with category breakdown
- Venue comparison with availability dates
- Transportation / bus coordination
- Dark mode support
- Mobile-friendly responsive design

## Deploy Your Own (5 minutes)

### 1. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshadam96%2Fwedding-dashboard&env=APP_PASSWORD,NEXT_PUBLIC_GROOM_NAME,NEXT_PUBLIC_BRIDE_NAME&envDescription=Set%20your%20dashboard%20password%20and%20couple%20names&envLink=https%3A%2F%2Fgithub.com%2Fshadam96%2Fwedding-dashboard%23environment-variables)

### 2. Add a Database

After deploying, add the **[Neon Postgres integration](https://vercel.com/integrations/neon)** to your Vercel project. This automatically creates a free database and sets `DATABASE_URL` for you.

### 3. Redeploy

After adding Neon, trigger a redeploy from the Vercel dashboard (Deployments > ... > Redeploy). The database tables are created automatically on the first request.

That's it! Your dashboard is live.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon Postgres connection string (auto-set by Neon integration) |
| `APP_PASSWORD` | Yes | Password to access the dashboard |
| `NEXT_PUBLIC_GROOM_NAME` | No | Groom's name (default: שם החתן) |
| `NEXT_PUBLIC_BRIDE_NAME` | No | Bride's name (default: שם הכלה) |
| `AUTH_TOKEN` | No | Custom auth token (auto-derived from password if not set) |

## Local Development

```bash
# Clone the repository
git clone https://github.com/shadam96/wedding-dashboard.git
cd wedding-dashboard

# Install dependencies
npm install

# Copy env file and fill in your values
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL and APP_PASSWORD

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Tables are created automatically on first request.

### Seed Sample Data

```bash
npx tsx scripts/seed.ts
```

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Neon Postgres](https://neon.tech/) (serverless driver)
- [Heroicons](https://heroicons.com/)

## License

MIT
