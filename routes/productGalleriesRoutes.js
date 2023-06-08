const productGalleriesRoutes = require('express').Router();
const { auth } = require('../middlewares/auth.js');
const { upload } = require('../middlewares/multer.js');
const { ProductGalleryController } = require('../controllers');

productGalleriesRoutes.get('/product/:ProductId', auth, ProductGalleryController.getByProduct);
productGalleriesRoutes.get('/:id', auth, ProductGalleryController.getById);
productGalleriesRoutes.post('/add', auth, upload.array('product-picture', 6), ProductGalleryController.add);
productGalleriesRoutes.delete('/delete/:id', auth, ProductGalleryController.delete)

module.exports = productGalleriesRoutes;
