const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const ensureAuthorization = require("../auth");

//(카테고리 별, 신간 여부) 전체 도서 목록 조회
const allBooks = (req, res) => {
  let allBooksRes = {};
  let { category_id, news, limit, currentPage } = req.query;
  // limit : page 당 도서 수       ex.3
  // currentPage : 현재 몇 페이지    ex. 1, 2, 3...
  // offset :                         0, 3, 6, 9, 12 ...
  //                                 limit * (currentPage-1)
  let offset = limit * (currentPage - 1);
  let sql =
    "SELECT *, (SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes FROM books";
  let values = [];
  //순서 중요
  if (category_id && news) {
    sql +=
      " WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    values = [category_id];
  } else if (category_id) {
    sql += " WHERE category_id=?";
    values = [category_id];
  } else if (news) {
    sql +=
      " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
  }

  sql += " LIMIT ? OFFSET ?";
  values.push(parseInt(limit), offset);

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      // return res.status(StatusCodes.BAD_REQUEST).end();
    }
    console.log(results);
    if (results.length) {
      results.map(function (result) {
        result.pubDate = result.pub_date;
        delete result.pub_date;
      });
      allBooksRes.books = results;
    } else return res.status(StatusCodes.NOT_FOUND).end();
  });
  sql = "SELECT count(*) FROM books";
  conn.query(sql, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    let pagination = {};
    let totalCount = results[0]["count(*)"];

    pagination.currentPage = parseInt(currentPage);
    pagination.totalCount = totalCount;

    allBooksRes.pagination = pagination;

    return res.status(StatusCodes.OK).json(allBooksRes);
  });
};

const bookDetail = (req, res) => {
  //로그인 상태가 아니면 => liked 빼고 보내주면 되고
  //로그인 상태이면 => ㅣiked 추가해서
  let authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. ",
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "로그인 토큰이 유효하지 않습니다. ",
    });
  } //중복 제거해야함.
  else if (authorization instanceof ReferenceError) {
    let book_id = req.params.id;

    let sql =
      "Select *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes from books LEFT JOIN category on books.category_id = category.category_id where books.id = ?";
    let values = [book_id];
    excuteQuery(sql, values, res);
  } else {
    let book_id = req.params.id;

    let sql =
      "Select *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,(Select count(*) from likes where user_id =? and liked_book_id = ?) as liked from books LEFT JOIN category on books.category_id = category.category_id where books.id = ?";
    let values = [authorization.id, book_id, book_id];
    excuteQuery(sql, values, res);
  }
};

const searchBooks = (req, res) => {
  let { keyword } = req.query;

  let sql =
    "SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books WHERE title LIKE ? OR author LIKE ?";
  let values = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`];
  excuteQuery(sql, values, res);
};

const excuteQuery = (sql, values, res) => {
  conn.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results[0]) return res.status(StatusCodes.OK).json(results[0]);
    else return res.status(StatusCodes.NOT_FOUND).end();
  });
};

module.exports = {
  allBooks,
  bookDetail,
  searchBooks,
};
