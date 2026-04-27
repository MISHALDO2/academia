function authMiddleware(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "No autorizado" });
  }

  next();
}

module.exports = authMiddleware;