const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Nzg4MmU4YmJhNWU0M2JkMGJmMmNiYyIsInJvbGUiOjE2LCJpYXQiOjE2ODU3MDA1NjEsImV4cCI6MTY4NTcwNDE2MX0.e9c6lkd4pTzNUR23ew2myyGldhohjIDp5kg72oma4CQ";
    //req.headers.authorization.split(" ")[1];
    //  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NGUwYWYyZjQyZTQzMjY0ZWFkNTU5MCIsInJvbGUiOjgsImlhdCI6MTY4NTYyNjA3MCwiZXhwIjoxNjg1NjI5NjcwfQ.O_q4nIUp9thuohlZ_clzdjMSzkQ96sjzAgKYUbHwsqQ";
    //req.headers.authorization.split(" ")[1];
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
