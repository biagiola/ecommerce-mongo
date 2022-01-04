const express = require('express')
const router = express.Router()
const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  loginUser,
  registerUser,
  deleteUser,
  totalUsers,
} = require('../controllers/users')

router.post('/login', loginUser)

router.post('/register', registerUser)

router.get('/:id', getUser)

router.get('/', getUsers)

router.post('/', createUser) 

router.put('/:id', updateUser)

router.delete('/:id', deleteUser)

router.get('/get/count', totalUsers)

module.exports =router
