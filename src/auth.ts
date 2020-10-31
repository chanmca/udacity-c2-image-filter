import { Router, Request, Response } from 'express';
import { NextFunction } from 'connect';
import * as jwt from 'jsonwebtoken';
import { config } from './config';

export function generateJWT(decoded: string): string {
  return jwt.sign({"body": decoded}, config.jwt.secret);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  console.log(config.jwt.decoded);
    console.log(generateJWT(config.jwt.decoded));
    if (!req.headers || !req.headers.authorization){
        return res.status(401).send({ message: 'No authorization headers.' });
    }

    const token_bearer = req.headers.authorization.split(' ');
    console.log("Token Bearer\t:\t" + token_bearer);
    if(token_bearer.length != 2){
        return res.status(401).send({ message: 'Malformed token.' });
    }
    
    const token = token_bearer[1];
    console.log("Token\t:\t" + token);
    return jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
      }
      console.log(decoded);
      return next();
        
    });
}