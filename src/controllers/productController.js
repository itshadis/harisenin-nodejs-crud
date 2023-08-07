const productData = require('../modelknex/data.json');

const allProduct = (req, res) => {
  res.send({
    message: 'Data product retrieved',
    status: 'ok',
    data: productData
  })
}

const productDetail = (req, res) => {
  const { id } = req.params;
  const detailProduct = productData[Number(id)];

  if(!detailProduct) {
    return res.send({
      message: 'Data product not found',
      status: 'error',
      data: null
    })
  }

  res.send({
    message: 'Data product retrieved',
    status: 'ok',
    data: detailProduct
  })
}

module.exports = { allProduct, productDetail }