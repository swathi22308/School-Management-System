const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt');
const app = express();


const Login = require('./models/Login');



mongoose.set('bufferCommands', false);


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); 


console.log('Connecting to:', process.env.MONGO_URI);





mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1); 
});




// Routes
const studentRoutes = require('./routes/students');
app.use('/api/students', studentRoutes);
const staffRoutes = require('./routes/staffs');
app.use('/api/staffs', staffRoutes);
const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);
const masterRoutes = require('./routes/masters');
app.use('/api/masters', masterRoutes);


 app.post('/logins', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await Login.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password); // ✅ Compare hashed
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Incorrect password" });
      }
  
      res.json({ success: true, message: "Logged in successfully" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });



app.get('/test', (req, res) => {
  res.send('✅ Server test working');
});


// Server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
