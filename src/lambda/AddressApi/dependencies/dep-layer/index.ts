// import fetch from 'node-fetch';
const fetch = require('node-fetch');
interface FetchHelperResponse {
  data: any;
  errors: string | null;
}

export const fetchHelper = async (endpoint: string): Promise<FetchHelperResponse> => {
  try {
    const response = await fetch(endpoint, {
      method: "GET"
    });

    if (!response.ok) {
      throw new Error(response.status.toString());
    }

    const data = await response.json();

    // Throw an error if the response contains an error
    if (data?.error) {
      throw new Error(data.error.message);
    }

    return { data, errors: null };
  } catch (error) {
    return { data: null, errors: error.message };
  }
};
