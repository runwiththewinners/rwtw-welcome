# RWTW Welcome Page — Whop App

A dynamic welcome page for **Run With The Winners** that shows personalized subscription status for each tier when embedded inside Whop.

## How It Works

1. Page loads inside Whop as an embedded iframe (Web App experience)
2. Whop passes a JWT token via headers identifying the logged-in user
3. The app verifies the token and checks the user's access to each product via Whop API
4. Each tier shows either a **✅ SUBSCRIBED** badge or an **Upgrade** button

## Products

| Tier | Product ID |
|------|-----------|
| FREE | `prod_OVVaWf1nemJrp` |
| Max Bet POTD | `prod_12U89lKiPpVxP` |
| Premium | `prod_o1jjamUG8rP8W` |
| Player Props | `prod_RYRii4L26sK9m` |
| High Rollers | `prod_bNsUIqwSfzLzU` |

## Deploy to Vercel (Free)

### Step 1: Push to GitHub
1. Create a new repo on GitHub (e.g. `rwtw-welcome`)
2. Push this code to it:
```bash
cd rwtw-welcome
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rwtw-welcome.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"Import Project"** → select your `rwtw-welcome` repo
3. In the **Environment Variables** section, add:
   - `WHOP_API_KEY` = your Whop API key
   - `NEXT_PUBLIC_WHOP_APP_ID` = your Whop App ID
4. Click **Deploy**
5. Vercel will give you a URL like `rwtw-welcome.vercel.app`

### Step 3: Connect to Whop
1. In your Whop App settings, set the **App URL** to your Vercel URL
2. In your Whop product, add a **Web App** experience pointing to your Vercel URL
3. Users will now see the personalized welcome page inside Whop

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — note that subscription checking only works when embedded inside Whop (it needs the user token from the iframe).

## Environment Variables

Create a `.env.local` file:

```
WHOP_API_KEY=your_api_key_here
NEXT_PUBLIC_WHOP_APP_ID=your_app_id_here
```
