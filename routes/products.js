const ImageUploader = require('../helpers/ImageUploader')
const express = require('express')
const router = express.Router()

const {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  totalProducts,
  featuredProducts,
  updateGallery
} = require('../controllers/products')

router.get('/', getProduct)

router.get('/:id', getProducts)

router.post('/', ImageUploader.single('image'), createProduct)

router.put('/:id', updateProduct)

router.delete('/:id', deleteProduct)

router.get('/get/count', totalProducts)

router.get('get/featured/:count', featuredProducts)

router.put('/gallery-images/:id', ImageUploader.array('images', 5), updateGallery)

module.exports = router