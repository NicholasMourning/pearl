const mongoose = require("mongoose");
const schema = mongoose.Schema;

const itemSchema = new schema({
  title: { type: String, required: [true, "title is required"] },
  seller: { type: String, required: [true, "seller is required"] },
  condition: {
    type: String,
    enum: [
      "Used",
      "Used - good condition",
      "Used - like new",
      "Refurbished",
      "New",
      "New - without tags",
      "New - with tags",
    ],
    required: true,
  },
  price: { type: Number, required: true, min: 0.01 },
  details: { type: String, required: [true, "details are required"] },
  image: { type: String, required: [true, "image is required"] },
  active: { type: Boolean, default: true },
});

//Export the model
module.exports = mongoose.model("item", itemSchema);

// const { DateTime } = require('luxon');
// const {v4: uuidv4} = require('uuid');

// const items = [
//     {
//         id: '1',
//         title: 'Vintage shirt',
//         seller: 'Pearl',
//         condition: 'Refurbished',
//         price: '25',
//         details: 'Original piece refurbished by Pearl',
//         image: '/images/pearlShirt.jpg',
//         active: true
//     },
//     {
//         id: '2',
//         title: 'Corduroy Pants',
//         seller: 'Christine William',
//         condition: 'Old',
//         price: '50',
//         details: 'Made with cotton wool, soft and durable',
//         image: '/images/pearlPants.jpg',
//         active: true
//     },
//     {
//         id: '3',
//         title: 'Loafers',
//         seller: 'Pearl',
//         condition: 'Refurbished',
//         price: '60',
//         details: 'Comfortable and durable',
//         image: '/images/pearlshoes.jpg',
//         active: true
//     },
//     {
//         id: '4',
//         title: 'Pearl Vest',
//         seller: 'Pearl',
//         condition: 'New - with Tages',
//         price: '25',
//         details: 'Made with luxury wool',
//         image: '/images/pearlVest.jpg',
//         active: true
//     },
//     {
//         id: '5',
//         title: 'Crew Sweater',
//         seller: 'Nick Mourning',
//         condition: 'Refurbished',
//         price: '35',
//         details: 'Made with cotton',
//         image: '/images/s-l400.jpg',
//         active: true
//     },
//     {
//         id: '6',
//         title: 'Jean Shorts',
//         seller: 'John Smith',
//         condition: 'New - without Tags',
//         price: '40',
//         details: 'Light blue denim fabric',
//         image: '/images/shorts.jpg',
//         active: true
//     }
// ];

// exports.find = () => items;

// const findById = (id) => items.find(item=>item.id === id);
// exports.findById = findById;

// exports.save = function(item){
//     item.id = uuidv4();
//     item.active = true;
//     items.push(item);
// }

// exports.updateById = function(id, newItem){
//     let item = findById(id);
//     if(item){
//         item.title = newItem.title;
//         item.seller = newItem.seller;
//         item.condition = newItem.condition;
//         item.price = newItem.price;
//         item.details = newItem.details;
//         item.image = newItem.image;
//         return true;
//     } else{
//         return false;
//     }
// }

// exports.deleteById = function(id){
//     let index = items.findIndex(item => item.id === id);
//     if(index !== -1){
//         items.splice(index, 1);
//         return true;
//     } else{
//         return false;
//     }
// }
