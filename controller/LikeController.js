const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const ensureAuthorization = require("../auth");

const addLike = (req, res) => {
  const book_id = req.params.id;

  let authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. ",
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "로그인 토큰이 유효하지 않습니다. ",
    });
  } else {
    let sql = "INSERT INTO likes (user_id,liked_book_id) VALUES (?,?)";
    let values = [authorization.id, book_id];

    executeQuery(sql, values, res); // 수정된 함수 이름
  }
};

const removeLike = (req, res) => {
  const book_id = req.params.id;
  let authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. ",
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "로그인 토큰이 유효하지 않습니다. ",
    });
  } else {
    let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?";
    let values = [authorization.id, book_id];

    executeQuery(sql, values, res); // 수정된 함수 이름
  }
};

const executeQuery = (sql, values, res) => {
  conn.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  addLike,
  removeLike,
  executeQuery,
};
