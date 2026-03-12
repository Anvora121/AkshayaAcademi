import emailjs from '@emailjs/nodejs';

interface EmailParams {
    [key: string]: unknown;
}

export const sendEmail = async (templateId: string, templateParams: EmailParams, publicKey: string, privateKey: string) => {
    try {
        const serviceId = process.env.EMAILJS_SERVICE_ID;
        if (!serviceId) throw new Error("EMAILJS_SERVICE_ID is not defined");

        await emailjs.send(
            serviceId,
            templateId,
            templateParams,
            {
                publicKey: publicKey,
                privateKey: privateKey,
            }
        );
        return { success: true };
    } catch (error) {
        console.error('EmailJS Error:', error);
        throw new Error('Failed to send email securely via backend');
    }
};
