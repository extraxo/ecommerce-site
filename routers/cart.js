const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("cart", { cart: req.session.cart || [] });
});

module.exports = router;