
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const PAGE_ID = '103582818232042';
const PAGE_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'printing_pixels_verify_2026';

// ===== FAQ BRAIN from printing-pixels.com =====
const BRAIN = {
  business: 'PRINTING PIXELS, VGM Building KM11 Sasa, Davao City',
  tagline: 'Your ideas, made visible.',
  workflow: ['Tell us the idea (size, qty, deadline)', 'Review & quote', 'Approve proof', 'We make it', 'Pickup or delivery'],
  services: {
    essentials: 'Business cards, brochures, menus, invitations, documents, photo printing',
    stickers: 'Labels, wall/floor decals, vehicle graphics, printed-and-cut vinyl',
    signage: 'Storefront, acrylic, lightbox, backlit, directional, safety, event signage',
    custom: 'Shirts, caps, mugs, bottles, giveaways, customized merchandise'
  },
  payment: 'GCash, Maya, bank transfer, cash, cheque - details in quotation',
  quickReplies: {
    leadtime: "Lead time depends on product, qty, artwork and finishing. Share your deadline and we'll confirm realistic schedule before production. Need rush? Tell us date.",
    design: "Yes, we do layout & design support. Send logo, copy, size, and references so we can assess.",
    install: "Yes, installation available for signs, wall/glass decals, vehicle graphics around Davao City.",
    payment: "We accept GCash, Maya, bank transfer, cash, cheque. Final instructions are in your quotation."
  }
};

function generateReply(text) {
  const t = text.toLowerCase();
  let reply = '';
  if (t.includes('tarpaulin') || t.includes('tarp')) {
    reply = `Hello! For tarpaulin printing (Printing Pixels, Sasa Davao).

Our flow: ${BRAIN.workflow.join(' -> ')}

Can you share size (ft), quantity, eyelet or no, and deadline? I'll send clear quotation. We have pickup at VGM Bldg Sasa or delivery.

Payment: ${BRAIN.payment}`;
  } else if (t.includes('acrylic') || t.includes('lightbox') || t.includes('signage') || t.includes('sintra')) {
    reply = `For signage (acrylic/lightbox/Sintra) - our specialty at Printing Pixels.

${BRAIN.services.signage}

Share: size (2x3ft etc), indoor/outdoor, lighted or not, and reference photo. We check specs and send quotation + lead time. Proof approval first before production.

Installation available in Davao.`;
  } else if (t.includes('dtf') || t.includes('shirt') || t.includes('tshirt') || t.includes('t-shirt')) {
    reply = `DTF / Shirt printing - got it!

We do: ${BRAIN.services.custom}

How many pcs, sizes, and do you have artwork ready? Send artwork and deadline. We will quote per pc + bulk rate. Rush available.

Pickup: VGM Bldg KM11 Sasa, Davao`;
  } else if (t.includes('sticker') || t.includes('label') || t.includes('vinyl') || t.includes('decal')) {
    reply = `Sticker & label printing - waterproof vinyl available.

${BRAIN.services.stickers}

Tell me: size, shape (die-cut?), quantity, waterproof or regular, and where to apply (bottle, wall, vehicle). We'll send quotation with material recommendation.`;
  } else if (t.includes('price') || t.includes('hm') || t.includes('magkano') || t.includes('how much')) {
    reply = `Hi! Thanks for reaching Printing Pixels - ${BRAIN.tagline}

To give accurate price, can you tell me:
1. Product type (tarp, sticker, signage, shirts, mugs etc)
2. Size & quantity
3. Deadline

Workflow: ${BRAIN.workflow.join(' -> ')}

We send quotation after checking specs. ${BRAIN.quickReplies.payment}`;
  } else {
    reply = `Hello! Printing Pixels here - ${BRAIN.business}. ${BRAIN.tagline}

We make: 
01 ${BRAIN.services.essentials}
02 ${BRAIN.services.stickers}
03 ${BRAIN.services.signage}
04 ${BRAIN.services.custom}

Tell me your idea with size, qty, deadline and I'll send clear quotation. Proof approval first. Pickup/delivery available.`;
  }
  return reply;
}

// Webhook verification (for Meta)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Receive messages
app.post('/webhook', async (req, res) => {
  const body = req.body;
  if (body.object === 'page') {
    for (const entry of body.entry) {
      for (const event of entry.messaging) {
        if (event.message && event.message.text) {
          const senderId = event.sender.id;
          const text = event.message.text;
          const reply = generateReply(text);
          // Log lead
          console.log(`Lead from ${senderId}: ${text}`);
          // Send reply via Graph API
          try {
            await axios.post(`https://graph.facebook.com/v20.0/${PAGE_ID}/messages?access_token=${PAGE_TOKEN}`, {
              recipient: { id: senderId },
              message: { text: reply }
            });
          } catch (e) {
            console.error('Send error', e.response?.data || e.message);
          }
        }
      }
    }
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Website chat endpoint (for printing-pixels.com widget)
app.post('/chat', async (req, res) => {
  const { message, name, contact } = req.body;
  const reply = generateReply(message || '');
  // TODO: Save to DB / Google Sheet
  console.log(`Website lead: ${name} ${contact} - ${message}`);
  res.json({ reply, workflow: BRAIN.workflow, payment: BRAIN.payment });
});

app.get('/', (req, res) => {
  res.send(`Printing Pixels Bot Running - Page ${PAGE_ID} - ${BRAIN.tagline}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot listening on ${PORT}`));
