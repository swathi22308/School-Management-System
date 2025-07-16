const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Student = require('../models/Student');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });


router.post('/', upload.single('profile'), async (req, res) => {
  console.log('📥 Incoming request to POST /api/students');

  if (mongoose.connection.readyState !== 1) {
    console.error('❌ MongoDB not connected.');
    return res.status(503).json({ message: 'Service Unavailable: Database not connected' });
  }

  try {
    const {
      id,
      name,
      standard,
      gender,
      parent,
      phone,
      altPhone,
      address,
      landmark,
      city,
      state,
      country,
      date,
    } = req.body;

    
         const profile = req.file
  ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  : '';

    
    if (!id || !name || !standard || !gender || !phone) {
      console.warn('⚠️ Missing required fields');
      return res.status(400).json({
        message: 'Missing required fields: id, name, standard, gender, phone',
      });
    }

    const student = new Student({
      id,
      name,
      standard,
      gender,
      parent,
      phone,
      altPhone: altPhone || '',
      address: address || '',
      landmark: landmark || '',
      city: city || '',
      state: state || '',
      country: country || '',
      profile,
      date: date || new Date().toISOString(),
    });

    await student.save();
    console.log('✅ Student saved successfully');
    res.status(201).json({ message: 'Student saved successfully' });

  } catch (error) {
    console.error('🔥 Error while saving student:', error.message);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});


router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ date: -1 });
    res.status(200).json(students);
  } catch (error) {
    console.error('❌ Error fetching students:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  console.log(`🔧 PUT /api/students/${id}`);
  console.log('📝 Update data received:', updateData);

  try {
    const result = await Student.findOneAndUpdate({ id }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      console.warn(`⚠️ No student found with id: ${id}`);
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log(`✅ Successfully updated student with id: ${id}`);
    res.status(200).json(result);
  } catch (error) {
    console.error('🔥 Error in PUT /api/students/:id:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Student.findOneAndDelete({ id });

    if (!result) {
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log(`🗑️ Deleted student with ID ${id}`);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('🔥 Error deleting student:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
