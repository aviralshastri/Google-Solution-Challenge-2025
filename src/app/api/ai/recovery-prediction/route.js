import { GoogleAuth } from 'google-auth-library';

export async function POST(req) {
  try {
    const body = await req.json();
    const serviceAccountContent = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    
    const auth = new GoogleAuth({
      credentials: serviceAccountContent,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    const projectId = process.env.PROJECT_ID || serviceAccountContent.project_id;
    const location = process.env.LOCATION || 'us-central1';
    const endpointId = process.env.ENDPOINT_ID;
    
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/endpoints/${endpointId}:predict`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        instances: [body.inputData]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Vertex AI API error: ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    
    return Response.json({
      success: true,
      prediction: result.predictions[0]
    });
    
  } catch (error) {
    console.error('Prediction error:', error);
    
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}