import * as jwt from 'jsonwebtoken';

export const createToken = (user, role) => {
  return { id: user.id, userEmail: user.email, userRole: role.name };
};

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

export const createJwt = ({ payload }) => {
  console.log(typeof process.env.JWT_EXPIRATION);

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.JWT_EXPIRATION),
  });
  return token;
};
