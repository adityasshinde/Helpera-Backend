const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
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

// const API=axios.create({baseURL:'http://localhost:5000'})
// API.interceptors.request.use((req)=>{
//   if(localStorage.getItem('profile')){
//     req.headers.Authorization=`Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
//   }
//   return req;
// })
