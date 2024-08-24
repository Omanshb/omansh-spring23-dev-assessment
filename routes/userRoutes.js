import express from 'express'
import dotenv from 'dotenv';
import { User } from '../models.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { connectDB } from '../mongodb.js';

dotenv.config();
const router = express.Router();

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validateUserCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { error: 'Invalid email or password' };
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { error: 'Invalid email or password' };
  }

  return { user };
};

router.post('/', async (req, res) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const user = new User(req.body);

    console.log(validatePassword('abcD1!21'));
    if (!validatePassword(user.password)) {
      console.log('Invalid password');
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }

    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);

    await user.save();
    res.status(200).json({
      message: 'User created successfully',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.log('hi pookie');
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

router.post('/login', async (req, res) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const { email, password } = req.body;
    const { error } = await validateUserCredentials(email, password);

    if (error) {
      return res.status(403).json({ error });
    }

    res.status(200).json({
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const { email, password } = req.body;
    const { error, user } = await validateUserCredentials(email, password);

    if (error) {
      return res.status(403).json({ error });
    }

    const token = jwt.sign({ id: user._id, email: user.email, ...user._doc }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Verification successful',
      token,
    });
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;