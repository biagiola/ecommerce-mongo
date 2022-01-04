const { Category } = require('../models/category')

const getCategories = async (req, res) => {
  const categoryList = await Category.find()

  if(!categoryList) {
    return res.status(500).json({success: false})
  } 
  res.status(200).send(categoryList)
}

const getCategory = async (req, res) => {
  const category = await Category.findById(req.params.id)

  if(!category) {
    return res.status(500).json({ massage: 'The category with the given ID was not found.' })
  }
  res.status(200).send(category)
}

const createCategory = async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color
  })
  category = await category.save();

  if(!category) return res.status(400).send('The category cannot be created.')

  res.send(category)
}

const upateCategory = async(req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon || category.icon,
      color: req.body.color,
    },
    { new: true }
  )

  if(!category) return res.status(400).send('The category cannot be created.')

  res.send(category)
}

const deteleCategory = (req, res) => {
  Category.findByIdAndRemove(req.params.id).then(category => {
    if(!category) {
      return res.status(404).json({ success: false, message: 'The category not found'})
    } else {
      return res.status(200).json({ success: true, message: 'The category is deleted'})
    }
  }).catch( err => {
    return res.status(500).json({ success: false, error: err})
  })
}

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  upateCategory,
  deteleCategory
}