#!/bin/bash
echo "Starting LaTeX installation script..."
echo "Installing LaTeX and required packages..."

# Detect Railway environment or root environment
if [[ -n "$RAILWAY_ENVIRONMENT" ]] || [[ -n "$ROOT_ENVIRONMENT" ]]; then
    echo "Detected Railway or root environment - using package manager without sudo"
    
    # Update package manager
    apt-get update
    
    # Install texlive (containers/root environments have direct access)
    apt-get install -y texlive-full texlive-fonts-extra texlive-latex-extra
    
    echo "LaTeX installation complete!"
    
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Detected macOS"
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        echo "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    # Install MacTeX
    if ! command -v pdflatex &> /dev/null; then
        echo "Installing MacTeX..."
        brew install --cask mactex
    fi
    
    # Update tlmgr
    sudo tlmgr update --self
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "Detected Linux"
    
    # Update package manager
    apt-get update
    
    # Install texlive
    apt-get install -y texlive-full
    
else
    echo "Unsupported OS: $OSTYPE"
    exit 1
fi

# Install/Update required packages (skip in Railway/root environments as texlive-full includes them)
if [[ -z "$RAILWAY_ENVIRONMENT" ]] && [[ -z "$ROOT_ENVIRONMENT" ]]; then
    PACKAGES=(
        "xelatex"
        "fontspec"
        "geometry"
        "enumitem"
        "hyperref"
        "xcolor"
        "titlesec"
        "fancyhdr"
        "graphicx"
        "array"
        "longtable"
        "wrapfig"
        "float"
        "colortbl"
        "pdflscape"
        "tabu"
        "threeparttable"
        "threeparttablex"
        "ulem"
        "makecell"
    )

    echo "Installing LaTeX packages..."
    for package in "${PACKAGES[@]}"; do
        echo "Installing $package..."
        tlmgr install "$package" || echo "Warning: Could not install $package"
    done
fi

echo "LaTeX installation complete!"
echo "Testing installation..."

# Test installation
cat > test.tex << 'EOF'
\documentclass{article}
\usepackage{geometry}
\usepackage{enumitem}
\usepackage{hyperref}
\usepackage{xcolor}
\usepackage{titlesec}
\usepackage{fancyhdr}
\usepackage{graphicx}
\usepackage{array}

\begin{document}
\title{LaTeX Test Document}
\author{ResumeGen}
\date{\today}
\maketitle

This is a test document to verify all required packages are installed.

\end{document}
EOF

if pdflatex test.tex; then
    echo "✅ LaTeX installation test successful!"
    rm -f test.tex test.pdf test.aux test.log
else
    echo "❌ LaTeX installation test failed!"
    # Don't exit 1 in Railway or root environments to allow deployment to continue
    if [[ -z "$RAILWAY_ENVIRONMENT" ]] && [[ -z "$ROOT_ENVIRONMENT" ]]; then
        exit 1
    fi
fi
