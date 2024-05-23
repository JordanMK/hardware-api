import express, { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';

interface IRequest extends Request {
	id?: string;
}
const auth = (req: IRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'];
	if (!authHeader) {
		return res.status(401).json({ message: 'No token provided' });
	}
	if (authHeader.split(' ')[0] !== 'Bearer') {
		return res.status(401).json({ message: 'Invalid token' });
	}
	if (authHeader.split(' ')[1] == null) {
		return res.status(401).json({ message: 'No token provided' });
	}

	const token = (authHeader as string).split(' ')[1];
	jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET as string,
		{},
		(err, decoded) => {
			if (err) {
				return res
					.status(403)
					.json({ message: 'Failed to authenticate token' });
			}
			req.id = (decoded as JwtPayload).id;
			next();
		}
	);
};

export default auth;