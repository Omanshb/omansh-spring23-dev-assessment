import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import { User, Animal, TrainingLog } from '../models.js';
import { connectDB } from '../mongodb.js';

dotenv.config();
const router = express.Router();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
console.log('S3 Bucket:', process.env.S3_BUCKET_NAME);

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      console.log(req.body);
      let fileType = req.body.type.replace(/\s+/g, '_').toLowerCase();
      let id = req.body.id;
      if (req.body.type === "user image") {
        id = req.user.id;
      }
      const fileName = `${fileType}/${id}-${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    }
  })
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'type' },
  { name: 'id' }
]);

router.post('/upload', upload, async (req, res) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");


    const { type, id } = req.body;
    const userId = req.user.id;
    const fileUrl = req.file.location;

    let updatedDocument;
    switch (type) {
      case 'animal image':
        updatedDocument = await Animal.findByIdAndUpdate(id, { profilePicture: fileUrl }, { new: true });
        break;
      case 'user image':
        updatedDocument = await User.findByIdAndUpdate(userId, { profilePicture: fileUrl }, { new: true });
        break;
      case 'training log video':
        updatedDocument = await TrainingLog.findByIdAndUpdate(id, { trainingLogVideo: fileUrl }, { new: true });
        break;
      default:
        return res.status(400).json({ error: 'Invalid type specified' });
    }

    if (!updatedDocument) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.status(200).json({
      message: 'File uploaded successfully',
      fileUrl,
    });
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;