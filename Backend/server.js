require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const Secret = require('./Model/SecretModel');
const connectDB = require('./Database/connect');


const app = express();
app.use(cors());
app.use(express.json());

connectDB();


app.post('/api/secret', async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { secretText } = req.body;

    // Validation
    if (!secretText || secretText.trim() === '') {
      return res.status(400).json({ error: 'Secret text is required' });
    }

    const uuid = crypto.randomUUID();

    // Save the new secret
    const newSecret = new Secret({ uuid, secretText });
    await newSecret.save();

    res.status(201).json({ message: 'Secret saved', uuid });
  } catch (error) {
    console.error("❌ Server Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/secret/:uuid', async (req, res) => {
  const { uuid } = req.params;

  // Validate UUID
  if (!uuid || uuid.length !== 36) {
    return res.status(400).json({ message: 'Invalid UUID format' });
  }

  try {
    // Find the secret by UUID
    const secret = await Secret.findOne({ uuid });

    if (!secret) {
      return res.status(404).json({ message: 'Secret not found or already viewed.' });
    }

    // Delete the secret after accessing it
    await Secret.deleteOne({ uuid });

    // Send the secret back to the user
    res.json({ secretText: secret.secretText });
  } catch (error) {
    console.error("❌ Database error:", error.message);
    res.status(500).json({ error: 'Failed to retrieve secret' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

