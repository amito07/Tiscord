export const Login = (req, res, next) => {
  const { email, password } = req.body;
  res.send({ message: { email: email, password: password } });
};

export const Signup = (req, res, next) => {
    res.send(process.env.PORT)
}