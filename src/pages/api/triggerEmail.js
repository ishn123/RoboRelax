import { sendEmail } from "@/lib/email";

export default async function POST(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { customerEmail,value } = req.body;

        console.log(customerEmail,value);

        await sendEmail({
            to: customerEmail,
            subject: 'New Submission',
            html: `<h2>Appointment confirmed ${value}</h2>`

        });

        res.status(200).json({ success: true});
    } catch (error) {
        console.error("Submission Failed:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
