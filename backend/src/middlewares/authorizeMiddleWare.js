


export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // si l’utilisateur n’est pas connecté
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // si l’utilisateur n’a pas le rôle autorisé
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé : rôle non autorisé" });
    }

    next();
  };
};

