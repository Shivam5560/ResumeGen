const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Simplified health check for Railway
router.get('/', async (req, res) => {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.RAILWAY_ENVIRONMENT || 'local',
        services: {}
    };
    
    try {
        // Quick LaTeX check with timeout
        const latexCheck = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('LaTeX check timeout'));
            }, 10000); // 10 second timeout
            
            exec('pdflatex --version', { timeout: 8000 }, (error, stdout, stderr) => {
                clearTimeout(timeout);
                if (error) {
                    reject(new Error(`LaTeX not available: ${error.message}`));
                } else {
                    resolve(stdout.split('\n')[0].trim());
                }
            });
        });

        try {
            const latexVersion = await latexCheck;
            health.services.latex = {
                status: 'ok',
                version: latexVersion
            };
        } catch (error) {
            health.services.latex = {
                status: 'error',
                error: error.message
            };
            // Don't fail health check for LaTeX issues in Railway
            if (process.env.RAILWAY_ENVIRONMENT) {
                health.services.latex.status = 'warning';
            } else {
                health.status = 'error';
            }
        }
        
        // Check temp directory
        const tempDir = path.join(__dirname, '../temp');
        health.services.temp_directory = {
            status: fs.existsSync(tempDir) ? 'ok' : 'warning',
            path: tempDir
        };
        
        // Railway always returns 200 for health checks unless critical error
        const statusCode = health.status === 'error' && !process.env.RAILWAY_ENVIRONMENT ? 503 : 200;
        res.status(statusCode).json(health);
        
    } catch (error) {
        res.status(200).json({
            status: 'warning',
            error: error.message,
            timestamp: new Date().toISOString(),
            environment: process.env.RAILWAY_ENVIRONMENT || 'local'
        });
    }
});

module.exports = router;
