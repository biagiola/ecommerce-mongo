const { Product } = require('../models/product')
const { Category } = require('../models/category')
const mongoose = require('mongoose')


const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category')

  if(!product) return res.status(500).json({ success: false/* , message: 'The category is deleted' */})

  res.send(product)
}

const getProducts = async (req, res) => {
  // localhost:3000/api/v1/products?categories=2342342,234234
  let filter = {}
  console.log('categories', req.query.categories)
  if(req.query.categories) 
    filter = { category: req.query.categories.split(',') }
  
  const productList = await Product.find(filter).populate('category')
  
  if(!productList) res.status(500).json({ success: false })

  res.send(productList)
}

const createProduct = async (req, res) => {
  const category = await Category.findById(req.body.category)
  if(!category) return res.status(400).send('Invalid Category.')

  if(!req.file) {
    //return res.status(400).send('No image in the request.')
    const fileName = 'null image'  
  } 
    
  //const fileName = req.file.filename
  const basePath = `${req.protocol}://${req.get('host')}/public/upload/`

  //console.log(basePath, fileName)

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    //image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-1212.jpg"
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  })

  product = await product.save()

  if(!product) return res.status(500).send('The product cannot be created')

  res.send(product)
  
}

const updateProduct = async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)) 
    return res.status(400).send('Invalid Product Id')

  const category = await Category.findById(req.body.category)
  if(!category) return res.status(400).send('Invlid Category')

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  )

  if(!product) return res.status(500).send('The product cannot be updated.')

  res.send(product)
}

const deleteProduct = (req, res) => {
  Product.findByIdAndRemove(req.params.id).then(product => {
    if(!product) {
      return res.status(404).json({ success: false , message: 'product not found!' })
    } else {
      return res.status(200).json({ success: true, message: 'the product is deleted' })
    }
  })
}

const totalProducts = async (req, res) => {
  const productCount = await Product.countDocuments(count => count)

  if(!productCount) return res.status(500).json({ success: false })

  res.send({ 
    productCount: productCount
  })
}

const featuredProducts = async (req, res) => {
  const count = req.params.count ? req.params.count : 0
  const products = await Product.find({ isFeatured: true }).limit(+count)

  if(!products) return res.status(500).json({ success: false })

  res.send(products)
}

const updateGallery = async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)) 
    return res.status(400).send('Invalid Product Id')

    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`
    const files = req.files
    let imagesPaths = []

    if(files) {
      files.map(file => {
        imagesPaths.push(`${basePath}${file.fileName}`)
      })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    )

    if(!product) return res.status(500).send('The product cannot be updated.')

    res.send(product)
}

module.exports = {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  totalProducts,
  featuredProducts,
  updateGallery
}