const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Staff = require('../models/Staff');


router.post('/', async (req, res) => {
  console.log('📥 Incoming request to POST /api/staffs');

  if (mongoose.connection.readyState !== 1) {
    console.error('❌ MongoDB not connected.');
    return res.status(503).json({ message: 'Service Unavailable: Database not connected' });
  }

  try {
    const {
      id,
      name,
      standard,
      workingRole,
      phone,
      altPhone,
      address,
      landmark,
      city,
      state,
      country,
      date,
    } = req.body;

  
    if (!id || !name || !standard || !workingRole || !phone) {
      console.warn('⚠️ Missing required fields');
      return res.status(400).json({
        message: 'Missing required fields: id, name, standard, workingRole, phone',
      });
    }

    const staff = new Staff({
      id,
      name,
      standard,
      workingRole,
      phone,
      altPhone: altPhone || '',
      address: address || '',
      landmark: landmark || '',
      city: city || '',
      state: state || '',
      country: country || '',
      date: date || new Date().toISOString(),
    });

    await staff.save();
    console.log('✅ Staff saved successfully');
    res.status(201).json({ message: 'Staff saved successfully' });

  } catch (error) {
    console.error('🔥 Error while saving staff:', error.message);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});


router.get('/', async (req, res) => {
  try {
    const staffs = await Staff.find().sort({ date: -1 });
    res.status(200).json(staffs);
  } catch (error) {
    console.error('❌ Error fetching staffs:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  console.log(`🔧 PUT /api/staffs/${id}`);
  console.log('📝 Update data received:', updateData);

  try {
    const result = await Staff.findOneAndUpdate({ id }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      console.warn(`⚠️ No staff found with id: ${id}`);
      return res.status(404).json({ message: 'Staff not found' });
    }

    console.log(`✅ Successfully updated staff with id: ${id}`);
    res.status(200).json(result);
  } catch (error) {
    console.error('🔥 Error in PUT /api/staffs/:id:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Staff.findOneAndDelete({ id });

    if (!result) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    console.log(`🗑️ Deleted staff with ID ${id}`);
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('🔥 Error deleting staff:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
