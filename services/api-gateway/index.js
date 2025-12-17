const express = require('express');
const proxy = require('express-http-proxy');

const app = express();

app.use('/api/users', proxy('http://user-service:8000'));

app.use('/api/projects', proxy('http://project-service:3000'));

app.use('/', proxy('http://legacy-monolith:3000'));

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});

