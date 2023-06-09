const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { loginUser, CreateCampaign } = require("../models/details");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dvbkkyuso",
  api_key: "373452323229221",
  api_secret: "aIyjinhb8eG2pWkKduB0ldSQlKg",
});

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
        console.log(existingUser.role);

        let newResult = JSON.parse(JSON.stringify(existingUser));
        delete newResult.password;
        delete newResult.SecurityQuestion;

        const token = jwt.sign(
          {
            id: existingUser._id,
            role: existingUser.role,
          },
          "test",
          { expiresIn: "1h" }
        );
        res.status(200).json({ newResult, token });
      })
      .catch(() => {
        return res.status(404).json({ message: "user doesnt exist" });
      });
  } catch {
    res.status(500).json({ message: "something went wrong" });
  }
};

const signup = async (req, res) => {
  if (req.body.role === 8) {
    await signUpOrg(req, res);
    return;
  }
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
    securityQuestion,
    role,
  } = req.body;
  try {
    console.log(email);
    await loginUser
      .findOne({
        username: username,
      })
      .then(async (existingUser) => {
        return res.status(400).json({
          message: ` ${existingUser.username} and ${existingUser.email} user already exist`,
        });
      })
      .catch(async (newuser) => {
        console.log(newuser);
        console.log("user doesn't exist");
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
        var year = parseInt(birthdate[0]);
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
          console.log(newuser);
          const result = await loginUser.create({
            username,
            email,
            password: haspassword,
            name: `${firstName} ${lastName}`,
            dob: dob,
            Age: dif,
            address: address,
            phoneNo: phoneno,
            SecurityQuestion: securityQuestion,
            role: role,
          });

          let newResult = JSON.parse(JSON.stringify(result));
          delete newResult.password;
          delete newResult.SecurityQuestion;

          console.log("user create");
          console.log(newuser);
          const token = jwt.sign(
            {
              id: result._id,
              role: result.role,
            },
            "test",
            {
              expiresIn: "1h",
            }
          );

          res.status(200).json({ newResult, token });
        } else {
          res.status(500).json({ message: "something is wrong" });
        }
      });
  } catch {
    console.log("error is comming up in catch bloack");
    res.status(500).json({ message: "something went wrong" });
  }
};

const changePassword = async (req, res) => {
  const { email, password, securityQuestion } = req.body;
  const hashPassword = await bcrypt.hash(password, 12);
  try {
    console.log(email);
    loginUser
      .findOneAndUpdate(
        { $and: [{ email: email }, { SecurityQuestion: securityQuestion }] },
        { password: hashPassword }
      )
      .then((user) => {
        res.status(200).json({ password: hashPassword });
        //        console.log(bcrypt(hashPassword));
      });
  } catch {}
};

const userDetail = async(req, res) => {
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }
  try {
    const userinfo=await loginUser.findById(req.userId);
    let newResult = JSON.parse(JSON.stringify(userinfo));
    delete newResult.password;
      delete newResult.SecurityQuestion;
      res.status(200).json({ newResult });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const signUpOrg = async (req, res) => {
  const {
    username,
    email,
    password,
    confirmPassword,
    organizationName,
    address,
    phoneno,
    role,
    securityQuestion,
  } = req.body;
  try {
    console.log(email);
    await loginUser
      .findOne({
        username: username,
      })
      .then(async (existingUser) => {
        return res.status(400).json({
          message: ` ${existingUser.username} and ${existingUser.email} user already exist`,
        });
      })
      .catch(async (newuser) => {
        console.log("user doesn't exist");
        if (password != confirmPassword) {
          console.log("password doesn't match");
          return res.status(400).json({ message: "password doesn't match" });
        }
        const haspassword = await bcrypt.hash(password, 12);
        console.log(haspassword);

        console.log(phoneno.toString().length);
        console.log(username.length);
        if (phoneno.toString().length === 10 && username.length >= 4) {
          const result = await loginUser.create({
            username,
            email,
            password: haspassword,
            name: organizationName,
            address: address,
            phoneNo: phoneno,
            SecurityQuestion: securityQuestion,
            role: role,
          });

          let newResult = JSON.parse(JSON.stringify(result));
          delete newResult.password;
          delete newResult.SecurityQuestion;

          console.log("user create");
          console.log(result);
          const token = jwt.sign(
            { id: result._id, role: result.role },
            "test",
            {
              expiresIn: "1h",
            }
          );
          res.status(200).json({ newResult, token });
        } else {
          res.status(500).json({ message: "something is wrong" });
        }
      });
  } catch {
    res.status(500).json({ message: "something went wrong" });
  }
};

const uploadUserImage = (req, res) => {
  let dataEntry = {
    asset_id: "",
    public_id: "",
    url: "",
  };
  const filePath = req.body.filePath;
  const ext = filePath.slice(-3);
  if (
    ext == "png" ||
    ext == "jpg" ||
    ext == "peg" ||
    ext == "gif" ||
    ext == "svg"
  ) {
    response = cloudinary.uploader.upload(filePath).then((data) => {
      dataEntry.asset_id = data.asset_id;
      dataEntry.public_id = data.public_id;
      dataEntry.url = data.secure_url;
      console.log(data);
      console.log(dataEntry);
      const uID = req.userId;
      console.log(uID);
      loginUser
        .findByIdAndUpdate(
          { _id: uID },
          {
            image_asset_id: dataEntry.asset_id,
            image_public_id: dataEntry.public_id,
            image_url: dataEntry.url,
          },
          { new: true }
        )
        .then(() => {
          console.log("Uploaded");
        });
      return res.status(200).json({ message: "Image Uploaded Successfully" });
    });
  } else {
    return res.status(403).json({ message: "Invalid File Type" });
  }
};

const editUserImage = async (req, res) => {
  const uID = req.userId;
  const filePath = req.body.filePath;
  const ext = filePath.slice(-3);
  let dataEntry = {
    url: "",
  };
  if (
    ext == "png" ||
    ext == "jpg" ||
    ext == "peg" ||
    ext == "gif" ||
    ext == "svg"
  ) {
    await CreateCampaign.findById(uID).then((camp) => {
      cloudinary.uploader
        .upload(filePath, {
          public_id: camp.image_public_id,
          asset_id: camp.image_asset_id,
        })
        .then((data) => {
          dataEntry.url = data.secure_url;
          CreateCampaign.findByIdAndUpdate(
            { _id: uID },
            { image_url: dataEntry.url },
            { new: true }
          ).then(() => {
            return res
              .status(200)
              .json({ message: "Image Uploaded Successfully" });
          });
        });
    });
  } else {
    return res.status(403).json({ message: "Invalid File Type" });
  }
};

module.exports = {
  signin,
  signup,
  changePassword,
  userDetail,
  uploadUserImage,
  editUserImage,
};

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
