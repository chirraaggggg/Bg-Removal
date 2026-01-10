import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/mongodb.js';

// App config
const PORT = process.env.PORT || 4000;
const app = express();
await connectDB();

// Initialize middleware
app.use(express.json());
app.use(cors()); 


// API routes
app.get('/',(req,res)=> res.send("API is working"));

app.listen(PORT, () => console.log("Server is running on port "+ PORT));