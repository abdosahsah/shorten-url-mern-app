const router = require("express").Router();
const {
  getUrls,
  getUrl,
  addUrl,
  updateUrl,
  deleteUrl,
} = require("../controllers/urlsController");
const isAuth = require("../middleware/isAuthenticate");

router.get("/", isAuth, getUrls);

router.get("/:id", isAuth, getUrl);

router.post("/add", isAuth, addUrl);

router.put("/:id/update", isAuth, updateUrl);

router.delete("/:id/delete", isAuth, deleteUrl);

module.exports = router;
