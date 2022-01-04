const { Order } = require('../models/order')
const { OrderItem } = require('../models/order-item')

const getOrder = async (req, res) => {
  const orderList = await Order.findById(req.params.id)
  .populate('user', 'name email')
  .populate({ 
    path: 'orderItems', populate: {
      path: 'product', populate: 'category'}
  })
  //.populate('orderItems')
  
  
  if(!orderList) {
    return res.status(500).json({ success: false })
  }
  res.status(200).send(orderList)

}

const getOrders = async (req, res) => {
  const orderList = await Order.find().populate('user', 'name email').sort({'dateOrdered': -1})

  if(!orderList) {
    return res.status(500).json({ success: false })
  } 
  
  res.send(orderList)
}

const createOrder = async (req, res) => {
  let orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
    let newOrderItem = new OrderItem({
      quantity: orderItem.quantity,
      product: orderItem.product
    })

    newOrderItem = await newOrderItem.save()

    return newOrderItem._id
  }))

  const orderItemsIdsResolved = await orderItemsIds
  console.log(orderItemsIdsResolved)

  const totalPrices = await Promise.all(orderItemsIdsResolved.map( async (orderItemId) => {
    const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
    const totalPrice = orderItem.product.price * orderItem.quantity
    return totalPrice
  }))
  
  const totalPrice = await totalPrices.reduce((a,b) => a+b, 0)

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  })
  order = await order.save()

  if(!order)
    return res.status(400).send('The order cannot be created.')

  res.send(order)

}

const updateOrder = async(req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status
    },
    { new: true }
  )

  if(!order) return res.status(400).send('The category cannot be created.')

  res.send(order)
}

const deleteOrder = async (req, res) => {
  Order.findByIdAndRemove(req.params.id).then( async order => {
    if(!order) {
      return res.status(404).json({ success: false, message: 'Order not found.'})
    } else {
      await order.orderItems.map( async orderItem => {
        await OrderItem.findByIdAndRemove(orderItem)
      })
      return res.status(200).json({ success: true, message: 'Order was deleted.' })
    }
  }).catch(err => {
    return res.status(500).json({ success: false, error: err })
  })
}

const totalSales = async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum : '$totalPrice' }}}
  ])

  if(!totalSales)
    return res.status(400).send('The order sales cannot be generated')

  res.send({ totalsales: totalSales.pop().totalSales })
}

const getCount = async (req, res) => {
  const orderCount = await Order.countDocuments(count => count)

  if(!orderCount) 
    return res.status(500).json({ success: false })

  res.send({ 
    orderCount: orderCount
  })
}

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  totalSales,
  getCount
}