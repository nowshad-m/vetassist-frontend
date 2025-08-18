# API Configuration for Vercel Deployment

## Current API Status

**Available API Endpoint:**
- ✅ **POST /api/recommendations** - Generates AI recommendations from case data
- 🔗 **Forwards to**: `${API_BASE}/analyze` (your Azure Container Apps API)

**Sample Data (Currently Used):**
- 📊 **Visits Data** - Loaded from sample data for dashboard and case pages
- 🔄 **Fallback System** - Sample data ensures the app works without a full API

## Environment Variables Required

To use your configured API for recommendations, you need to set these environment variables in your Vercel project:

### 1. API_BASE
- **Description**: The base URL of your backend API
- **Example**: `https://vetassist-api.wonderfulsmoke-897c2403.australiaeast.azurecontainerapps.io`
- **Required**: Yes (for recommendations API)

### 2. API_KEY
- **Description**: Your API key for authentication
- **Example**: `dev-secret-123`
- **Required**: Yes (for recommendations API)

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your `vetassist-frontend` project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Name**: `API_BASE`
   - **Value**: `https://vetassist-api.wonderfulsmoke-897c2403.australiaeast.azurecontainerapps.io`
   - **Environment**: Production (and Preview if needed)
5. Repeat for `API_KEY`:
   - **Name**: `API_KEY`
   - **Value**: `dev-secret-123`

## API Endpoints Expected

Your backend API should provide this endpoint:

### POST /analyze
- **Purpose**: Accepts case data and returns AI recommendations
- **Used by**: Case pages when generating recommendations
- **Request Body**: 
  ```json
  {
    "farm_id": "FARM-1023",
    "farm_name": "Green Valley Dairy", 
    "stock_class_id": "SC-001",
    "clinical_notes": "Dairy: high SCC, CMT+ quarters; subclinical mastitis."
  }
  ```
- **Headers**: `x-api-key: dev-secret-123`
- **Response**: AI-generated recommendations

## Data Flow

### Current Setup:
1. **Dashboard**: Shows sample visits data from `visits.json`
2. **Case Pages**: Load sample visit data for display
3. **Recommendations**: 
   - Frontend calls `/api/recommendations`
   - Frontend forwards to your API at `${API_BASE}/analyze`
   - Your API returns AI recommendations
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

- **"API_KEY environment variable not configured"**: Set the `API_KEY` variable
- **"API_BASE environment variable not configured"**: Set the `API_BASE` variable
- **"Upstream API error"**: Check your API URL and API key
- **CORS issues**: Ensure your API allows requests from your Vercel domain
- **Authentication errors**: Verify your `API_KEY` is correct
- **Sample data still showing**: Check that your API is responding correctly

## Next Steps

When you're ready to add more API endpoints:
1. Create `/api/visits` endpoint in your backend
2. Create `/api/visits/{id}` endpoint in your backend
3. Uncomment the API calls in the frontend code
4. Remove the sample data fallbacks
