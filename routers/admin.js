const express = require("express");
const router = express.Router();
const AllKits = require("../server/models/allkits");
const AllBoots = require("../server/models/allboots");
const AllOthers = require("../server/models/allothers");
const Kit = require("../server/models/kit");
const Boot = require("../server/models/boot");
const Other = require("../server/models/other");
const Order = require("../server/models/order");

router.get("/", async (req, res) => {
    try {
        const kits = await AllKits.find({});
        const boots = await AllBoots.find({});
        const others = await AllOthers.find({});
        
        const products = [...kits, ...boots, ...others];
        
        res.render("admin/admin", { products });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.post("/newproduct", async (req, res) => {
    try {
        const {
            name,
            subtitle,
            slug,
            imageUrl,
            description,
            price,
            category,
            detailedDescription,
            benefits,
            players,
            details
        } = req.body;

        const baseProduct = {
            name,
            subtitle,
            slug,
            image: imageUrl,
            description,
            price: parseFloat(price)
        };

        const detailedProduct = {
            ...baseProduct,
            players: [],
            details: detailedDescription,
            benefits: benefits.split(",").map(b => b.trim()).filter(b => b.length > 0)
        };

        if (players) {
            const rawPlayers = Array.isArray(players) ? players : [players];
            detailedProduct.players = rawPlayers.map(p => ({
                name: p.name,
                number: parseInt(p.number),
                additionalPrice: parseFloat(p.additionalPrice || 0)
            }));
        }

        if (details) {
            const rawDetails = Array.isArray(details) ? details : [details];
            detailedProduct.details = rawDetails.map(d => ({
                key: d.key,
                value: d.value
            }));
        }

        if (req.body.badgeAvailable) {
            detailedProduct.badgeOptions = {
                available: true,
                additionalPrice: parseFloat(req.body.badgeAdditionalPrice || 0)
            };
        }

        if (category === "kits") {
            await AllKits.create(baseProduct);
            await Kit.create(detailedProduct);
       
        } else if (category === "boots") {
            await AllBoots.create(baseProduct);
            await Boot.create(detailedProduct);
        
        } else if (category === "other") {
            await AllOthers.create(baseProduct);
            await Other.create(detailedProduct);
        }

        res.redirect("/admin");
    
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding product: " + err.message);
    }
});


router.post("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { category } = req.body;
        
        if (category === "kits") {
            const deletedProduct = await AllKits.findByIdAndDelete(id);
            if(deletedProduct){
                await Kit.findOneAndDelete({ slug: deletedProduct.slug });
            }
        }
        else if (category === "boots") {
            const product = await AllBoots.findByIdAndDelete(id);
            if (product) {
                await Boot.findOneAndDelete({ slug: product.slug });
            }
        } else if (category === "other") {
            const product = await AllOthers.findByIdAndDelete(id);
            if (product) {
                await Other.findOneAndDelete({ slug: product.slug });
            }
        }
        
        res.redirect("/admin");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting product: " + err.message);
    }
});

router.post('/orders', async (req, res) => {
    try {
      const { customer, items, totalAmount } = req.body;
      
      const newOrder = new Order({
        customerName: customer.name,
        customerSurname: customer.surname,
        customerEmail: customer.email,
        customerAddress: customer.address,
        items: items,
        totalAmount: totalAmount,
        orderDate: new Date(),
        status: 'pending'
      });
        
      await newOrder.save();

        for(const item of items){
            let product;

            if(item.category === 'kits'){
                product = AllKits
            }
            else if(item.category === 'boots'){
                product = AllBoots
            }
            else if(item.category === 'other'){
                product = AllOthers
            }

            if(product){

                await product.findByIdAndUpdate(item.id, {$inc: { orderCount: item.quantity} }, {new: true});
            }
        }


        res.status(200).json({ success: true, message: 'Order submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error submitting order' });
    }
});

module.exports = router;