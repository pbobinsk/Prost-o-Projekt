const express = require('express');
const proxy = require('express-http-proxy');

const app = express();

// Na razie wszystkie żądania przekierowuj do monolitu
app.use('/', proxy('http://legacy-monolith:3000'));

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});