"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockEvent = void 0;
const createMockEvent = (address) => {
    return {
        body: null,
        headers: {},
        multiValueHeaders: {},
        httpMethod: "GET",
        path: null,
        queryStringParameters: {
            address: address,
        },
        isBase64Encoded: false,
        pathParameters: {},
        multiValueQueryStringParameters: {},
        stageVariables: {},
        requestContext: {
            accountId: null,
            resourceId: null,
            stage: null,
            requestId: null,
            requestTime: null,
            requestTimeEpoch: null,
            identity: {
                cognitoIdentityPoolId: null,
                accountId: null,
                cognitoIdentityId: null,
                caller: null,
                apiKey: null,
                sourceIp: null,
                cognitoAuthenticationType: null,
                cognitoAuthenticationProvider: null,
                userArn: null,
                userAgent: null,
                user: null,
                accessKey: null,
                apiKeyId: null,
                clientCert: null,
                principalOrgId: null,
            },
            authorizer: {
                principalId: null,
            },
            domainName: null,
            eventType: null,
            apiId: null,
            protocol: null,
            httpMethod: null,
            path: null,
            resourcePath: null,
        },
        resource: null,
    };
};
exports.createMockEvent = createMockEvent;
