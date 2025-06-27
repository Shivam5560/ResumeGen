#!/bin/bash
chmod +x /backend/scripts/install-latex-packages.sh
echo "Starting ResumeGen backend setup and execution..."

# Make sure we're in the backend directory
cd "$(dirname "$0")"

echo "Step 1: Running install script..."
# Execute the install script from the parent scripts directory
bash ../scripts/install-latex-packages.sh

if [ $? -eq 0 ]; then
    echo "✓ Install script completed successfully"
else
    echo "✗ Install script failed"
    exit 1
fi

echo "Step 2: Starting Python application..."
# Run the main Python application
python3 main.py

if [ $? -eq 0 ]; then
    echo "✓ Python application completed successfully"
else
    echo "✗ Python application failed"
    exit 1
fi