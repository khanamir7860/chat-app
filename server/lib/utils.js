import jwt from 'jsonwebtoken';
//fuction to generate token for user authentication
// it takes userId as an argument and returns a signed JWT token
// the token is signed with a secret key and expires in 30 days
// this token can be used to authenticate the user in subsequent requests   

export const generateToken = (userId) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
    return token;
}