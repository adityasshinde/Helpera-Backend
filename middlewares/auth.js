const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImcyYUBnbWFpbC5jb20iLCJpZCI6IjY0NGUwYWYyZjQyZTQzMjY0ZWFkNTU5MCIsImlhdCI6MTY4NTYyMzMyMCwiZXhwIjoxNjg1NjI2OTIwfQ.euh3QeKSxuYOo1dQl0ryy3DTgqlNrQmXzt7w9pmtRjY";
    //
    let decodedData;
    if (token) {
      decodedData = jwt.verify(token, "test");
      req.userId = decodedData?.id;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth;
