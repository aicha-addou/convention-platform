import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// 🔐 Enregistrement (Register)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      {return res.status(400).json({ message: "Email déjà utilisé" });}

    const user = await User.create({ name, email, password, role });

    return res.status(201).json({ message: "Utilisateur créé avec succès", user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 🔑 Connexion (Login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {return res.status(400).json({ message: "Utilisateur introuvable" });}

       
    if (user.status === "inactif") {
      return res.status(403).json({ message: "Compte désactivé. Contactez un administrateur." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {return res.status(400).json({ message: "Mot de passe incorrect" });}

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ message: "Connexion réussie", token, user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
