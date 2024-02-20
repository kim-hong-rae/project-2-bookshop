const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const ensureAuthorization = (req, res) => {
  try {
    let recievedJwt = req.headers["authorization"];

    if (recievedJwt) {
      let decodedJwt = jwt.verify(recievedJwt, process.env.PRIVATE_KEY);
      console.log(decodedJwt);
      return decodedJwt;
    } else {
      throw new ReferenceError("jwt mus be provided");
    }
  } catch (err) {
    console.log(err.name);
    console.log(err.message);

    return err;
  }
};

module.exports = ensureAuthorization;
