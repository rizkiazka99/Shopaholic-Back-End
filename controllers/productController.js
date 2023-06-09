const { Product, Category, ProductGallery, sequelize } = require('../models');
const deleteFileInBulk = require('../helpers/deleteFileInBulk.js');
const { Op } = require('sequelize');
const deleteFile = require('../helpers/deleteFile');

class ProductController {
    static async getAll(request, response) {
        try {
            let result = await Product.findAll({
                include: [
                    { model: Category },
                    { model: ProductGallery }
                ],
                order: [
                    ['id', 'asc'],
                    [ProductGallery, 'id', 'asc']
                ]
            });

            response.status(200).json({
                status: true,
                message: 'All products fetched',
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

    static async getBySeller(request, response) {
        try {
            const SellerId = +request.params.SellerId;

            let result = await Product.findAll({
                where: { SellerId },
                include: [
                    { model: Category },
                    { model: ProductGallery }
                ],
                order: [
                    ['id', 'asc'],
                    [ProductGallery, 'id', 'asc']
                ]
            });

            response.status(200).json({
                status: true,
                message: `All products belong to Seller with an ID of ${SellerId} fetched`,
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

            let result = await Product.findByPk(id, {
                include: [
                    { model: Category },
                    { model: ProductGallery }
                ],
                order: [
                    [ProductGallery, 'id', 'asc']
                ]
            });

            result ? response.status(200).json({
                status: true,
                message: `Product with an ID of ${id} fetched`,
                data: result
            }) : response.status(404).json({
                status: false,
                message: `Couldn't find Product with an ID of ${id}`,
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

    static async search(request, response) {
        try {
            const query = request.params.query.toLowerCase();

            let result = await Product.findAll({
                where: {
                    name: sequelize.where(sequelize.fn('LOWER', sequelize.col('Product.name')), 'LIKE', '%' + query + '%')
                },
                include: [
                    { model: Category },
                    { model: ProductGallery }
                ],
                order: [
                    ['id', 'asc'],
                    [ProductGallery, 'id', 'asc']
                ]
            });

            response.status(200).json({
                status: true,
                message: `${result.length} results found`,
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

    static async searchBySeller(request, response) {
        try {
            const query = request.params.query.toLowerCase();
            const SellerId = +request.params.SellerId;

            let result = await Product.findAll({
                where: {
                    [Op.and] : [
                        { name: sequelize.where(sequelize.fn('LOWER', sequelize.col('Product.name')), 'LIKE', '%' + query + '%') },
                        { SellerId: SellerId }
                    ]
                },
                include: [
                    { model: Category },
                    { model: ProductGallery }
                ],
                order: [
                    ['id', 'asc'],
                    [ProductGallery, 'id', 'asc']
                ]
            });

            response.status(200).json({
                status: true,
                message: `${result.length} results found`,
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

    static async add(request, response) {
        try {
            const { name, buy_price, sell_price, stock, CategoryId } = request.body;
            const roleAuth = request.userData.role;
            const SellerId = +request.userData.id;
            let result;

            let duplicateProduct = await Product.findOne({
                where: {
                    SellerId: SellerId,
                    name: name
                }
            });

            if (duplicateProduct) {
                response.status(406).json({
                    status: false,
                    message: 'You already have a product with a similar name',
                    data: null
                });
            } else {
                if (roleAuth !== 'Seller') {
                    response.status(403).json({
                        status: false,
                        message: 'Only Sellers are allowed to perform this action',
                        data: null
                    });
                } else {
                    if (request.file) {
                        const thumbnail = request.file.path;

                        result = await Product.create({
                            name, buy_price, sell_price, stock, SellerId, CategoryId, thumbnail
                        });
                    } else {
                        result = await Product.create({
                            name, buy_price, sell_price, stock, SellerId, CategoryId
                        });
                    }
                    
                    response.status(201).json({
                        status: true,
                        message: 'Product created',
                        data: result
                    });
                }
            }
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err),
                data: null
            });
        }
    }

    static async update(request, response) {
        try {
            const { name, buy_price, sell_price, stock, CategoryId } = request.body;
            const roleAuth = request.userData.role;
            const idAuth = +request.userData.id;
            const id = +request.params.id;

            if (roleAuth !== 'Seller') {
                response.status(403).json({
                    status: false,
                    message: 'Only Sellers are allowed to perform this action'
                });
            } else {
                let product = await Product.findByPk(id);

                if (!product) {
                    response.status(404).json({
                        status: false,
                        message: `Couldn't find Product with an ID of ${id}`
                    });
                } else {
                    if (idAuth !== product.SellerId) {
                        response.status(403).json({
                            status: false,
                            message: 'You are not the authorized seller'
                        });
                    } else {
                        let result = await Product.update({
                            name: name === undefined ? product.name : name,
                            buy_price: buy_price === undefined ? product.buy_price : buy_price,
                            sell_price: sell_price === undefined ? product.sell_price : sell_price,
                            stock: stock === undefined ? product.stock : stock,
                            CategoryId: CategoryId === undefined ? product.CategoryId : CategoryId,
                            thumbnail: request.file ? request.file.path : product.thumbnail
                        }, {
                            where: { id }
                        });

                        result[0] === 1 ? response.status(200).json({
                            status: true,
                            message: `Product with and ID of ${id} has been updated`
                        }) : response.status(404).json({
                            status: false,
                            message: `Couldn't update Product with and ID of ${id}`
                        });
                    }
                }
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
            const id = +request.params.id;
            const roleAuth = request.userData.role;
            const idAuth = +request.userData.id;

            if (roleAuth !== 'Seller') {
                response.status(403).json({
                    status: false,
                    message: 'Only Sellers are allowed to perform this action'
                });
            } else {
                let product = await Product.findByPk(id);

                if (!product) {
                    response.status(404).json({
                        status: false,
                        message: `Couldn't find Product with an ID of ${id}`
                    });
                } else {
                    if (idAuth !== product.SellerId) {
                        response.status(403).json({
                            status: false,
                            message: 'You are not the authorized seller'
                        });
                    } else {
                        let result = await Product.destroy({
                            where: { id }
                        });

                        if (result) {
                            if (product.thumbnail) {
                                deleteFile(product.thumbnail)
                            }
                            
                            let images = await ProductGallery.findAll({
                                where: {
                                    ProductId: id
                                }
                            });

                            if (images.length > 0) {
                                let deleteImages = await ProductGallery.destroy({
                                    where: {
                                        ProductId: id
                                    }
                                });

                                if (deleteImages === 1) {
                                    deleteFileInBulk(images);
                                }
                            }
                        }

                        result === 1 ? response.status(200).json({
                            status: true,
                            message: `Product with an ID of ${id} has been deleted`
                        }) : response.status(404).json({
                            status: false,
                            message: `Couldn't delete Product with and ID of ${id}`
                        });
                    }
                }
            }
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err)
            });
        }
    }
}

module.exports = ProductController;