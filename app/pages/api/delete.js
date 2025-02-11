import path from 'path';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: true,
    },
};

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { fileUrl } = req.body;
    if (!fileUrl) {
        return res.status(400).json({ message: 'File URL is required' });
    }

    const filePath = path.join(process.cwd(), 'public', fileUrl);
    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd podczas usuwania pliku' });
        }
        res.status(200).json({ message: 'Plik usunięty' });
    });
}