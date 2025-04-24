const asyncHandler = require("express-async-handler");

exports.getCart = asyncHandler(async (req, res) => {
    res.render("cart", { cart: req.session.cart || [] });
});