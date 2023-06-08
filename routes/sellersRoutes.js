const sellersRoutes = require('express').Router();
const { auth } = require('../middlewares/auth.js');
const { upload } = require('../middlewares/multer.js');
const { SellerController } = require('../controllers');

sellersRoutes.post('/login', SellerController.login);
sellersRoutes.post('/register', SellerController.register);
sellersRoutes.post('/verify_password', auth, SellerController.verifyPassword);
sellersRoutes.put('/update/:id', auth, upload.single('profile-picture'), SellerController.update);
sellersRoutes.get('/:id', auth, SellerController.getById);
sellersRoutes.get('/', auth, SellerController.getAll);
sellersRoutes.get('/search/:query', auth, SellerController.search);

module.exports = sellersRoutes;