const User = require("../models/users-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const createUser = async (userData) => {
  /*
        userData = {
            username: "exampleUser123",
            password: "examplePass319280"
        }

    */
  try {
    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // create a user in our database
    // first would should create a variable that stores the username and the hashed password
    const secureUserData = {
      username: userData.username,
      password: hashedPassword,
    };

    const newUser = await User.create(secureUserData);

    return newUser;
  } catch (error) {
    throw error;
  }
};
// in router
// createUser(req.body) -> userData

const loginUser = async (userData) => {
  try {
    // verify that username exists in db
    const user = await User.findOne({ username: userData.username });

    if (!user) {
      throw "User not found";
    }

    // compare the incoming password with the hashed password in the database
    // db.compare(incomingPassword, hashedPassword)
    // incoming: userData.password
    // hashed: user.password
    const isCorrectPassword = await bcrypt.compare(
      userData.password,
      user.password,
    );

    if (!isCorrectPassword) {
      throw "Passwords do not match";
    }

    // at this point in the code, if an error has not been thrown, we know the user has successfully logged in

    // we can now setup our JWT token for the user
    // jwt.sign({ payload }, secretKey)
    // payload - data that we want to store with the token (can be whatever you want, typically for private user information)
    //secretkey is your app's exclusice key used to sign the token when the user tries to access a protected route (your app's signature)(can henerate these online !)
    const token = jwt.sign({ username: user.name }, process.env.JWT_SECRET_KEY);

    return { username: user.username, token: token };
  } catch (error) {
    throw error;
  }
};

module.exports = { createUser, loginUser };
