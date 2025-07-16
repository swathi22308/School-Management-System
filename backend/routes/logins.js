const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const path = require('path');

dotenv.config();

const Login = require('../models/Login');

console.log("🔍 __dirname:", __dirname);
console.log("🔍 Looking for model at:", path.resolve(__dirname, '../models/Login.js'));

async function connectAndSeed() {
  try {
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected for seeding");

    
    const users = [
      { email: "23ucs38@tcarts.in", password: await bcrypt.hash("event123", 10) },
      { email: "swathiravi1402@gmail.com", password: await bcrypt.hash("event123", 10) }
 
    ];

    
    await Login.deleteMany();
    await Login.insertMany(users);

    console.log("✅ Login details seeded!");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed after seeding");
  }
}


connectAndSeed();
