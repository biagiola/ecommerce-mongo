
const express = require('express')
const router = express.Router()

const {
  getCategories,
  getCategory,
  createCategory,
  upateCategory,
  deteleCategory
} = require('../controllers/categories')

router.get('/', getCategories)

router.get('/:id', getCategory)

router.post('/', createCategory)

router.put('/:id', upateCategory)

router.delete('/:id', deteleCategory)

module.exports = router