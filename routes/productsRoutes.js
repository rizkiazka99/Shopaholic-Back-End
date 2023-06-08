const productsRoutes = require('express').Router();
const { auth } = require('../middlewares/auth.js');
const { ProductController } = require('../controllers');

productsRoutes.get('/', auth, ProductController.getAll);
productsRoutes.get('/seller/:SellerId', auth, ProductController.getBySeller);
productsRoutes.get('/:id', auth, ProductController.getById);
productsRoutes.get('/search/:query', auth, ProductController.search);
productsRoutes.get('/seller/:SellerId/search/:query', auth, ProductController.searchBySeller);
productsRoutes.post('/add', auth, ProductController.add);
productsRoutes.put('/update/:id', auth, ProductController.update);
productsRoutes.delete('/delete/:id', auth, ProductController.delete);

module.exports = productsRoutes;