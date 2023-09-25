import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
const { fetchHelper } = require('./dependencies/dep-layer');

// Constants for the APIs
const locationUrl = 
  "https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Geocoded_Addressing_Theme/FeatureServer/1/query?where=address+%3D+%27[ADDRESS]%27&outFields=*&f=geojson";
const suburbUrl =
  "https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Administrative_Boundaries_Theme/FeatureServer/2/query?geometry=[LONG]%2C+[LAT]&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=geoJSON";
const stateElectoralDistrictUrl =
  "https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Administrative_Boundaries_Theme/FeatureServer/4/query?geometry=[LONG]%2C+[LAT]&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=geoJSON";

interface LocationData {
  latitude: number;
  longitude: number;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const inputAddress = event.queryStringParameters?.address;

    if (!inputAddress) {
      throw new Error('Address parameter is missing');
    }

    // ====================================================================================================
    // Call the NSW_Geocoded_Addressing_Theme API
    // ====================================================================================================
    // Replace the address with the input address
    // Replace the feature to force throw an error (if required)
    const finalLocationApiAddress = locationUrl.replace(
      '[ADDRESS]',
      inputAddress
    )

    const { data: dataLocation, errors: errorsLocation } =
      await fetchHelper(finalLocationApiAddress);

    // Error handling for API requests
    if (errorsLocation) {
      throw new Error(`Error fetching location: ${errorsLocation}`);
    }

    // Set latitude and longitude
    const longitude = dataLocation?.features?.[0]?.geometry?.coordinates?.[0];
    const latitude = dataLocation?.features?.[0]?.geometry?.coordinates?.[1];

    // Error handling for location not found
    if (!longitude || !latitude) {
      throw new Error('Location not found');
    }

    // Location (latitude and longitude) (NSW_Geocoded_Addressing_Theme)
    const location: LocationData = { latitude, longitude };

    // ====================================================================================================
    // Call the NSW_Administrative_Boundaries_Theme APIs
    // ====================================================================================================
    // Get the suburb
    const finalSuburbApiAddress = suburbUrl.replace('[LAT]', latitude).replace('[LONG]', longitude);
    const { data: dataSuburb, errors: errorsSuburb } = await fetchHelper(finalSuburbApiAddress);

    // Error handling for API requests
    if (errorsSuburb) {
      throw new Error(`Error fetching Suburb: ${errorsSuburb}`);
    }

    // Suburb name (NSW_Administrative_Boundaries_Theme - 2)
    const suburbName = dataSuburb?.features?.[0]?.properties?.suburbname;

    // Error handling for suburb name not found
    if (!suburbName) {
      throw new Error('Suburb name not found');
    }

    // Get the state electoral district
    const finalStateElectoralDistrictApiAddress = stateElectoralDistrictUrl.replace('[LAT]', latitude).replace('[LONG]', longitude);
    const { data: dataStateElectoralDistrict, errors: errorsStateElectoralDistrict } = await fetchHelper(finalStateElectoralDistrictApiAddress);

    if (errorsStateElectoralDistrict) {
      throw new Error(`Error fetching State Electoral District: ${errorsStateElectoralDistrict}`);
    }

    // State Electoral District name (NSW_Administrative_Boundaries_Theme - 4)
    const stateElectoralDistrictName = dataStateElectoralDistrict?.features?.[0]?.properties?.districtname;

    // Error handling for state electoral district name not found
    if (!stateElectoralDistrictName) {
      throw new Error('State electoral district name not found');
    }

    // Create the object with the properties to return
    const finalReturn: {
      location: LocationData;
      suburbName: string;
      stateElectoralDistrictName: string;
    } = { location, suburbName, stateElectoralDistrictName };

    // Stringify the response body
    const responseBody = JSON.stringify(finalReturn);

    const successResponse: APIGatewayProxyResult = {
      statusCode: 200,
      body: responseBody,
    };

    return successResponse;
  } catch (error) {

    // Stringify the response body
    const responseBody = JSON.stringify({ error: error.message });
    const errorResponse: APIGatewayProxyResult = {
      statusCode: 500,
      body: responseBody,
    };

    return errorResponse;
  }
};
