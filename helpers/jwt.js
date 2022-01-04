const expressJwt = require('express-jwt')

function authJwt() {
  const secret = process.env.SECRET
  const api = process.env.API_URL

  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked
  }).unless({
    path: [
      {url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS']},
      {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']},
      {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']},
      `${api}/users/login`,
      `${api}/users/register`,
    ]
  })
}

async function isRevoked(req, payload, done) {
  console.log('isRevoked')
  console.log(payload.isAdmin) // where is comming from payload(isAdmin) exactly?
  
  if(!payload.isAdmin) {
    console.log('!payload.isAdmin')
    done(null, true)
    //done()
  }

  done()
}

module.exports = authJwt