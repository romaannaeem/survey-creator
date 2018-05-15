module.exports = (req, res, next) => {
  // Call next when middleware is complete
  if (req.user.credits < 1) {
    return res.status(403).send({ error: 'You do not have enough credits.' });
    // We don't call next because we don't actually want it to go to the next middleware/route
  }
  next();
};
