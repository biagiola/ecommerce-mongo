const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  orderItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderItem',
    required: true
  }],
  shippingAddress1: {
    type: String,
    required: true
  },
  shippingAddress2: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'Pending'
  },
  totalPrice: {
    type: Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dateOrdered: {
    type: Date,
    default: Date.now
  }
})

orderSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

orderSchema.set('toJSON', {
  virtuals: true,
})

exports.Order = mongoose.model('Order', orderSchema)

/*
{
 "ordersItems" : [
   {
     "quantity": 3,
     "product": "60820d5f98a44c58e2a29e63"
   },
   {
     "quantity": 2,
     "product": "60821a1d98a44c58e2a29e65"
   }
 ],
 "shippingAddress1": "Mcal. Lopez, 1045",
 "shippingAddress2": "1-0",
 "city": "Lambare",
 "zip": "0000",
 "country": "Paraguay",
 "phone": "+959972194552",
 "user": "60842431999e4726e1f6654f"
}

*/
