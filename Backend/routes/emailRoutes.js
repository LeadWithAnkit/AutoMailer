import express from 'express';
import multer from 'multer';
import { processEmails } from '../controllers/emailController.js';

const router = express.Router();

// Multer Config stored in memory 
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// sender file
router.post('/send', upload.fields([
    { name: 'emailListFile', maxCount: 1 },
    { name: 'resumePDF', maxCount: 1 }
]), processEmails);

export default router;
