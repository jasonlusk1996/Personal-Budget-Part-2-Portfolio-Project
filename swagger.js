const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Personal Budget', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./app.js', './*Routes.js', './swagger.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

// Export these so app.js can use them
module.exports = { swaggerUi, swaggerSpec };
