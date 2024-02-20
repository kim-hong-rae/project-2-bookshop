const express = require("express");
const { allBooks, bookDetail } = require("../controller/BookController");

const router = express.Router();

router.use(express.json());

router.get("/", allBooks);
router.get("/:id", bookDetail);

module.exports = router;
