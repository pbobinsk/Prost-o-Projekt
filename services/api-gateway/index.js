const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path'); // Import modułu 'path' do pracy ze ścieżkami
const cors = require('cors');
require('dotenv').config({ path: '../../.env' }); // Wczytaj .env z głównego folderu
const jwt = require('jsonwebtoken');

const app = express();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware do weryfikacji tokenu JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // Unauthorized - brak tokenu
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden - token nieprawidłowy
    }
    // Opcjonalnie: przekaż dane użytkownika do downstream service
    req.user = user;
    req.headers['x-user-id'] = user.id; 
    next();
  });
};

const proxyOptions = {
  proxyReqPathResolver: function (req) {
    return req.originalUrl;
  },
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    // Przekaż nasz nowy, niestandardowy nagłówek
    proxyReqOpts.headers['x-user-id'] = srcReq.headers['x-user-id'];
    return proxyReqOpts;
  }
};

app.use(cors());

app.use('/specs', express.static(path.join(__dirname, 'specs')));

// Ścieżki publiczne (nie wymagają uwierzytelnienia)
app.use('/api/auth', proxy('http://user-service:8000'));

// Ścieżki chronione (wymagają uwierzytelnienia)
app.use('/api/projects', authenticateToken, proxy('http://project-service:3000'));

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});

