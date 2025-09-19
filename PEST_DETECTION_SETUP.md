# Pest Detection Setup Guide

## Overview
The pest detection feature now integrates with your FastAPI backend to provide real-time pest identification and detailed pesticide recommendations using AI.

## API Integration

### Backend Requirements
Your FastAPI server should have the following endpoint:

**Endpoint:** `POST /pest/detect`

**Request:** Multipart form data with image file
```python
# Example FastAPI endpoint
@app.post("/pest/detect")
async def detect_pest(file: UploadFile = File(...)):
    # Your pest detection logic here
    # Should return text in the exact format:
    return """
    Pest Detected: wheat blossom midge
    
    Recommended Pesticides:
    1. Malathion
    2. Dimethoate
    3. Lambda-Cyhalothrin
    """
```

**Response Format:**
```
Pest Detected: [pest_name]

Recommended Pesticides:
1. [pesticide_1]
2. [pesticide_2]
3. [pesticide_3]
```

### Environment Configuration

Create a `.env` file in your project root:
```env
EXPO_PUBLIC_FASTAPI_API_URL=http://localhost:8000/api
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

## How It Works

1. **Image Capture**: User takes a photo of the pest using the camera
2. **API Call**: Image is sent to your FastAPI backend for pest detection
3. **Pest Identification**: Backend returns pest name and 3 recommended pesticides
4. **LLM Enhancement**: The LLM service generates detailed information including:
   - Pest description and behavior
   - Damage symptoms
   - Detailed pesticide information (dosage, application, safety, pricing)
   - Effectiveness ratings
   - Safety precautions

## Features

### Dynamic Data
- Real pest detection from your FastAPI backend
- AI-generated detailed pesticide information
- Fallback to sample data if API is unavailable

### Error Handling
- Graceful API failure handling
- User-friendly error messages
- Automatic fallback to mock data

### User Experience
- Loading states during analysis
- Clear error indicators
- API connection test button (wifi icon in camera)
- Retry functionality

## Testing

### API Connection Test
- Tap the wifi icon in the camera view to test API connectivity
- Shows success/error alerts for debugging

### Debugging
- Check console logs for detailed API call information
- Error messages are displayed to users when API fails
- Sample data is shown when API is unavailable

## File Structure

```
app/
├── utils/
│   ├── pestApiService.ts     # API integration service
│   └── llmService.ts         # LLM integration for detailed info
├── pest-detection.tsx        # Main pest detection component
└── app.config.js            # Configuration with API URLs
```

## API Service Features

- Automatic response parsing
- Robust error handling
- Connection testing
- FormData file upload
- Environment-based configuration

## LLM Integration

The LLM service enhances the basic API response with:
- Detailed pest descriptions
- Comprehensive damage information
- Complete pesticide details
- Safety precautions
- Pricing information
- Effectiveness ratings

This creates a complete pest management solution that combines computer vision with AI-generated agricultural expertise.
