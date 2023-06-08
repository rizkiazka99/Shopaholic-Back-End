const categoriesRoutes = require('express').Router();
const { auth } = require('../middlewares/auth.js');
const { CategoryController } = require('../controllers');

categoriesRoutes.get('/', auth, CategoryController.getAll);
categoriesRoutes.get('/:id', auth, CategoryController.getById);
categoriesRoutes.post('/add', auth, CategoryController.add);
categoriesRoutes.delete('/delete/:id', auth, CategoryController.delete);

module.exports = categoriesRoutes;