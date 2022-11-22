import jwt from "jsonwebtoken";

const generateToken = (id,name,email) => {
  return jwt.sign({id,name,email}, process.env.SECRET, {
    expiresIn: "1h",
  });
};

export default generateToken;
