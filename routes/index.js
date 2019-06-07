var express = require("express"),
    router = express.Router();

router.get("/", (request, response) => {
	response.render("landing");
})

module.exports = router;