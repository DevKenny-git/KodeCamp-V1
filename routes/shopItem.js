const express = require("express");
const router = express.Router();
const {shopItemsCollection} = require("../schema/shopItem");


router.post("/shop-items", async (req, res) => {
    try {
        await shopItemsCollection.insertMany(req.body.shopItems);

        res.send({
            message: "shop items added successfully"
        });
    } catch (error) {
        res.send(500).send(error.message || "An error occurred");
    }
});

router.get("/query", async (req, res) => {
    // $gt = greater than
    // $gte = greater than or equal to
    // $lt - less than
    // $lte - less than or equal to
    // $in - if the value of a property is in the array
    // $nin - if the value of a property is not in the array
    // $and - accepts an array of objects.
    // all objects has to be true for the record to be returned
    // $or = Accepts an array of objects
    // one of the objects has to be true for a record to be sent back
    // 
    
    try {
        const shopItems = await shopItemsCollection.find({
            $and: [{isInStock: true}, {itemPrice: {$gte: 500}}]
        });

        res.send({
            successful: true,
            shopItems
        });
    } catch (error) {
        res.status(500).send(error.message || "An error occurred");
    }
})


module.exports = router;

