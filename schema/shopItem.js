const { number } = require("joi");
const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')


const shopItemsSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    itemPrice: {
        type: Number,
        required: true
    },
    isInStock: {
        type: Boolean,
        default: true
    },
   
}, {timestamps: true});

shopItemsSchema.plugin(mongoosePaginate);
const shopItemsCollection = mongoose.model("shop", shopItemsSchema);

module.exports = {
    shopItemsCollection
}