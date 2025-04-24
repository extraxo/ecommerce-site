const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const cloudinary = require("../server/config/cloudinaryConfig");

router.get("/", adminController.getAdminPage);
 
router.post("/newproduct", cloudinary.single("image"),adminController.newProduct);

router.post("/delete/:id", adminController.deleteProduct);

router.get("/edit/:id", adminController.editProduct);

router.patch("/update/:id", cloudinary.single("image"), adminController.updateProduct);

router.post("/orders", adminController.submitOrder);

module.exports = router;