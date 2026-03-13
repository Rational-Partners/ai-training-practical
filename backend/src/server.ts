import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors

// Import routes
import exerciseTaskRoutes from './routes/exerciseTask.routes'; // Updated import path and variable name
import analyticsRoutes from './routes/analytics.routes'; // Import the new analytics routes

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = parseInt(process.env.BACKEND_PORT || '3001');

// Middleware

// Enable CORS for requests from the frontend origin
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5000', // Allow frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  // allowedHeaders: ["Content-Type", "Authorization"], // If you need specific headers
}));

app.use(express.json()); // Parse JSON bodies (should come after CORS typically)

// --- API Routes ---
app.use('/api/exercises/tasks', exerciseTaskRoutes); // Use updated variable name
app.use('/api/analytics', analyticsRoutes); // Mount the analytics routes

// Simple Health Check Route (Keep accessible at root)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

// Placeholder for future routes
// app.use('/api', mainApiRouter); // Example

// Basic Error Handling Middleware (Example)
// Place this *after* all routes
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  // Check if the error has a specific status code, otherwise default to 500
  const statusCode = (err as any).statusCode || 500;
  // Send a generic error message or customize based on error type
  res.status(statusCode).json({ 
    message: err.message || 'Something broke!' 
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running at http://0.0.0.0:${port}`);
}); 