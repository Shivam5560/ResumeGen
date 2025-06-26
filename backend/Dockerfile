FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    bash \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Set working directory
WORKDIR /backend

# Copy scripts first
COPY scripts/ ./scripts/

# Run LaTeX installation script
ENV RAILWAY_ENVIRONMENT=docker
RUN chmod +x ./scripts/install-latex-packages.sh && \
    ./scripts/install-latex-packages.sh

# Copy requirements and install Python dependencies
COPY /backend/requirements.txt .
RUN source /opt/venv/bin/activate && pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create a non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /backend
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start the application
CMD ["/bin/bash", "-c", "source /opt/venv/bin/activate && python backend/main.py"]
