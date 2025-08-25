# Fake Banking App Detector

A comprehensive tool to detect fake banking applications using AI/ML analysis.

## Architecture

This project consists of:
- **Backend**: FastAPI server for APK analysis
- **Frontend**: React-based web interface for user interaction

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## API Endpoints

- **POST** `/api/analyze` - Analyze APK file
- **GET** `/health` - Health check endpoint

## Usage

1. Ensure both backend and frontend servers are running
2. Open the frontend in your browser
3. Upload an APK file to analyze
4. View the detailed analysis results

## Features

- APK file analysis
- Risk score calculation
- Suspicious permissions detection
- Network call analysis
- Certificate validation
- Real-time results display

## Technology Stack

- **Backend**: FastAPI, Python
- **Frontend**: React, Vite, Tailwind CSS
- **Styling**: Tailwind CSS, Shadcn/UI components