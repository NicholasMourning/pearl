const model = require('../models/item');
const multer = require('multer');
const path = require('path');

exports.index = (req, res) =>{
    let items = model.find();

    items.sort((a,b) =>{
        if (a.price < b.price){
            return -1;
        } else if(a.price > b.price){
            return 1;
        } else{
            return 0;
        }
    });

    res.render('../views/items/index', {items});
};

//GET /items/new: send html form for creating a new item
exports.new = (req,res)=>{
    res.render('./items/new');
};

//File uploader

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + 
      Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  })
  
  const fileFilter = (req, file, cb) =>{
    const mimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp'];
    if(mimeTypes.includes(file.mimetype)){
        return cb(null,true);
    } else{
        cb(new Error("Invalid file type. Only jpeg, png, gif, jpg, and webp image files are allowed"), false);
    }
  }

exports.upload = multer({storage, fileFilter}).single('image');

//GET /items/search: search for item name or details and returns item page
exports.searchItems = (req,res)=>{
    const searchedTerm = req.query.s.toLowerCase();
    let items = model.find();

    let foundItems = items.filter(item =>item.title.toLowerCase().includes(searchedTerm) || item.details.toLowerCase().includes(searchedTerm));

    res.render('items/index', {items: foundItems});
} 

//Post /items: create a new item
exports.create = (req,res) =>{
    let item = req.body;
    item.image = '/images/' + req.file.filename;
    model.save(item);
    res.redirect('/items');
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
    let item = model.findById(id);
    if(item){
        res.render('../views/items/show', {item});
    } else{
        let err = new Error('Cannot find a item with id ' + id)
        err.status = 404;
        next(err);
    }
};

exports.edit = (req, res, next)=>{
    let id = req.params.id
    let item = model.findById(id);
    if(item) {
        res.render('../views/items/edit', {item});
    } else{
        let err = new Error('Cannot find a item with id ' + id)
        err.status = 404;
        next(err);
    }
};

exports.update = (req, res, next)=>{
    let id = req.params.id;
    let item = req.body;

    existingItem = model.findById(id);
    if(!existingItem){
        let err = new Error('Cannot find a item with id ' + id)
        err.status = 404;
        next(err);
    }

    if(req.file){
        item.image = '/images/' + req.file.filename;
    } else{
        item.image = existingItem.image;
    }

    if(model.updateById(id,item)){
        res.redirect('/items/' + id);
    } else{
        let err = new Error('Cannot find a item with id ' + id)
        err.status = 404;
        next(err);
    }
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;
    if(model.deleteById(id)){
        res.redirect('/items');
    } else{
        let err = new Error('Cannot find a item with id ' + id)
        err.status = 404;
        next(err);
    }
};