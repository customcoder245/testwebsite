import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Simple API endpoint to signal the frontend's Loop Status
app.get('/api/status', (req, res) => {
    res.json({
        status: "ACTIVE",
        core_load: Math.random() * 100,
        dimension_sync: true,
        timestamp: new Date().toISOString()
    });
});

// Provide access to build files if needed
app.use(express.static(join(__dirname, 'dist')));

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Dimension Backend Node online at http://localhost:${PORT}`);
    console.log(`API check: http://localhost:${PORT}/api/status`);
});
