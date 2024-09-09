const bcrypt = require("bcrypt");
const signUpRouter = require("express").Router();
const User = require("../models/user");

signUpRouter.post("/", async (request, response, next) => {
  const { username, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = signUpRouter;
