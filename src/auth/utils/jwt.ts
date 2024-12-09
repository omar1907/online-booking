import * as jwt from 'jsonwebtoken';

export const createPayload = (user, role) => {
  return { id: user.id, userEmail: user.email, userRole: role.name };
};

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

export const createJwtToken = (val) => {
  console.log(typeof process.env.JWT_EXPIRATION);

  const token = jwt.sign(val, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.JWT_EXPIRATION),
  });
  return token;
};
