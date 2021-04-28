function errorHandler(err, req, res, next) {
  if(err.name === 'UnauthorizedError') {
    // jwt authentication error
    return res.status(401).json({ message: 'The user is not authorized', error: err})
  }

  if(err.name === 'ValidationError') {
    //  validation error    
    return res.status(401).json({ message: err })
  }


  // default to 500 server error
  return res.status(200).json(err)
}

module.exports = errorHandler