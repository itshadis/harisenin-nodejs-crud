const express = require('express');
const { allProduct, productDetail } = require('../controllers/productController');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/', verifyToken, allProduct);
router.get('/:id', verifyToken, productDetail);

module.exports = router;