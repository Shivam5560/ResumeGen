const { exec } = require('child_process');

const checkLaTeX = (req, res, next) => {
    // Skip LaTeX check in Railway environment for faster startup
    if (process.env.RAILWAY_ENVIRONMENT) {
        console.log('Railway environment detected, skipping LaTeX middleware check');
        return next();
    }
    
    exec('pdflatex --version', { timeout: 5000 }, (error, stdout, stderr) => {
        if (error) {
            return res.status(503).json({
                error: 'LaTeX not available',
                message: 'PDFLaTeX is not installed or not accessible',
                details: error.message,
                environment: 'local',
                installation_guide: {
                    message: 'Please install LaTeX on your system',
                    macOS: 'Run: brew install --cask mactex',
                    linux: 'Run: sudo apt-get install texlive-full',
                    script: 'Run: ./backend/scripts/install-latex-packages.sh'
                }
            });
        }
        next();
    });
};

module.exports = { checkLaTeX };
