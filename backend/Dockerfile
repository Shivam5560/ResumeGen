FROM python:3.10-slim

# Run LaTeX installation script
ENV RAILWAY_ENVIRONMENT=docker
RUN echo "Current working directory: $(pwd)"
# RUN scripts/install-latex-packages.sh

# Copy requirements and install Python dependencies
RUN pip install -r requirements.txt

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start the application
CMD ["python main.py"]
