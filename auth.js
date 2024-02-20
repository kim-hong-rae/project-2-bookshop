const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const ensureAuthorization = (req, res) => {
  try {
    let recievedJwt = req.headers["authorization"];

    console.log(recievedJwt);

    let decodedJwt = jwt.verify(recievedJwt, process.env.PRIVATE_KEY);

    console.log(decodedJwt);

    return decodedJwt;
  } catch (err) {
    console.log(err.name);
    console.log(err.message);

    return err;
  }
};

module.exports = ensureAuthorization;
