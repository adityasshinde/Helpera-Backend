const jwt = require("jsonwebtoken");
const roles = async (req, res, next) => {
  try {
    const token =req.headers.authorization.split(" ")[1];
    let decodedData;
    if (token) {
      decodedData = jwt.verify(token, "test");
      req.role = decodedData?.role;
      console.log(decodedData?.role);
      console.log(decodedData);
    }
    if (req.role == 8) {
      console.log("good");
      next();
    } else {
      res.status(309).json({ message: "sorry not authorized" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = roles;
