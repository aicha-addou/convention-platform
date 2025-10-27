import express from "express";
import User from "../models/User.js";
import { protect } from "../middlewares/authMiddleWare.js";

const router = express.Router();

// Créer un utilisateur
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 👤 Récupérer les infos du profil connecté
router.get("/me", protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 📝 Modifier les infos de profil
router.put("/me", protect, async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ message: "Profil mis à jour avec succès", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ Lister tous les utilisateurs (utile pour admin only, plus tard)
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

export default router;
