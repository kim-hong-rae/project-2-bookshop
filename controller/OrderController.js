//const conn = require("../mariadb");
const mariadb = require("mysql2/promise");
const { StatusCodes } = require("http-status-codes");

const order = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "BookShop",
    port: 3307,
    dateStrings: true,
  });

  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } =
    req.body;

  //delivery 테이블 삽입
  let sql =
    "INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)";
  let values = [delivery.address, delivery.receiver, delivery.contact];

  let [results] = await conn.execute(sql, values);

  let delivery_id = results.insertId;

  //items를 가지고, 장바구니에서 book_id, quantity 조회
  sql = "SELECT book_id, quantity FROM cartItems WHERE id IN (?)";
  let [orderItems, fileds] = await conn.query(sql, [items]);

  //orders 테이블 삽입
  let order_id = results.insertId;

  //orderedBook 테이블 삽입

  sql = "INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?";

  values = [];
  orderItems.forEach((item) => {
    values.push([order_id, item.book_id, item.quantity]);
  });

  results = await conn.query(sql, [values]);

  let result = await deleteCartItems(conn, items);

  return res.status(StatusCodes.OK).json(result);

  // [results] = conn.query(sql, [values]);

  // return res.status(StatusCodes.OK).json(results);
};

const deleteCartItems = async (conn) => {
  let sql = "DELETE FROM cartItems WHERE id IN (?)";
  let result = await conn.query(sql, [items]);
  return result;
};

const getOrders = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "BookShop",
    port: 3307,
    dateStrings: true,
  });

  let sql =
    "SELECT orders.id, created_at, address, receiver, contact, book_title, total_price, total_quantity FROM orders LEFT JOIN delivery ON orders.delivery_id = delivery.id;";
  let [rows, fileds] = await conn.query(sql);
  return res.status(StatusCodes.OK).json(rows);
};

const getOrderDetail = async (req, res) => {
  const { id } = req.params;
  const conn = await mariadb.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "BookShop",
    port: 3307,
    dateStrings: true,
  });

  let sql =
    "SELECT book_id, title, author, price, quantity FROM orderedBook LEFT JOIN books ON orderedBook.book_id = books.id WHERE order_id=?";
  let [rows, fileds] = await conn.query(sql, [id]); // 배열로 넣는 것 주의.
  return res.status(StatusCodes.OK).json(rows);
};

module.exports = {
  order,
  getOrders,
  getOrderDetail,
};
