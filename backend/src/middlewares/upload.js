import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    cb(null, `${Date.now()}-${safeName}`);
  }
});

function imageFilter(_req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    cb(Object.assign(new Error('Only image uploads are allowed'), { statusCode: 422 }));
    return;
  }
  cb(null, true);
}

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export function uploadedImageUrl(req) {
  if (!req.file) return null;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/${path.basename(req.file.filename)}`;
}
