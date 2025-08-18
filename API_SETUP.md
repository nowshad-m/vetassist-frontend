# API Configuration for Vercel Deployment

## Current API Status

**Available API Endpoint:**
- ✅ **POST /api/recommendations** - Generates AI recommendations from case data

**Sample Data (Currently Used):**
- 📊 **Visits Data** - Loaded from sample data for dashboard and case pages
- 🔄 **Fallback System** - Sample data ensures the app works without a full API

## Environment Variables Required

To use your configured API for recommendations, you need to set these environment variables in your Vercel project:

### 1. API_BASE
- **Description**: The base URL of your backend API
- **Example**: `https://your-api-domain.com/api/v1`
- **Required**: Yes (for recommendations API)

### 2. API_TOKEN
- **Description**: Authentication token for your API
- **Example**: `your_api_token_here`
- **Required**: Yes (for recommendations API)

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your `vetassist-frontend` project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Name**: `API_BASE`
   - **Value**: Your actual API base URL
   - **Environment**: Production (and Preview if needed)
5. Repeat for `API_TOKEN`

## API Endpoints Expected

Your backend API should provide this endpoint:

### POST /recommendations
- **Purpose**: Accepts case data and returns AI recommendations
- **Used by**: Case pages when generating recommendations
- **Request Body**: `CaseRequest` object with farm info and clinical notes
- **Response**: `RecommendationResponse` with AI-generated recommendations

## Data Flow

### Current Setup:
1. **Dashboard**: Shows sample visits data from `visits.json`
2. **Case Pages**: Load sample visit data for display
3. **Recommendations**: Call your API to generate AI recommendations
4. **Fallback**: If API fails, show error messages with retry options

### Future Setup (When You Add More APIs):
1. **Dashboard**: Fetch real visits from `/api/visits`
2. **Case Pages**: Fetch real visit data from `/api/visits/{id}`
3. **Recommendations**: Continue using your current API

## Testing

After setting environment variables:
1. Redeploy your Vercel project
2. Go to a case page (e.g., `/case/V-1001`)
3. Add clinical notes and click "Generate Recommendations"
4. Check browser console for API calls to your backend
5. Verify recommendations are coming from your API, not sample data

## Troubleshooting

- **"API_BASE environment variable not configured"**: Set the `API_BASE` variable
- **"Upstream API error"**: Check your API URL and token
- **CORS issues**: Ensure your API allows requests from your Vercel domain
- **Authentication errors**: Verify your `API_TOKEN` is correct
- **Sample data still showing**: Check that your API is responding correctly

## Next Steps

When you're ready to add more API endpoints:
1. Create `/api/visits` endpoint in your backend
2. Create `/api/visits/{id}` endpoint in your backend
3. Uncomment the API calls in the frontend code
4. Remove the sample data fallbacks
