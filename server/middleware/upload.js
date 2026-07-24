const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

const createStorage = (subfolder) => {
  const destDir = path.join(UPLOADS_DIR, subfolder);
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    },
  });
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('فقط فایل‌های تصویری مجاز هستند (JPEG, PNG, GIF, WebP)'), false);
  }
};

const createUpload = (subfolder) => {
  return multer({
    storage: createStorage(subfolder),
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  });
};

const defaultUpload = createUpload('services');

const compressImage = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const tempPath = filePath + '.tmp';

  try {
    let pipeline = sharp(filePath).resize({
      width: 1200,
      height: 1200,
      fit: 'inside',
      withoutEnlargement: true,
    });

    if (ext === '.png') {
      pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
    } else if (ext === '.webp') {
      pipeline = pipeline.webp({ quality: 80 });
    } else if (ext === '.gif') {
      pipeline = pipeline.gif();
    } else {
      pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
    }

    await pipeline.toFile(tempPath);

    const originalStats = fs.statSync(filePath);
    const compressedStats = fs.statSync(tempPath);

    if (compressedStats.size < originalStats.size) {
      fs.renameSync(tempPath, filePath);
    } else {
      fs.unlinkSync(tempPath);
    }
  } catch (error) {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    console.error('Image compression error:', error);
  }
};

const uploadAndCompress = (fieldName, subfolder) => {
  const upload = subfolder ? createUpload(subfolder) : defaultUpload;
  return (req, res, next) => {
    upload.single(fieldName)(req, res, async (err) => {
      if (err) {
        return next(err);
      }
      if (req.file) {
        await compressImage(req.file.path);
      }
      next();
    });
  };
};

module.exports = defaultUpload;
module.exports.compressImage = compressImage;
module.exports.uploadAndCompress = uploadAndCompress;
module.exports.createUpload = createUpload;
