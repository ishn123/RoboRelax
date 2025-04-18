// /pages/api/webhooks/shopify-order-paid.ts
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    const hmacHeader = req.headers['x-shopify-hmac-sha256'];
    const rawBody = JSON.stringify(req.body); // You may need raw body for verification

    // TODO: Verify HMAC (optional but recommended)
    // Use process.env.SHOPIFY_WEBHOOK_SECRET for HMAC comparison

    const order = req.body;

    // ✅ Trigger your email logic here
    // e.g., send email using nodemailer / SendGrid / Mailgun etc.
    console.log('Order Paid:', order);

    res.status(200).send('Webhook received');
}
