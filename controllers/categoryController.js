const { Category, Product, ProductGallery } = require('../models');

class CategoryController {
    static async getAll(request, response) {
        try {
            let result = await Category.findAll({
                order: [
                    ['name', 'asc']
                ]
            });

            response.status(200).json({
                status: true,
                message: 'All categories fetched',
                data: result
            });
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err),
                data: null
            })
        }
    }

    static async getById(request, response) {
        try {
            const id = +request.params.id;

            let result = await Category.findByPk(id, {
                include: [
                    { 
                        model: Product, 
                        include: [
                            { model: ProductGallery }
                        ] 
                    }
                ],
                order: [
                    [Product, ProductGallery, 'id', 'asc']
                ]
            });

            result ? response.status(200).json({
                status: true,
                message: `Category with an ID of ${id} fetched`,
                data: result
            }) : response.status(404).json({
                status: false,
                message: `Couldn't find Category with an ID of ${id}`,
                data: null
            });
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err),
                data: null
            })
        }
    }

    static async add(request, response) {
        try {   
            const { name } = request.body;

            let duplicateCategory = await Category.findOne({
                where: { name }
            });

            if (duplicateCategory) {
                response.status(406).json({
                    status: false,
                    message: 'Category with a similar name already exists'
                });
            } else {
                let result = await Category.create({ name });

                response.status(201).json({
                    status: true,
                    message: `${name} has been added to Categories`
                });
            } 
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err)
            });
        }
    }

    static async delete(request, response) {
        try {
            const id  = +request.params.id;

            let result = await Category.destroy({
                where: { id }
            });

            result === 1 ? response.status(200).json({
                status: true,
                message: `Category with an ID of ${id} has been deleted`
            }) : response.status(404).json({
                status: false,
                message: `Couldn't delete category with an ID of ${id}`
            });
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err)
            });
        }
    }
}

module.exports = CategoryController;