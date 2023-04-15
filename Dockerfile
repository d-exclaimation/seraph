# -- Test --
FROM node:alpine as tester

# Create test directory
WORKDIR /test

# Copy package.json and package-lock.json
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy source code
COPY . .

# Test
RUN pnpm test:run


# -- Lint --
FROM node:alpine as linter

# Create test directory
WORKDIR /lint

# Copy package.json and package-lock.json
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy source code
COPY . .

# Lint
RUN pnpm lint

# -- Build --
FROM node:alpine as builder

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy source code
COPY . .

# Build
RUN pnpm build

CMD [ "echo 'Done'" ]