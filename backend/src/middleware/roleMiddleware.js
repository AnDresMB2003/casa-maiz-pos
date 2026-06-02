function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "No autorizado",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "No tienes permiso para acceder a este recurso",
      });
    }

    next();
  };
}

module.exports = roleMiddleware;
