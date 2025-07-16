const express = require('express');
const router = express.Router();
const Master = require('../models/Master');


const getColorByStatus = (status) => {
  return status === 'Active' ? '#4caf50' : '#f44336'; 
};



router.get('/', async (req, res) => {
  try {
    const masters = await Master.find().sort({ createdAt: -1 });
    res.status(200).json(masters);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, type, status = 'Active', color } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: 'Name and type are required' });
  }

  const master = new Master({ name, type, status, color });

  try {
    const newMaster = await master.save();
    res.status(201).json(newMaster);
  } catch (err) {
    res.status(400).json({ message: 'Validation error: ' + err.message });
  }
});


router.put('/:id', async (req, res) => {
  const { name, type, status, color } = req.body;

  try {
    const updatedMaster = await Master.findByIdAndUpdate(
      req.params.id,
      { name, type, status, color },
      { new: true, runValidators: true }
    );

    if (!updatedMaster) {
      return res.status(404).json({ message: 'Master not found' });
    }

    res.status(200).json(updatedMaster);
  } catch (err) {
    res.status(400).json({ message: 'Update failed: ' + err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Master.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Master not found' });
    }
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed: ' + err.message });
  }
});

module.exports = router;
