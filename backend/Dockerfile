FROM paperist/texlive-ja:latest

# Install Python 3 and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Create symlinks for python
RUN ln -sf /usr/bin/python3 /usr/bin/python

WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN python3 -m pip install --break-system-packages -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Start the application
CMD ["python3", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]