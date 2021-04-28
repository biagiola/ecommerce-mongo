const multer = require('multer')

var FYLE_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg': 'jpeg',
  'image/jpg' : 'jpg'
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FYLE_TYPE_MAP[file.mimetype]
    let uploadError = new Error('invalid image type')
    
    if(isValid) uploadError = null
    
    cb(uploadError, 'public/uploads')
  },
  filename: function(req, file, cb) {
    const fileName = file.originalname.split(' ').join('-') // replace(' ', '-')
    const extension = FYLE_TYPE_MAP[file.mimetype]
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  }
})

var uploadOptions = multer({ storage: storage })

module.exports = uploadOptions