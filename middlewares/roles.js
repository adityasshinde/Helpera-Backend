const jwt = require("jsonwebtoken");
const roles = async (req, res, next) => {
  try {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NGUwYWYyZjQyZTQzMjY0ZWFkNTU5MCIsInJvbGUiOjgsImlhdCI6MTY4NTg1MDgwNSwiZXhwIjoxNjg1ODU0NDA1fQ.6tbCjCxL2BU4JVuljsbr0HoGRL4nGKWrXXjEaCfm6WE";
    //req.headers.authorization.split(" ")[1];
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
