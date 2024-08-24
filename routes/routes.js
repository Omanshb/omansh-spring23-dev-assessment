import express from 'express'
import { Animal, TrainingLog } from '../models.js'
import { connectDB } from '../mongodb.js'

const router = express.Router();

router.post('/animal', async (req, res) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const userId = req.user.id;
    const animalData = { ...req.body, owner: userId };

    const animal = new Animal(animalData);

    await animal.save();
    res.status(200).json({
      message: 'Animal created successfully',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({
        error: 'Validation Error',
        message: error.message,
        details: error.errors,
      });
    } else {
      console.error('Internal Server Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

router.post('/training', async (req, res) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const userId = req.user.id;
    const traininglogData = { ...req.body, user: userId };

    const traininglog = new TrainingLog(traininglogData);

    const animal = await Animal.findById(traininglog.animal);
    if (!animal) {
      return res.status(400).json({
        error: 'Animal not found',
      });
    }
    if (animal.owner.toString() !== userId) {
      return res.status(400).json({
        error: 'Animal does not belong to this user',
      });
    }

    animal.hoursTrained += traininglog.hours;
    await animal.save();

    await traininglog.save();
    res.status(200).json({
      message: 'Training log created successfully',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({
        error: 'Validation Error',
        message: error.message,
        details: error.errors,
      });
    } else {
      console.error('Internal Server Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

export default router;
