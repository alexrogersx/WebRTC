import {Request, Response, ErrorRequestHandler} from "express";
import expressJwt from 'express-jwt'
import * as dotenv from "dotenv";
dotenv.config();


const secret = process.env.SECRET_KEY
if (!secret) throw new Error('Secret key not found')

export const authRestricted = expressJwt({
    secret, algorithms: ['HS256'], requestProperty: 'token', credentialsRequired: true
})

export const authNonRestricted = expressJwt({
    secret, algorithms: ['HS256'], requestProperty: 'token', credentialsRequired: false
})
export const authRefresh = expressJwt({
    secret,
    algorithms: ['HS256'],
    requestProperty: 'refreshToken',
    credentialsRequired: false,
    getToken: req => req.cookies.refreshToken
})

export const authErrorHandler = (err: ErrorRequestHandler, req:Request, res:Response) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
        console.log(err)
    }
}

