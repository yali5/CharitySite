# Start from a base image
FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# Install Node.js 20 using NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs

# Verify installation
RUN node -v && npm -v