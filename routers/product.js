const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/kits/:kitSlug", productController.getKitSlug);

router.get("/boots/:bootSlug", productController.getBootSlug);

router.get("/other/:otherSlug", productController.getOtherSlug);

module.exports = router;
