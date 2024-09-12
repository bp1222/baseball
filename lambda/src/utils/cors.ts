import { APIGatewayProxyEvent } from 'aws-lambda';

const GetCorsHeaders = (event : APIGatewayProxyEvent) => {
    const defaultOrigin = "https://" + process.env.FQDN;
    const allowedOrigins = [
        "https://(www.)?" + process.env.FQDN,
        "http://localhost:[0-9]*"
    ];
    const origin = event.headers.Origin || event.headers.origin;
    let goodOrigin = false;

    if (origin) {
        allowedOrigins.forEach(allowedOrigin => {
            if (!goodOrigin && origin.match(allowedOrigin)) {
                goodOrigin = true;
            }
        });
    }

    return {
        "Access-Control-Allow-Headers": "Accept,Accept-Language,Content-Language,Content-Type",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Origin": goodOrigin ? origin : defaultOrigin,
    };
}

export default GetCorsHeaders