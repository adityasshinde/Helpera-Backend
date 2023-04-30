const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginUser = require("../models/details");

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    await loginUser
      .findOne({ email })
      .then(async (existingUser) => {
        const isPasswordCorrect = await bcrypt.compare(
          password,
          existingUser.password
        );
        if (!isPasswordCorrect) {
          return res.status(404).json({ message: "password is wrong" });
        }
        const token = jwt.sign(
          { email: existingUser.email, id: existingUser._id },
          "test",
          { expiresIn: "1h" }
        );
        res.status(200).json({ result: existingUser, token });
      })
      .catch(() => {
        return res.status(404).json({ message: "user doesnt exist" });
      });
  } catch {
    res.status(500).json({ message: "something went wrong" });
  }
};

const signup = async (req, res) => {
  const {
    username,
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    dob,
    address,
    phoneno,
  } = req.body;
  try {
    console.log(email);
    await loginUser
      .findOne({ email })
      .then(async (existingUser) => {
        return res.status(400).json({
          message: ` ${existingUser.username} and ${existingUser.email} user already exist`,
        });
      })
      .catch(async () => {
        console.log("user does'nt exist");
        if (password != confirmPassword) {
          console.log("password doesn't match");
          return res.status(400).json({ message: "password doesn't match" });
        }
        const haspassword = await bcrypt.hash(password, 12);
        console.log(haspassword);
        const result = await loginUser.create({
          username,
          email,
          password: haspassword,
          name: `${firstName}+${lastName}`,
          dob: dob,
          address: address,
          phoneno: phoneno,
        });
        console.log("user create");
        const token = jwt.sign(
          { email: result.email, id: result._id },
          "test",
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({ result, token });
      });
  } catch {
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = { signin, signup };
