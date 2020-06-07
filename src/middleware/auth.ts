import bcrypt from 'bcryptjs'; 
const SECRET_KEY  = "secretkey23456";
import jwt from 'jsonwebtoken';

const auth = (req: any, res: any, next: any) => {
    console.log("checking authorizarion");
    
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, SECRET_KEY, function(err: any, decoded: any) {
        if (err)
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        res.useremail = decoded.email;
        next();
    });
}

export { auth }