const { verifyToken } = require('../helpers/jwt.js');

const auth = (request, response, next) => {
    console.log('Auth initiated!');
    const access_token = request.headers.access_token;

    if (access_token) {
        try {
            let verify_token = verifyToken(access_token);
            request.userData = verify_token;
            next();
        } catch(err) {
            response.status(401).json({
                status: false,
                message: 'Access token wasn\'t authenticated'
            });
        }
    } else {
        response.status(500).json({
            status: false,
            message: 'Access token wasn\'t found'
        });
    }
}

module.exports = { auth };