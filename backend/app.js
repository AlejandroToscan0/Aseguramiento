const e = require('express');
const c = require('cors');
const p = require('path');
require('dotenv').config();

const R_a = require('./routes/auth');
const R_pr = require('./routes/products');
const R_ca = require('./routes/cart');
const R_o = require('./routes/orders');

const A = e();

// middlewares
A.use(c());
A.use(e.json());

// estáticos
A.use('/uploads', e.static(p.join(__dirname, 'uploads')));

// rutas (mismos prefijos funcionales)
A.use('/api/auth', R_a);
A.use('/api/products', R_pr);
A.use('/api/cart', R_ca);
A.use('/api/orders', R_o);

// test
A.get('/', (req, res) => res.json({ message: 'API Tennis Store funcionando correctamente' }));

module.exports = A;
