const express = require("express");
const router = express.Router();
const conn = require("../mariadb");

const { body, param, validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty) {
    return next();
  } else {
    return res.status(400).json(err.array());
  }
};
router.post("/join", (req, res) => {
  res.json({
    message: "회원가입",
  });
});

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
