const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const { StatusCodes } = require("http-status-code");

const { body, param, validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty) {
    return next();
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json(err.array());
  }
};
router.post(
  "/join",
  [
    body("email").notEmpty().isEmail().withMessage("email값 필요!"),
    body("password").notEmpty().isString().withMessage("비밀번호 확인 필요!"),
    validate,
  ],
  (req, res) => {
    const { email, password } = req.body;
    let sql = "INSERT INTO users (email,password) VALUES (?,?)";

    let values = [email, password];

    conn.query(sql, values, (err, results) => {
      if (err) {
        return res.status(400).end();
      }
      res.status(201).json(results);
    });

    res.json({
      message: "회원가입",
    });
  }
);

router.post("/login", (req, res) => {
  res.json({
    message: "로그인",
  });
});
router.post("/reset", (req, res) => {
  res.json({
    message: "비밀번호 초기화 요청",
  });
});

router.put("/reset", (req, res) => {
  res.json({
    message: "비밀번호 변경",
  });
});

module.exports = router;
