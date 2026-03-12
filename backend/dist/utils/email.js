"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodejs_1 = __importDefault(require("@emailjs/nodejs"));
const sendEmail = async (templateId, templateParams, publicKey, privateKey) => {
    try {
        const serviceId = process.env.EMAILJS_SERVICE_ID;
        if (!serviceId)
            throw new Error("EMAILJS_SERVICE_ID is not defined");
        await nodejs_1.default.send(serviceId, templateId, templateParams, {
            publicKey: publicKey,
            privateKey: privateKey,
        });
        return { success: true };
    }
    catch (error) {
        console.error('EmailJS Error:', error);
        throw new Error('Failed to send email securely via backend');
    }
};
exports.sendEmail = sendEmail;
