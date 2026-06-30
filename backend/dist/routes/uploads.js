"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("../middleware/auth");
const googleDrive_1 = require("../utils/googleDrive");
const Documents_1 = require("../models/Documents");
const router = express_1.default.Router();
// Use memory storage — no disk writes; buffer is streamed straight to Google Drive
const storage = multer_1.default.memoryStorage();
const fileFilter = (_req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, PNG allowed.'));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});
const VALID_DOC_TYPES = ['resume', 'transcript', 'sop'];
const DOC_FIELD_MAP = {
    resume: 'resumeURL',
    transcript: 'transcriptURL',
    sop: 'sopURL',
};
/**
 * POST /api/uploads/document
 * Body (multipart/form-data):
 *   - file: the document file
 *   - docType: 'resume' | 'transcript' | 'sop'
 */
router.post('/document', auth_1.verifyToken, (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err instanceof multer_1.default.MulterError) {
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        }
        else if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file provided' });
        }
        const docType = req.body.docType;
        if (!VALID_DOC_TYPES.includes(docType)) {
            return res.status(400).json({
                message: `Invalid docType. Must be one of: ${VALID_DOC_TYPES.join(', ')}`,
            });
        }
        const userId = req.user.id;
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        if (!folderId) {
            return res.status(500).json({
                message: 'Google Drive folder not configured. Set GOOGLE_DRIVE_FOLDER_ID in .env',
            });
        }
        try {
            const ext = path_1.default.extname(req.file.originalname);
            const timestamp = Date.now();
            const fileName = `${userId}_${docType}_${timestamp}${ext}`;
            const driveResult = await (0, googleDrive_1.uploadToDrive)(req.file.buffer, req.file.mimetype, fileName, folderId);
            // Persist the web view link in MongoDB Documents collection
            const fieldKey = DOC_FIELD_MAP[docType];
            await Documents_1.Documents.findOneAndUpdate({ userId }, { userId, [fieldKey]: driveResult.webViewLink }, { returnDocument: 'after', upsert: true });
            return res.json({
                message: 'File uploaded to Google Drive successfully',
                url: driveResult.webViewLink,
                downloadUrl: driveResult.webContentLink,
                fileId: driveResult.fileId,
                originalName: req.file.originalname,
                size: req.file.size,
            });
        }
        catch (uploadErr) {
            console.error('Google Drive upload error:', uploadErr.message);
            return res.status(500).json({
                message: uploadErr.message?.includes('credentials not configured')
                    ? uploadErr.message
                    : 'Failed to upload file to Google Drive. Check server logs.',
            });
        }
    });
});
exports.default = router;
