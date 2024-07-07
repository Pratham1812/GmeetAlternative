import { Response } from 'express';
import jwt from 'jsonwebtoken';


const generateTokenAndSetCookie = (userId:any, res:Response) =>{
   const token = jwt.sign({userId},process.env.JWT_SECRET , {
       expiresIn:"15d"
   })

   res.cookie("jwt",token , {
       maxAge : 15 * 24 * 60 *60 * 1000, //in ms
       httpOnly: true, //prevents XSS attacks cross sit e scripting attacks
       sameSite: true, //prevents CSRF attacks 
       secure: process.env.NODE_ENV !== 'development',
   })

   return token;
}

export default generateTokenAndSetCookie;