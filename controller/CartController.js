const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const ensureAuthorization = require("../auth");

//장바구니 담기
const addToCart = (req, res) => {
  const { book_id, quantity } = req.body;
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
    let sql =
      "INSERT INTO cartItems (book_id,quantity, user_id) VALUES (?,?,?)";
    let values = [book_id, quantity, authorization.id];

    excuteQuery(sql, values, err);
  }
};

//장바구니 아이템 목록 조회
const getCartItems = (req, res) => {
  const { selected } = req.body;
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
    let sql =
      "SELECT cartItems.id, book_id, title, summary, quantity, price FROM cartItems LEFT JOIN books ON cartItems.book_id = books.id WHERE user_id = ?";
    let values = [authorization.id];
    if (selected) {
      sql += " AND cartItems.id IN(?)";
      values.push(selected);
    }
    excuteQuery(sql, values, err);
  }
};

//장바구니 도서 삭제
const removeCartItem = (req, res) => {
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
    let cartItemId = req.params.id; //cartItemId

    let sql = "DELETE FROM cartItems WHERE id = ?";

    let values = [cartItemId];

    excuteQuery(sql, values, err);
  }
};

const excuteQuery = (sql, values, err) => {
  conn.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  addToCart,
  getCartItems,
  removeCartItem,
};
