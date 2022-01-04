const express = require('express')
const router = express.Router()

const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  totalSales,
  getCount
} = require('../controllers/orders')

router.get('/', getOrders)

router.get('/:id', getOrder)

router.post('/', createOrder)

router.put('/:id', updateOrder)

router.delete('/:id', deleteOrder)

router.get('/get/totalsales', totalSales)

router.get('/get/count', getCount)
  
module.exports = router