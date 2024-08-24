import express from 'express';
import { User, Animal, TrainingLog } from '../models.js';
import { connectDB } from '../mongodb.js';

const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const { lastId, pageSize = 10 } = req.query;
    const query = lastId ? { _id: { $gt: lastId } } : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ _id: 1 })
      .limit(parseInt(pageSize));

    res.status(200).json(users);
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/animals', async (req, res) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const { lastId, pageSize = 10 } = req.query;
    const query = lastId ? { _id: { $gt: lastId } } : {};

    const animals = await Animal.find(query)
      .sort({ _id: 1 })
      .limit(parseInt(pageSize));

    res.status(200).json(animals);
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/training', async (req, res) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const { lastId, pageSize = 10 } = req.query;
    const query = lastId ? { _id: { $gt: lastId } } : {};

    const traininglogs = await TrainingLog.find(query)
      .sort({ _id: 1 })
      .limit(parseInt(pageSize));

    res.status(200).json(traininglogs);
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
