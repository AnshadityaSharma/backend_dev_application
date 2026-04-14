const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager API',
            version: '1.0.0',
            description: 'REST API with JWT authentication, role-based access control, and CRUD operations for task management.',
            contact: {
                name: 'Anshaditya Sharma',
            },
        },
        servers: [
            { url: 'http://localhost:5000', description: 'Development server' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter the JWT token obtained from login/register'
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./routes/v1/*.js'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Attach the Swagger UI to the Express app
module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Task Manager API Docs'
    }));
};
