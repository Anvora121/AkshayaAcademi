import express, { Request, Response } from 'express';
const router = express.Router();
import { sendEmail } from '../utils/email';
import { CounselorLead } from '../models/CounselorLead';

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

// @route   POST /api/enquiries/counselor
// @desc    Submit a counselor enquiry, save as CounselorLead
// @access  Public
router.post('/counselor', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, phone, universityName, message } = req.body;

        if (!name || !email || !phone) {
            res.status(400).json({ message: 'Name, email and phone are required' });
            return;
        }

        await CounselorLead.create({ name, email, phone, universityName, message });

        res.status(201).json({ message: 'Your counselor request has been received. We will contact you within 24 hours.' });
    } catch (error) {
        console.error('Failed to save counselor lead:', error);
        res.status(500).json({ message: 'Failed to submit request. Please try again.' });
    }
});

export default router;
