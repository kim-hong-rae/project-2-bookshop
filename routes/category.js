const express = require("express");
const { allCategory } = require("../controller/CategoryController");

const router = express.Router();

router.use(express.json());

router.get("/", allCategory);

module.exports = router;
