const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint ' })
}

const errors = (error, req, res, next) => {
  // postgreSQL ERRORS

  if (error.detail) {
    return res.status(404).send({ error: error.detail })
  }
  // JWT ERRORS
  else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token',
    })
  }

  next(error)
}

module.exports = {
  unknownEndpoint,
  errors,
}
