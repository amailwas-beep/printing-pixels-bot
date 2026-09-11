# PRINTING PIXELS - Messenger Bot for Railway
Page ID: 103582818232042
Domain: printing-pixels.com

This bot handles inquiries, product research logging, and ad lead capture.

## Stack
- Node.js + Express
- Facebook Graph API v20
- Ready for Railway deployment
- Same brain for website widget

## Env Vars (set in Railway dashboard)
PAGE_ACCESS_TOKEN=your_page_token_from_meta_developers
VERIFY_TOKEN=printing_pixels_verify_2026
APP_SECRET=your_app_secret
OPENAI_API_KEY=optional_for_smarter_replies

## Deploy to Railway
1. Push this folder to GitHub
2. In Railway -> New Project -> Deploy from GitHub
3. Add env vars
4. Get your Railway domain: https://your-app.up.railway.app
5. In Meta Developers -> Your App -> Messenger -> Webhook: set URL to https://your-app.up.railway.app/webhook and verify token to VERIFY_TOKEN
6. Subscribe to: messages, messaging_postbacks, message_deliveries

## Website Widget (for printing-pixels.com - Codex)
Add to your Codex site footer:

<script>
window.PRINTING_PIXELS_BOT = {
  apiUrl: "https://your-app.up.railway.app/chat",
  primaryColor: "#D4AF37",
  business: "Printing Pixels, Sasa Davao"
}
</script>
<script src="https://your-app.up.railway.app/widget.js"></script>

## Flow
- User asks: "HM tarp 4x6?"
- Bot checks FAQ from printing-pixels.com workflow: Tell idea -> Review & quote -> Approve proof -> We make -> Pickup/delivery
- If price known, replies with quotation template + GCash/Maya options
- If not, captures lead to /leads endpoint
