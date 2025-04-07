require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 3000;
const router = express.Router();
const app = express();
const connectDB = require('./config/db');

const AllKits = require('../server/models/allkits');
const AllBoots = require('../server/models/allboots');
const AllOthers = require('../server/models/allothers');

connectDB();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static('static'));

app.get('/', (req,res)=>{
    res.render('welcomePage');
});
app.get('/home', async (req, res) => {
    try {
        const allkits = await AllKits.find({}) || [];
        const allboots = await AllBoots.find({}) || [];
        const allothers = await AllOthers.find({}) || [];

        res.render('mainPage', { allkits, allboots, allothers });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

const productRouter = require('../routers/product');  
const productsRouter = require('../routers/products'); 
const adminRouter = require('../routers/admin');

app.use('/products',  productsRouter);
app.use('/product', productRouter);
app.use('/admin', adminRouter);

app.listen(port, () => {
    console.log("Server is running on port " + port);
});


module.exports = router;