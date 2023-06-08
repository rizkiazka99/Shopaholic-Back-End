const { Seller, Product, Category, ProductGallery, sequelize } = require('../models');
const { decryptPassword, encryptPassword } = require('../helpers/bcrypt');
const { generateToken, verifyToken } = require('../helpers/jwt');


class SellerController {
    static async register(request, response) {
        try {
            const { email, name, phone_number, password } = request.body;

            let duplicateEmail = await Seller.findOne({
                where: { email }
            });

            let duplicatePhoneNumber = await Seller.findOne({
                where: { phone_number }
            });

            if (duplicateEmail) {
                response.status(403).json({
                    status: false,
                    message: 'This e-mail address has been used by another account'
                });
            } else if (duplicatePhoneNumber) {
                response.status(403).json({
                    status: false,
                    message: 'This phone number has been used by another account'
                });
            } else {
                let result = await Seller.create({
                    email, name, phone_number, password
                });
    
                response.status(201).json({
                    status: true,
                    message: 'Your account has been created'
                });
            }
        } catch(err) {
            console.log(err)
            response.status(500).json({
                status: false,
                message: String(err)
            });
        }
    }

    static async login(request, response) {
        try {
            const { email, password } = request.body;

            let account = await Seller.findOne({
                where: { email }
            });

            if (account) {
                const isPasswordCorrect = decryptPassword(password, account.password);

                if (isPasswordCorrect) {
                    let access_token = generateToken(account);
                    let verify_token = verifyToken(access_token);

                    response.status(200).json({
                        status: true,
                        message: 'Login successful',
                        access_token: access_token,
                        data: verify_token
                    });
                } else {
                    response.status(403).json({
                        status: false,
                        message: 'Invalid e-mail address or password',
                        access_token: null,
                        data: null
                    });
                }
            } else {
                response.status(404).json({
                    status: false,
                    message: 'E-mail address isn\'t registered to any account',
                    access_token: null,
                    data: null
                })
            }
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err),
                access_token: null,
                data: null
            });
        }
    }

    static async verifyPassword(request, response) {
        try {
            const { password } = request.body;
            const id = +request.userData.id;

            let account = await Seller.findOne({
                where: { id }
            });

            if (account) {
                const isPasswordCorrect = decryptPassword(password, account.password);

                if (isPasswordCorrect) {
                    response.status(200).json({
                        status: true,
                        message: 'Password verified!'
                    });
                } else {
                    response.status(403).json({
                        status: false,
                        message: 'Failed to verify password'
                    });
                }
            } else {
                response.status(404).json({
                    status: false,
                    message: 'Account with this e-mail address wasn\'t found'
                });
            }
            
        } catch(err) {
            response.status(500).json({
                status: false,
                message: String(err)
            });
        }
    }

    static async update(request, response) {
        try {
            const { email, name, phone_number, password } = request.body;
            const idAuth = +request.userData.id;
            const id = +request.params.id;
            let result;

            if (id !== idAuth) {
                response.status(403).json({
                    status: false,
                    message: 'You are not the authorized user!'
                });
            } else {
                let account = await Seller.findByPk(id);

                if (request.file) {
                    let profile_picture = request.file.path;

                    result = await Seller.update({
                        email: email === undefined ? account.email : email,
                        name: name === undefined ? account.name : name,
                        phone_number: phone_number === undefined ? account.phone_number : phone_number,
                        password: password === undefined ? account.password : encryptPassword(password),
                        profile_picture: profile_picture
                    }, {
                        where: { id }
                    });
                } else {
                    result = await Seller.update({
                        email: email === undefined ? account.email : email,
                        name: name === undefined ? account.name : name,
                        phone_number: phone_number === undefined ? account.phone_number : phone_number,
                        password: password === undefined ? account.password : encryptPassword(password),
                        profile_picture: account.profile_picture
                    }, {
                        where: { id }
                    });
                }

                result[0] === 1 ? response.status(200).json({
                    status: true,
                    message: 'Your account has been updated'
                }) : response.status(404).json({
                    status: false,
                    message: 'Failed to update your account'
                });
            }
        } catch(err) {
            console.log(err);
            response.status(500).json({
                status: false,
                message: String(err)
            });
        }
    }

    static async getById(request, response) {
        try {
            const id = +request.params.id;

            let result = await Seller.findByPk(id, {
                include: [
                    { 
                        model: Product, 
                        include: [
                            { model: Category },
                            { model: ProductGallery }
                        ]
                    }
                ],
                order: [
                    [Product, 'id', 'asc'],
                    [Product, ProductGallery, 'id', 'asc']
                ]
            });

            result ? response.status(200).json({
                status: true,
                message: `Seller with an ID of ${id} fetched`,
                data: result
            }) : response.status(404).json({
                status: true,
                message: `Couldn't find Seller with an ID of ${id}`,
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

    static async getAll(request, response) {
        try {
            let result = await Seller.findAll({
                include: [
                    { 
                        model: Product, 
                        include: [
                            { model: Category },
                            { model: ProductGallery }
                        ]
                    }
                ],
                order: [
                    ['id', 'asc'],
                    [Product, 'id', 'asc'],
                    [Product, ProductGallery, 'id', 'asc']
                ]
            });

            response.status(200).json({
                status: true,
                message: 'All Sellers fetched',
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

    static async search(request, response) {
        try {
            const query = request.params.query.toLowerCase();

            let result = await Seller.findAll({
                where: {
                    name: sequelize.where(sequelize.fn('LOWER', sequelize.col('Seller.name')), 'LIKE', '%' + query + '%')
                },
                include: [
                    { 
                        model: Product, 
                        include: [
                            { model: Category },
                            { model: ProductGallery }
                        ]
                    }
                ],
                order: [
                    ['id', 'asc'],
                    [Product, 'id', 'asc'],
                    [Product, ProductGallery, 'id', 'asc']
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
}

module.exports = SellerController;