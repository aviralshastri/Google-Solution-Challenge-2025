import { GoogleAuth } from 'google-auth-library';

export async function POST(req) {
  try {
    // Print the raw request
    console.log('Raw request:', req);
    
    // Parse and log the request body
    const body = await req.json();
    
    const serviceAccountContent = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    
    const auth = new GoogleAuth({
      credentials: serviceAccountContent,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    console.log('Access token obtained:', accessToken.token ? 'Yes (token hidden for security)' : 'No');
    
    const projectId = process.env.PROJECT_ID || serviceAccountContent.project_id;
    const location = process.env.LOCATION || 'us-central1';
    const endpointId = process.env.ENDPOINT_ID;
    
    
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/endpoints/${endpointId}:predict`;
    
    // Log what we're sending to Vertex AI
    const requestBody = {
      instances: [body.inputData]
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    // Log response status
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', JSON.stringify(errorData, null, 2));
      throw new Error(`Vertex AI API error: ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    
    // Process the prediction results
    let predictedDays = processPrediction(result);

    
    return Response.json({
      success: true,
      prediction: result.predictions[0],
      predictedDays: predictedDays,
      rawResponse: result // Include the full response in the return value
    });
    
  } catch (error) {
    console.error('Prediction error details:', error);
    console.error('Error stack:', error.stack);
    
    return Response.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

/**
 * Process the prediction result to find the predicted number of days
 * @param {Object} result - The API response from Vertex AI
 * @returns {string|number} - The predicted class (days)
 */
function processPrediction(result) {
  if (!result.predictions || !result.predictions[0] || 
      !result.predictions[0].scores || !result.predictions[0].classes) {
    throw new Error('Invalid prediction result format');
  }
  
  const prediction = result.predictions[0];
  const scores = prediction.scores;
  const classes = prediction.classes;
  
  // Find the index of the maximum score
  let maxIndex = 0;
  let maxScore = scores[0];
  
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > maxScore) {
      maxScore = scores[i];
      maxIndex = i;
    }
  }
  
  // Ensure that index exists in classes array
  if (maxIndex >= classes.length) {
    console.warn(`Max score index (${maxIndex}) is out of bounds for classes array (length: ${classes.length})`);
    // In case of mismatch between scores and classes length, return the max score value
    return `Score: ${maxScore}`;
  }
  
  // Return the corresponding class
  return classes[maxIndex];
}