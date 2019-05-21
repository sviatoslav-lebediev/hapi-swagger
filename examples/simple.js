const Hapi = require('hapi');
const Joi = require('joi');
const Blipp = require('blipp');
const Inert = require('inert');
const Vision = require('vision');

const HapiSwagger = require('../');

let swaggerOptions = {
    info: {
        title: 'Test API Documentation',
        description: 'This is a sample example of API documentation.'
    }
};

const ser = async () => {
    try {
        const server = Hapi.Server({
            host: 'localhost',
            port: 3000
        });

        await server.register([
            Inert,
            Vision,
            Blipp,
            {
                plugin: HapiSwagger,
                options: swaggerOptions
            }
        ]);

        server.route({
            method: 'PUT',
            path: '/v1/store/{id?}',
            config: {
                handler: (request, h) => {
                    return h.response('success');
                },
                description: 'Update sum',
                notes: ['Update a sum in our data store'],
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form'
                    }
                },
                tags: ['api'],
                validate: {
                    params: {
                        id: Joi.string()
                            .required()
                            .description('the id of the sum in the store')
                    },
                    payload: {
                        a: Joi.number()
                            .required()
                            .description('the first number'),

                        b: Joi.number()
                            .required()
                            .description('the second number'),

                        operator: Joi.string()
                            .required()
                            .default('+')
                            .valid(['+', '-', '/', '*'])
                            .description('the opertator i.e. + - / or *'),

                        equals: Joi.number()
                            .required()
                            .description('the result of the sum')
                    }
                }
            }
        });

        await server.start();
        return server;
    } catch (err) {
        throw err;
    }
};

ser()
    .then(server => {
        console.log(`Server listening on ${server.info.uri}`);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
