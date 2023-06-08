const deleteFile = require('../helpers/deleteFile');
const { ProductGallery } = require('../models');

class ProductGalleryController {
    static async getByProduct(request, response) {
        try {
            const ProductId = +request.params.ProductId;

            let result = await ProductGallery.findAll({
                where: { ProductId },
                order: [
                    ['id', 'asc']
                ]
            });

            response.status(200).json({
                status: true,
                message: `All photos of Product with an ID of ${ProductId} have been fetched`,
                data: result
            });
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err),
                data: null
            });
        }
    }

    static async getById(request, response) {
        try {
            const id = +request.params.id;

            let result = await ProductGallery.findByPk(id);

            result ? response.status(200).json({
                status: true,
                message: `Product photo with an ID of ${id} fetched`,
                data: result
            }) : response.status(404).json({
                status: false,
                message: `Couldn't find Product Photo with an ID of ${id}`,
                data: null
            });
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err),
                data: null
            });
        }
    }

    static async add(request, response) {
        try {
            const { ProductId } = request.body;
            let resultArr = [];

            for (let i = 0; i < request.files.length; i++) {
                let result = await ProductGallery.create({
                    name: request.files[i].path,
                    ProductId: ProductId
                });

                resultArr.push(result)
            }

            response.status(201).json({
                status: true,
                message: `Photo(s) added to Product with an ID of ${id}`,
                data: resultArr
            });
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err),
                data: null
            });
        }
    }

    static async delete(request, response) {
        try {
            const id = +request.params.id;

            let image = await ProductGallery.findByPk(id);

            if (image) {
                let result = await ProductGallery.destroy({
                    where: { id }
                });
    
                if (result === 1) {
                    deleteFile(image.name);
                }

                result === 1 ? response.status(200).json({
                    status: true,
                    message: `Product Image with an ID of ${id} has been deleted`
                }) : response.status(404).json({
                    status: false,
                    message: `Couldn't delete Product Image with an ID of ${id}`
                });
            } else {
                response.status(404).json({
                    status: false,
                    message: `Couldn't find Product Image with an ID of ${id}`
                });
            }
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err)
            });
        }
    }
}

module.exports = ProductGalleryController;