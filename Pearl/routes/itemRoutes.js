const express = require('express');
const controller = require('../controllers/itemController')
const router = express.Router();

//GET /items : send all items to the user
router.get('/', controller.index);

//GET /search : send request for item
router.get('/search', controller.searchItems)

//GET /items/new : send form for creating a new item
router.get('/new', controller.new);

//POST /items : create a new item
router.post('/', controller.upload, controller.create);

//GET /items/:id : send details of a item identified by id
router.get('/:id', controller.show);

//GET /items/:id/edit : send form for editing an existing item
router.get('/:id/edit', controller.edit);

//PUT /items/:id : update the item identified by id
router.put('/:id', controller.upload, controller.update);

//DELETE /items:id : delete the item identified by id
router.delete('/:id', controller.delete);

module.exports = router;