const asyncHandler = require("express-async-handler");

const AllKits = require("../server/models/allkits");
const AllBoots = require("../server/models/allboots");
const AllOthers = require("../server/models/allothers");
const Kit = require("../server/models/kit");
const Boot = require("../server/models/boot");
const Other = require("../server/models/other");
const Order = require("../server/models/order");

exports.getAdminPage = asyncHandler(async (req, res) => {
    
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

exports.newProduct = asyncHandler(async (req, res) => {
    
    try {
            const {
                name,
                subtitle,
                slug,
                description,
                price,
                category,
                detailedDescription,
                benefits,
                players,
                details
            } = req.body;
            
            const imageUrl = req.file?.path || "";
    
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
                benefits: benefits ? benefits.split(",").map(b => b.trim()).filter(b => b.length > 0) : [],
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
            res.status(500).send("Error adding product: " + err.message);
        } 
});

exports.deleteProduct = asyncHandler(async (req, res) => {
    
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

exports.editProduct = asyncHandler(async (req, res) => {
    try {
        const productId = req.params.id;
        const category = req.query.category; 

        let productData = null;
        let baseProductModel;
        let detailedProductModel;

        if (category === "kits") {
            baseProductModel = AllKits;
            detailedProductModel = Kit;
        } else if (category === "boots") {
            baseProductModel = AllBoots;
            detailedProductModel = Boot;
        } else if (category === "other") {
            baseProductModel = AllOthers;
            detailedProductModel = Other;
        } else {
            return res.status(400).json({ message: "Invalid category specified." });
        }

        const baseProduct = await baseProductModel.findById(productId);
        if (!baseProduct) {
             return res.status(404).json({ message: "Base product not found." });
        }

        productData = await detailedProductModel.findOne({ slug: baseProduct.slug });

        if (!productData) {
             return res.status(404).json({ message: "Detailed product data not found." });
        }

        res.json(productData);

    } catch (err) {
        console.error("Error fetching product JSON for edit:", err);
        res.status(500).json({ message: "Server error fetching product data." });
    }
});

exports.updateProduct = asyncHandler(async (req, res) => {
    try {

        const productId = req.params.id;

        
        const {
            name,
            subtitle,
            slug, 
            description,
            price,
            category,
            detailedDescription,
            benefits,
            badgeAvailable, 
            badgeAdditionalPrice
        } = req.body;

        let baseProductModel;
        let detailedProductModel;
        let originalSlug; 

        if (category === "kits") {
            baseProductModel = AllKits;
            detailedProductModel = Kit;
        } else if (category === "boots") {
            baseProductModel = AllBoots;
            detailedProductModel = Boot;
        } else if (category === "other") {
            baseProductModel = AllOthers;
            detailedProductModel = Other;
        } else {
            return res.status(400).send("Invalid category specified for update.");
        }

        const baseProductOriginal = await baseProductModel.findById(productId);
        if (!baseProductOriginal) {
            return res.status(404).send("Original base product not found for update.");
        }
        originalSlug = baseProductOriginal.slug;

        const newSlug = slug || slugify(name, { lower: true, strict: true });

        const baseUpdateData = {
            name,
            subtitle,
            slug: newSlug, 
            description,
            price: parseFloat(price) 
        };

        const detailedUpdateData = {
            name,
            subtitle,
            slug: newSlug, 
            description,
            price: parseFloat(price),
            benefits: benefits ? benefits.split(',').map(b => b.trim()).filter(b => b) : [],
            details: detailedDescription ? detailedDescription.split('\n').map(d => d.trim()).filter(d => d) : []
        };

        if (req.file) {
            baseUpdateData.image = req.file.path;
            detailedUpdateData.image = req.file.path;
        }

        if (category === "kits") {
            detailedUpdateData.players = [];
             if (req.body.players && typeof req.body.players === 'object') {
                 const playerMap = {};
                 for (const key in req.body) {
                     const match = key.match(/^players\[(\d+)\]\[(name|number|additionalPrice)\]$/);
                     if (match) {
                         const index = match[1];
                         const field = match[2];
                         if (!playerMap[index]) playerMap[index] = {};
                         playerMap[index][field] = req.body[key];
                     }
                 }
                 detailedUpdateData.players = Object.values(playerMap)
                     .filter(p => p.name || p.number || p.additionalPrice) 
                     .map(p => ({
                         name: p.name || '', 
                         number: parseInt(p.number || 0), 
                         additionalPrice: parseFloat(p.additionalPrice || 0) 
                     }));
            }


            detailedUpdateData.badgeOptions = {
                available: req.body.badgeAvailable === 'true',
                additionalPrice: parseFloat(req.body.badgeAdditionalPrice || 0) 
            };
        }

        const updatedBaseProduct = await baseProductModel.findByIdAndUpdate(
            productId,          
            baseUpdateData,     
        );

        const updatedDetailedProduct = await detailedProductModel.findOneAndUpdate(
            { slug: originalSlug }, 
            detailedUpdateData,    
        );

        if (!updatedBaseProduct || !updatedDetailedProduct) {
            console.error(`Update failed: Base Found: ${!!updatedBaseProduct}, Detailed Found: ${!!updatedDetailedProduct}`);
            return res.status(404).send("Could not find one or both product documents to update.");
        }
        res.status(200).json({ success: true, message: "Product updated successfully!" });
        res.redirect('/admin');

    } catch (err) {
        console.error("Error updating product:", err); 

     if (res.headersSent) {
         console.error("Headers already sent, cannot send error response. Original error:", err.message);
         return;
     }

     if (err.name === 'ValidationError') {
          return res.status(400).send(`Validation Error: ${err.message}`);
     }
     return res.status(500).send("Server error updating product.");
    }
});


exports.submitOrder = asyncHandler(async (req, res) => {
    try {
        const { customer, items, totalAmount } = req.body;

        if (!customer || !items || items.length === 0 || !totalAmount) {
            return res.status(400).json({ success: false, message: 'Missing required order data.' });
        }

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

        for (const item of items) {
            let productModel;

            if (item.category === 'kits') {
                productModel = AllKits;
            } else if (item.category === 'boots') {
                productModel = AllBoots;
            } else if (item.category === 'other') {
                productModel = AllOthers;
            } else {
                console.warn(`Skipping order count update for item with potentially missing/invalid category: ${item.category}, slug: ${item.slug || 'N/A'}`);
                continue;
            }

            if (productModel && item.slug) {
                try {
                    await productModel.findOneAndUpdate(
                        { slug: item.slug },
                        { $inc: { orderCount: item.quantity || 1 } }, 
                    );
                } catch (updateError) {
                    console.error(`Error updating order count for product slug ${item.slug} in ${productModel.modelName}:`, updateError);
                }
            } else if (!item.slug) {
                 console.warn(`Skipping order count update for item because slug is missing. Item ID: ${item.id || 'N/A'}`);
            }
        }

        res.status(200).json({ success: true, message: 'Order submitted successfully' });

    } catch (error) {
        console.error("Error in submitOrder:", error);
        if (res.headersSent) {
            return;
        }
        res.status(500).json({ success: false, message: 'Error submitting order' });
    }
});

