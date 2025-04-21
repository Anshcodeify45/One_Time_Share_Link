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
  const { secretText } = req.body;
  const uuid = uuidv4();

  const secret = new Secret({ uuid, secretText });
  await secret.save();

  res.json({ link: `http://localhost:3000/secret/${uuid}` });
});

app.get('/api/secret/:uuid', async (req, res) => {
  const { uuid } = req.params;
  const secret = await Secret.findOne({ uuid });

  if (!secret) {
    return res.status(404).json({ message: 'Secret not found or already viewed.' });
  }

  await Secret.deleteOne({ uuid });
  res.json({ secretText: secret.secretText });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

