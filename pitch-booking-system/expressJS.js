import express from 'express';
import apiRoutes from './routes/apiRoutes.js';

const app = express();

app.use(express.json()); // JSON Payload Parser Middleware

// Attach clean API Router path
app.use('/api', apiRoutes);

// Static Layer File Server
app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:3000`);
});