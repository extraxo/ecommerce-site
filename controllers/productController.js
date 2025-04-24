const asyncHandler = require("express-async-handler");
const Kit = require("../server/models/kit");
const Boot = require("../server/models/boot");
const Other = require("../server/models/other");

exports.getKitSlug = asyncHandler(async (req, res) => {
    try {
            const kit = await Kit.findOne({ slug: req.params.kitSlug }); 
    
            if (!kit) {
                return res.status(404).send("Kit not found");
            }
    
            res.render("kitpage", { kit });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
});

exports.getBootSlug = asyncHandler(async (req, res) => {
    try {
            const boot = await Boot.findOne({ slug: req.params.bootSlug }); 
    
            if (!boot) {
                return res.status(404).send("Boot not found");
            }
    
            res.render("bootspage", { boot });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
});

exports.getOtherSlug = asyncHandler(async (req, res) => {
        try {
            const other = await Other.findOne({ slug: req.params.otherSlug }); 
    
            if (!other) {
                return res.status(404).send("Other item not found");
            }
    
            res.render("otherpage", { other });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
});