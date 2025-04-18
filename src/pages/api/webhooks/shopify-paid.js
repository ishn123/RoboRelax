// /pages/api/webhooks/shopify-order-paid.ts
import {getAllFieldsForUser, RemoveEverythingAfterSuccessfullPayment} from "@/lib/cart";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    const hmacHeader = req.headers['x-shopify-hmac-sha256'];
    console.log(req.body)
     // You may need raw body for verification
    // TODO: Verify HMAC (optional but recommended)
    // Use process.env.SHOPIFY_WEBHOOK_SECRET for HMAC comparison

    const order = req.body;


    //Trigger your email logic here
    // e.g., send email using nodemailer

    const customerEmail = order.customer ? order.customer?.email : null;

    if (customerEmail) {
        console.log(customerEmail)
        const data = await getAllFieldsForUser(customerEmail);
        const prefix = "emailTemplate";

        const matchingField = Object.entries(data).find(([key, value]) => key.startsWith(prefix));

        if (matchingField) {
            const [key, value] = matchingField;
            console.log(`Found matching field: ${key} with value: ${value}`);
            const result = await fetch(`${process.env.BASE_URL}/triggerEmail`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({customerEmail, value})
            })
            if (result.status === 200) {
                await RemoveEverythingAfterSuccessfullPayment(customerEmail);
                console.log("Mail sent");
                res.status(200).send("OK");
            } else {
                res.status(501).send("Internal Server error");
            }

        } else {
            console.log("No field starts with 'emailTemplate'.");
            console.log("Problem sending email");
            res.status(501).send("Internal Server error");

        }


        res.status(404).end("Not found");

    }
}
