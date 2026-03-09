import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

// Using SignOptions['expiresIn'] ensures the type matches the library's expectation
const generateToken = (
    payload: object, 
    secret: Secret, 
    expiresIn: SignOptions['expiresIn'] 
) => {
    const token = jwt.sign(
        payload,
        secret,
        {
            algorithm: 'HS256',
            expiresIn
        }
    );

    return token;
};

const verifyToken = (token: string, secret: Secret) => {
    // jwt.verify returns string | JwtPayload; casting ensures it meets your return type
    return jwt.verify(token, secret) as JwtPayload;
}

export const jwtHelpers = {
    generateToken,
    verifyToken
};