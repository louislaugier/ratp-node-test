const joi = require('@hapi/joi');
const db = require('../config/database');

module.exports = {
    method: 'GET',
    path: '/api/clients',
    options: {
        validate: {
            query: joi.object().keys({
                limit: joi.number().integer().min(1).max(50000).default(1000),
                offset: joi.number().integer().min(0).default(0),
                genre: joi.string().alphanum().min(5).max(5)
            })
        }
    },
    handler: async (req, toolkit) => {
        function request() {
            if (req.query.genre !== null) {
                return db.select().from('clients').where('genre', req.query.genre).limit(req.query.limit).offset(req.query.offset) 
            }
            return db.select().from('clients').limit(req.query.limit).offset(req.query.offset)
          }
        return request()
            .then(result => {
                return toolkit.response({
                    statusCode: 200,
                    errors: null,
                    message: 'OK',
                    meta: {
                        query: req.query,
                        params: req.params
                    },
                    data: result
                }).code(200);
            })
            .catch(err => {
                return toolkit.response({
                    statusCode: 500,
                    errors: err,
                    message: 'Internal Server Error',
                    errors: [
                        {
                            message: 'Database error'
                        }
                    ],
                    meta: {
                        query: req.query,
                        params: req.params
                    },
                    data: null
                }).code(500);
            });
    }
}