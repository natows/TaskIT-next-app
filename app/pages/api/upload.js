import multer from 'multer';
import path from 'path';
import fs from 'fs';


export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });


export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    upload.single('file')(req, res, (err) => {
        if (err) return res.status(500).json({ error: err.message });

        const fileUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({ fileUrl });
    });
}
