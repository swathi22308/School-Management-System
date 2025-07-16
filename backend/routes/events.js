const express = require('express');
const router = express.Router();
const Event = require('../models/Event');


router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});


router.post('/', async (req, res) => {
  const { title, label, start, end, description } = req.body;
  try {
    const newEvent = new Event({ title, label, start, end, description });
    const saved = await newEvent.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Invalid Data' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(404).json({ error: 'Event not found' });
  }
});

module.exports = router;
