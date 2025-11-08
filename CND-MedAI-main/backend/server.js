require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const User = require('./models/User');
const Analysis = require('./models/Analysis');

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
const JWT_SECRET = process.env.JWT_SECRET;
const USE_JWT = !!JWT_SECRET; // if JWT_SECRET is provided, use JWTs; otherwise fallback to simple cookie

const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true };
if (DB_NAME) mongooseOptions.dbName = DB_NAME;

mongoose.connect(MONGO_URI, mongooseOptions)
  .then(() => {
    console.log('MongoDB connected');
    try {
      const dbName = mongoose.connection.db.databaseName;
      console.log('Connected to database:', dbName);
    } catch (e) {
      // ignore if not available
    }
  })
  .catch(err => console.error('MongoDB connection error', err));

app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, doctorId, email, password, hospitalName, area } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'User already exists' });

  // bcryptjs supports passing the rounds directly to hash
  const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ fullName, doctorId, email, passwordHash, hospitalName, area });
  const saved = await user.save();
  console.log('User saved:', saved._id.toString());

    if (USE_JWT) {
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
      return res.json({ token, user: { id: user._id, email: user.email, fullName: user.fullName } });
    }

    // If not using JWT, set a readable cookie with the user email to identify the session
    res.cookie('user_email', user.email, { httpOnly: false, sameSite: 'lax' });
    return res.json({ user: { id: user._id, email: user.email, fullName: user.fullName } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    console.log('Login attempt for:', email);
    const user = await User.findOne({ email });
    console.log('User lookup result:', user ? user._id.toString() : 'not found');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.passwordHash) {
      console.error('User record missing passwordHash:', user._id.toString());
      return res.status(500).json({ message: 'Server error' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (USE_JWT) {
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
      return res.json({ token, user: { id: user._id, email: user.email, fullName: user.fullName } });
    }

    res.cookie('user_email', user.email, { httpOnly: false, sameSite: 'lax' });
    return res.json({ user: { id: user._id, email: user.email, fullName: user.fullName } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    if (USE_JWT) {
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Not authenticated' });

      const payload = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(payload.id).select('-passwordHash');
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json({ user });
    }

    // Fallback: match by email cookie/header when JWT is not used
    const email = req.cookies.user_email || req.headers['x-user-email'];
    if (!email) return res.status(401).json({ message: 'Not authenticated' });
    const user = await User.findOne({ email }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  try {
    res.clearCookie('token');
    res.clearCookie('user_email');
    return res.json({ ok: true });
  } catch (err) {
    console.error('Logout error', err);
    return res.status(500).json({ error: 'Logout failed' });
  }
});

// Get user profile
app.get('/api/profile', async (req, res) => {
  try {
    let userId;
    console.log('Profile endpoint hit. USE_JWT:', USE_JWT);
    console.log('Cookies:', req.cookies);
    console.log('Headers:', req.headers.authorization);
    
    if (USE_JWT) {
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      console.log('Token found:', !!token);
      if (!token) return res.status(401).json({ message: 'Not authenticated' });
      const payload = jwt.verify(token, JWT_SECRET);
      userId = payload.id;
      console.log('User ID from JWT:', userId);
    } else {
      const email = req.cookies.user_email || req.headers['x-user-email'];
      console.log('Email from cookie:', email);
      if (!email) return res.status(401).json({ message: 'Not authenticated' });
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Not authenticated' });
      userId = user._id;
      console.log('User ID from email lookup:', userId);
    }

    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log('User found:', { 
      fullName: user.fullName, 
      doctorId: user.doctorId,
      email: user.email, 
      hospitalName: user.hospitalName, 
      area: user.area,
      hasProfilePicture: !!user.profilePicture
    });

    // Return profile in the format expected by frontend
    return res.json({
      full_name: user.fullName || '',
      doctor_id: user.doctorId || '',
      email: user.email || '',
      hospital_name: user.hospitalName || '',
      area: user.area || '',
      profile_picture: user.profilePicture || ''
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
app.put('/api/profile', async (req, res) => {
  try {
    let userId;
    if (USE_JWT) {
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Not authenticated' });
      const payload = jwt.verify(token, JWT_SECRET);
      userId = payload.id;
    } else {
      const email = req.cookies.user_email || req.headers['x-user-email'];
      if (!email) return res.status(401).json({ message: 'Not authenticated' });
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Not authenticated' });
      userId = user._id;
    }

    const { full_name, doctor_id, hospital_name, area, profile_picture } = req.body;

    const updateData = {};
    if (full_name !== undefined) updateData.fullName = full_name;
    if (doctor_id !== undefined) updateData.doctorId = doctor_id;
    if (hospital_name !== undefined) updateData.hospitalName = hospital_name;
    if (area !== undefined) updateData.area = area;
    if (profile_picture !== undefined) updateData.profilePicture = profile_picture;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-passwordHash');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    return res.json({
      full_name: updatedUser.fullName || '',
      doctor_id: updatedUser.doctorId || '',
      email: updatedUser.email || '',
      hospital_name: updatedUser.hospitalName || '',
      area: updatedUser.area || '',
      profile_picture: updatedUser.profilePicture || ''
    });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get analysis history for authenticated user
app.get('/api/analysis/history', async (req, res) => {
  try {
    // Get user from auth
    let userId;
    if (USE_JWT) {
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Not authenticated' });
      const payload = jwt.verify(token, JWT_SECRET);
      userId = payload.id;
    } else {
      const email = req.cookies.user_email || req.headers['x-user-email'];
      if (!email) return res.status(401).json({ message: 'Not authenticated' });
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Not authenticated' });
      userId = user._id;
    }

    // Get pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch analyses for the user
    const analyses = await Analysis.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Analysis.countDocuments({ userId });
    const pages = Math.ceil(total / limit);

    return res.json({
      analyses,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });
  } catch (err) {
    console.error('History fetch error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get comprehensive counts for dashboard stats
app.get('/api/analysis/category-counts', async (req, res) => {
  try {
    let userId;
    if (USE_JWT) {
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Not authenticated' });
      const payload = jwt.verify(token, JWT_SECRET);
      userId = payload.id;
    } else {
      const email = req.cookies.user_email || req.headers['x-user-email'];
      if (!email) return res.status(401).json({ message: 'Not authenticated' });
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Not authenticated' });
      userId = user._id;
    }

    // Get total count
    const totalCount = await Analysis.countDocuments({ userId });

    // Get today's count (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const todayCount = await Analysis.countDocuments({
      userId,
      createdAt: { $gte: twentyFourHoursAgo }
    });

    // Cancer: diagnosis contains 'cancer' (case-insensitive)
    const cancerCount = await Analysis.countDocuments({
      userId,
      'results.diagnosis': { $regex: /cancer/i }
    });

    // Neurological: diagnosis contains 'neuro' or 'epilepsy' or 'multiple sclerosis' (case-insensitive)
    const neuroCount = await Analysis.countDocuments({
      userId,
      'results.diagnosis': { $regex: /(neuro|epilepsy|multiple sclerosis|alzheimer)/i }
    });

    return res.json({ todayCount, totalCount, cancerCount, neuroCount });
  } catch (err) {
    console.error('Category count error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Save a completed analysis to history. Expects a completed result and base64 image data.
app.post('/api/analysis/upload', async (req, res) => {
  try {
    // Auth
    let userId;
    if (USE_JWT) {
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Not authenticated' });
      const payload = jwt.verify(token, JWT_SECRET);
      userId = payload.id;
    } else {
      const email = req.cookies.user_email || req.headers['x-user-email'];
      if (!email) return res.status(401).json({ message: 'Not authenticated' });
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Not authenticated' });
      userId = user._id;
    }

  const { fileName, fileData, fileType, fileSize, imageType, results, patientInfo } = req.body;

    if (!results || !results.diagnosis) {
      return res.status(400).json({ message: 'No completed result provided - only completed analyses are stored' });
    }

    // Ensure we use the same mongoose connection as the User model (login DB)
    const AnalysisModel = mongoose.connection.model('Analysis') || Analysis;

    // Create analysis record storing base64 image data
    const analysis = new AnalysisModel({
      userId,
      fileName: fileName || `upload_${Date.now()}`,
      originalName: fileName || `upload_${Date.now()}`,
      fileType: fileType || 'image',
      fileSize: fileSize || 0,
      status: 'completed',
      results: {
        diagnosis: results.diagnosis,
        confidence: results.confidence != null ? results.confidence : 0,
        findings: results.findings || [],
        recommendations: results.recommendations || [],
        processingTime: results.processingTime || 0
      },
      fileData: fileData || null,
      imageType: imageType || null,
      filePath: '',
      patientInfo: patientInfo || null
    });

    const saved = await analysis.save();
    return res.json({ analysisId: saved._id });
  } catch (err) {
    console.error('Upload save error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Auth server listening on ${PORT}`));
