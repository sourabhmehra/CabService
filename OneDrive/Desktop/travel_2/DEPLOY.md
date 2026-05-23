# Deploying Mehra Tour and Travel — Free Stack

| Layer | Service | Cost | Notes |
|---|---|---|---|
| Frontend | **Vercel** | Free forever | Perfect for Next.js |
| Backend | **Render** | Free (750 h/mo) | Sleeps after 15 min idle |
| Database | **Neon** | Free (0.5 GB) | PostgreSQL, always-on |

> **Total cost: ₹0**

---

## Step 0 — Push code to GitHub

All three services deploy from GitHub, so do this first.

1. Create a free account at [github.com](https://github.com)
2. Create a **new private repository** called `mehra-tour-travel`
3. In your project folder run:

```cmd
cd C:\Users\mehra\OneDrive\Desktop\travel_2
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mehra-tour-travel.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 1 — Neon (Database)

1. Sign up free at [neon.tech](https://neon.tech) (use GitHub login)
2. Click **New Project** → name it `mehra-travels` → region **AWS Asia Pacific (Mumbai)** → Create
3. On the dashboard click **Connection string** → choose **psycopg2** → copy the string.
   It looks like:
   ```
   postgresql://mehra_owner:XXXX@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. **Save this string** — you'll paste it in Render next.

---

## Step 2 — Render (Backend)

1. Sign up free at [render.com](https://render.com) (use GitHub login)
2. Click **New → Web Service**
3. Connect your GitHub repo `mehra-tour-travel`
4. Fill in:

   | Field | Value |
   |---|---|
   | Name | `mehra-travels-api` |
   | Region | Singapore (closest free region to India) |
   | Branch | `main` |
   | Root Directory | `backend` |
   | Runtime | **Python 3** |
   | Build Command | `pip install -r requirements.txt` |
   | Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
   | Instance Type | **Free** |

5. Under **Environment Variables** click **Add Environment Variable**:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | *(paste the Neon connection string from Step 1)* |

6. Click **Create Web Service** and wait ~3 minutes for the build.
7. Once deployed, copy your service URL — it looks like:
   ```
   https://mehra-travels-api.onrender.com
   ```
   Test it: open `https://mehra-travels-api.onrender.com/docs` in your browser — you should see the FastAPI Swagger UI.

---

## Step 3 — Vercel (Frontend)

1. Sign up free at [vercel.com](https://vercel.com) (use GitHub login)
2. Click **New Project → Import Git Repository** → select `mehra-tour-travel`
3. Set:

   | Field | Value |
   |---|---|
   | Framework Preset | **Next.js** |
   | Root Directory | `frontend` |

4. Under **Environment Variables** add:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_API_BASE` | `https://mehra-travels-api.onrender.com` *(your Render URL)* |

5. Click **Deploy** and wait ~2 minutes.
6. Your site is live at:
   ```
   https://mehra-tour-travel.vercel.app
   ```
   (Vercel gives a free custom subdomain. You can also connect your own domain.)

---

## Step 4 — Verify everything works

1. Open your Vercel URL
2. Enter a booking: **Bhopal** → **Indore**, pick a date, click **Get Fare Quote**
3. You should see the distance (~195 km) and prices for all 3 vehicles
4. Complete a booking and check the confirmation page

---

## Custom domain (optional, free)

Vercel gives you a free `*.vercel.app` subdomain. If you own `mehratoursandtravels.in` or similar:

1. In Vercel → your project → **Settings → Domains** → Add domain
2. Add the DNS records Vercel shows (CNAME / A record) in your domain registrar
3. SSL is automatic and free (Let's Encrypt)

---

## Limitations of the free stack

| Issue | Detail |
|---|---|
| **Backend sleeps after 15 min idle** | First request after sleep takes 30–60 sec to wake up. Booking searches will feel slow if no one has visited recently. |
| **Render: 750 free hours/month** | Enough for one service running ~24/7 all month. |
| **Neon: 0.5 GB storage** | Holds thousands of bookings before you'd need to upgrade. |
| **OSRM/Nominatim rate limits** | ~1 req/sec. Fine for a small agency, but for high traffic you'd need a paid map API. |

### Fix the "slow wake-up" issue for free

Add a free uptime monitor (like [UptimeRobot](https://uptimerobot.com)) that pings your Render URL every 14 minutes. This keeps the service warm so it never sleeps.

1. Sign up free at uptimerobot.com
2. New Monitor → HTTP(s) → URL: `https://mehra-travels-api.onrender.com/` → Interval: **14 minutes**

---

## Re-deploying after code changes

```cmd
git add .
git commit -m "Your change description"
git push
```

Both Vercel and Render auto-deploy on every push to `main`.

---

## Environment summary

| Variable | Where to set | Value |
|---|---|---|
| `DATABASE_URL` | Render → Environment | Neon PostgreSQL connection string |
| `NEXT_PUBLIC_API_BASE` | Vercel → Environment | `https://mehra-travels-api.onrender.com` |
