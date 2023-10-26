const {shopItemCollection} = require("../schema/shopItem");
shopItemCollection.insertMany({
  {
    itemName: "flakes",
    itemPrice: 80000
  }
})