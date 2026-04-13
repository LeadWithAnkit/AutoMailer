import express from 'express';
import multer from 'multer';
import { processEmails } from '../controllers/emailController.js';

const router = express.Router();

// Multer Config
const upload = multer({ dest: 'uploads/' });

router.post('/send', upload.fields([
    { name: 'emailListPDF', maxCount: 1 },
    { name: 'resumePDF', maxCount: 1 }
]), processEmails);

export default router;