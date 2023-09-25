"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const { fetchHelper } = require('./dependencies/dep-layer');
// Constants for the APIs
const locationUrl = "https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Geocoded_Addressing_Theme/FeatureServer/1/query?where=address+%3D+%27[ADDRESS]%27&outFields=*&f=geojson";
const suburbUrl = "https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Administrative_Boundaries_Theme/FeatureServer/2/query?geometry=[LONG]%2C+[LAT]&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=geoJSON";
const stateElectoralDistrictUrl = "https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Administrative_Boundaries_Theme/FeatureServer/4/query?geometry=[LONG]%2C+[LAT]&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=geoJSON";
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    try {
        const inputAddress = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.address;
        if (!inputAddress) {
            throw new Error('Address parameter is missing');
        }
        // ====================================================================================================
        // Call the NSW_Geocoded_Addressing_Theme API
        // ====================================================================================================
        // Replace the address with the input address
        // Replace the feature to force throw an error (if required)
        const finalLocationApiAddress = locationUrl.replace('[ADDRESS]', inputAddress);
        const { data: dataLocation, errors: errorsLocation } = yield fetchHelper(finalLocationApiAddress);
        // Error handling for API requests
        if (errorsLocation) {
            throw new Error(`Error fetching location: ${errorsLocation}`);
        }
        // Set latitude and longitude
        const longitude = (_e = (_d = (_c = (_b = dataLocation === null || dataLocation === void 0 ? void 0 : dataLocation.features) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.geometry) === null || _d === void 0 ? void 0 : _d.coordinates) === null || _e === void 0 ? void 0 : _e[0];
        const latitude = (_j = (_h = (_g = (_f = dataLocation === null || dataLocation === void 0 ? void 0 : dataLocation.features) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.geometry) === null || _h === void 0 ? void 0 : _h.coordinates) === null || _j === void 0 ? void 0 : _j[1];
        // Error handling for location not found
        if (!longitude || !latitude) {
            throw new Error('Location not found');
        }
        // Location (latitude and longitude) (NSW_Geocoded_Addressing_Theme)
        const location = { latitude, longitude };
        // ====================================================================================================
        // Call the NSW_Administrative_Boundaries_Theme APIs
        // ====================================================================================================
        // Get the suburb
        const finalSuburbApiAddress = suburbUrl.replace('[LAT]', latitude).replace('[LONG]', longitude);
        const { data: dataSuburb, errors: errorsSuburb } = yield fetchHelper(finalSuburbApiAddress);
        // Error handling for API requests
        if (errorsSuburb) {
            throw new Error(`Error fetching Suburb: ${errorsSuburb}`);
        }
        // Suburb name (NSW_Administrative_Boundaries_Theme - 2)
        const suburbName = (_m = (_l = (_k = dataSuburb === null || dataSuburb === void 0 ? void 0 : dataSuburb.features) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.properties) === null || _m === void 0 ? void 0 : _m.suburbname;
        // Error handling for suburb name not found
        if (!suburbName) {
            throw new Error('Suburb name not found');
        }
        // Get the state electoral district
        const finalStateElectoralDistrictApiAddress = stateElectoralDistrictUrl.replace('[LAT]', latitude).replace('[LONG]', longitude);
        const { data: dataStateElectoralDistrict, errors: errorsStateElectoralDistrict } = yield fetchHelper(finalStateElectoralDistrictApiAddress);
        if (errorsStateElectoralDistrict) {
            throw new Error(`Error fetching State Electoral District: ${errorsStateElectoralDistrict}`);
        }
        // State Electoral District name (NSW_Administrative_Boundaries_Theme - 4)
        const stateElectoralDistrictName = (_q = (_p = (_o = dataStateElectoralDistrict === null || dataStateElectoralDistrict === void 0 ? void 0 : dataStateElectoralDistrict.features) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.properties) === null || _q === void 0 ? void 0 : _q.districtname;
        // Error handling for state electoral district name not found
        if (!stateElectoralDistrictName) {
            throw new Error('State electoral district name not found');
        }
        // Create the object with the properties to return
        const finalReturn = { location, suburbName, stateElectoralDistrictName };
        // Stringify the response body
        const responseBody = JSON.stringify(finalReturn);
        const successResponse = {
            statusCode: 200,
            body: responseBody,
        };
        return successResponse;
    }
    catch (error) {
        // Stringify the response body
        const responseBody = JSON.stringify({ error: error.message });
        const errorResponse = {
            statusCode: 500,
            body: responseBody,
        };
        return errorResponse;
    }
});
exports.handler = handler;
