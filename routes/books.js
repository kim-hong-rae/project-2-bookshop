const express = require("express");
const {
  allBooks,
  bookDetail,
  searchBooks,
} = require("../controller/BookController");

const router = express.Router();

router.use(express.json());

router.get("/", allBooks);
router.get("/search", searchBooks);
router.get("/:id", bookDetail);

module.exports = router;
