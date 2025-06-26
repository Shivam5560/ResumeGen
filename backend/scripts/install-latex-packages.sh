#!/bin/bash

echo "Installing minimal LaTeX (BasicTeX equivalent)..."

# Detect Railway environment
if [[ -n "$RAILWAY_ENVIRONMENT" ]]; then
    echo "Detected Railway environment - using minimal LaTeX installation"
    
    # Update package manager
    apt-get update
    
    # Install minimal texlive (equivalent to BasicTeX)
    apt-get install -y texlive-latex-base texlive-latex-recommended texlive-fonts-recommended
    
    # Install only the packages we actually need
    tlmgr install geometry enumitem hyperref xcolor titlesec fancyhdr || echo "tlmgr not available, packages might be pre-installed"
    
    echo "Minimal LaTeX installation complete in Railway!"
    
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - install BasicTeX (minimal)
    echo "Detected macOS - installing BasicTeX"
    
    if ! command -v brew &> /dev/null; then
        echo "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    # Install BasicTeX instead of full MacTeX
    if ! command -v pdflatex &> /dev/null; then
        echo "Installing BasicTeX..."
        brew install --cask basictex
        
        # Add LaTeX to PATH
        export PATH="/usr/local/texlive/2023/bin/universal-darwin:$PATH"
        echo 'export PATH="/usr/local/texlive/2023/bin/universal-darwin:$PATH"' >> ~/.bashrc
        echo 'export PATH="/usr/local/texlive/2023/bin/universal-darwin:$PATH"' >> ~/.zshrc
    fi
    
    # Update tlmgr and install only required packages
    sudo tlmgr update --self
    sudo tlmgr install geometry enumitem hyperref xcolor titlesec fancyhdr
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux - minimal installation
    echo "Detected Linux - installing minimal TeXLive"
    
    sudo apt-get update
    sudo apt-get install -y texlive-latex-base texlive-latex-recommended texlive-fonts-recommended
    
    # Install only required packages
    sudo tlmgr install geometry enumitem hyperref xcolor titlesec fancyhdr
    
else
    echo "Unsupported OS: $OSTYPE"
    exit 1
fi

echo "Minimal LaTeX installation complete!"
echo "Testing installation..."

# Test with minimal document
cat > test.tex << 'EOF'
\documentclass{article}
\usepackage{geometry}
\usepackage{enumitem}
\usepackage{hyperref}
\usepackage{xcolor}
\usepackage{titlesec}
\usepackage{fancyhdr}

\begin{document}
\title{Minimal LaTeX Test}
\author{ResumeGen}
\date{\today}
\maketitle

This tests our minimal LaTeX installation.

\end{document}
EOF

if pdflatex test.tex; then
    echo "✅ Minimal LaTeX installation test successful!"
    rm -f test.tex test.pdf test.aux test.log
else
    echo "❌ LaTeX installation test failed!"
    if [[ -z "$RAILWAY_ENVIRONMENT" ]]; then
        exit 1
    fi
fi
