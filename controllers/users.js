const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { loginUser, CreateCampaign } = require("../models/details");

const signin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  try {
    await loginUser
      .findOne({ email })
      .then(async (existingUser) => {
        console.log(`existing user ${existingUser.email}`);
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
    sques,
    role,
  } = req.body;
  try {
    console.log(email);
    await loginUser
      .findOne({ username })
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

        console.log(phoneno.toString().length);
        console.log(username.length);
        console.log(typeof dob);
        var birthdate = dob.split("-");
        console.log(birthdate);
        var year = parseInt(birthdate[2]);
        console.log(typeof year, year);
        const today = new Date();
        let curYear = today.getFullYear();
        var dif = curYear - year;
        console.log(typeof dif, dif);
        // console.log(dobYear - year);
        if (
          phoneno.toString().length === 10 &&
          username.length >= 4 &&
          dif > 18
        ) {
          console.log("hello");
          const result = await loginUser.create({
            username,
            email,
            password: haspassword,
            name: `${firstName}+${lastName}`,
            dob: dob,
            address: address,
            phoneNo: phoneno,
            SecurityQuestion: sques,
            role: role,
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
        } else {
          res.status(500).json({ message: "something is wrong" });
        }
      });
  } catch {
    res.status(500).json({ message: "something went wrong" });
  }
};

const changePassword = async (req, res) => {
  const { email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 12);
  try {
    console.log(email);
    loginUser
      .findOneAndUpdate({ email: email }, { password: hashPassword })
      .then((user) => {
        res.status(200).json({ password: hashPassword });
        //        console.log(bcrypt(hashPassword));
      });
  } catch {}
};

const userDetail = (req, res) => {
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }
  try {
    loginUser.findById(req.userId).then((user) => {
      //CreateCampaign.findById({ $ne: id }).then((campaign) => {
      res.status(200).json({ user });
      // });
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { signin, signup, changePassword, userDetail };

// try {
//   loginUser
//     .findOneAndUpdate(
//       { email: email },
//       { password: hashPassword },
//       { new: true }
//     )
//     .then(() => {
//       res.status(200).json({ message: "password reset" });
//     })
//     .catch(() => {
//       res.status(404).json({ message: "user doesnt exist" });
//     });
// } catch {
//   res.status(500).status({ message: "something went wrong" });
// }
