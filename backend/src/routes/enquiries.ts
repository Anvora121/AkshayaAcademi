import express, { Request, Response } from 'express';
const router = express.Router();
import { sendEmail } from '../utils/email';

// @route   POST /api/enquiries
// @desc    Receive an enquiry form submission and send email via EmailJS
// @access  Public
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, country, service, message } = req.body;

        // Basic validation
        if (!name || !email || !phone || !country || !service) {
            res.status(400).json({ message: 'Please fill in all required fields' });
            return;
        }

        const templateId = process.env.EMAILJS_TEMPLATE_ID_ENQUIRY;
        const publicKey = process.env.EMAILJS_PUBLIC_KEY;
        const privateKey = process.env.EMAILJS_PRIVATE_KEY;

        if (!templateId || !publicKey || !privateKey) {
            console.error("Missing EmailJS environment variables for Enquiry");
            res.status(500).json({ message: 'Email service configuration error' });
            return;
        }

        // Match these keys to your EmailJS Template variables
        const templateParams = {
            from_name: name,
            to_name: "Akshaya Akademics Admin",
            from_email: email,
            phone: phone,
            country: country,
            service: service,
            message: message || 'No message provided.',
            reply_to: email,
        };

        await sendEmail(templateId, templateParams, publicKey, privateKey);

        res.status(200).json({ message: 'Enquiry sent successfully' });
    } catch (error: any) {
        console.error('Failed to process enquiry:', error);
        res.status(500).json({ message: 'Failed to send enquiry. Please try again later.' });
    }
});

export default router;
