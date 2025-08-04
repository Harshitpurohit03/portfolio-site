const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

exports.handler = async (event) => {
    const reqPath = event.rawPath === "/" ? "/index.html" : event.rawPath;

    const filePath = path.join(__dirname, 'public', reqPath);

    try {
        const fileContent = fs.readFileSync(filePath);
        const contentType = mime.lookup(filePath) || 'text/plain';

        return {
            statusCode: 200,
            headers: {
                'Content-Type': contentType,
            },
            body: fileContent.toString('base64'),
            isBase64Encoded: true,
        };
    } catch (err) {
        return {
            statusCode: 404,
            headers: { 'Content-Type': 'text/plain' },
            body: '404 - File Not Found',
        };
    }
};

