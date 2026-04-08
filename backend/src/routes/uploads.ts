import express, { Response } from 'express';
import multer from 'multer';
import path from 'path';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { uploadToDrive } from '../utils/googleDrive';
import { Documents } from '../models/Documents';

const router = express.Router();

// Use memory storage — no disk writes; buffer is streamed straight to Google Drive
const storage = multer.memoryStorage();

const fileFilter = (_req: AuthRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, PNG allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

type DocType = 'resume' | 'transcript' | 'sop';
const VALID_DOC_TYPES: DocType[] = ['resume', 'transcript', 'sop'];

const DOC_FIELD_MAP: Record<DocType, 'resumeURL' | 'transcriptURL' | 'sopURL'> = {
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
router.post(
  '/document',
  verifyToken,
  (req: AuthRequest, res: Response) => {
    upload.single('file')(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file provided' });
      }

      const docType = req.body.docType as DocType;
      if (!VALID_DOC_TYPES.includes(docType)) {
        return res.status(400).json({
          message: `Invalid docType. Must be one of: ${VALID_DOC_TYPES.join(', ')}`,
        });
      }

      const userId = req.user!.id;
      const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

      if (!folderId) {
        return res.status(500).json({
          message: 'Google Drive folder not configured. Set GOOGLE_DRIVE_FOLDER_ID in .env',
        });
      }

      try {
        const ext = path.extname(req.file.originalname);
        const timestamp = Date.now();
        const fileName = `${userId}_${docType}_${timestamp}${ext}`;

        const driveResult = await uploadToDrive(
          req.file.buffer,
          req.file.mimetype,
          fileName,
          folderId
        );

        // Persist the web view link in MongoDB Documents collection
        const fieldKey = DOC_FIELD_MAP[docType];
        await Documents.findOneAndUpdate(
          { userId },
          { userId, [fieldKey]: driveResult.webViewLink },
          { new: true, upsert: true }
        );

        return res.json({
          message: 'File uploaded to Google Drive successfully',
          url: driveResult.webViewLink,
          downloadUrl: driveResult.webContentLink,
          fileId: driveResult.fileId,
          originalName: req.file.originalname,
          size: req.file.size,
        });
      } catch (uploadErr: any) {
        console.error('Google Drive upload error:', uploadErr.message);
        return res.status(500).json({
          message: uploadErr.message?.includes('credentials not configured')
            ? uploadErr.message
            : 'Failed to upload file to Google Drive. Check server logs.',
        });
      }
    });
  }
);

export default router;
