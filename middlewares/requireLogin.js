module.exports = (req, res, next) => {
  // Call next when middleware is complete
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in ' });
    // We don't call next because we don't actually want it to go to the next middleware/route
  }
  next();
};
