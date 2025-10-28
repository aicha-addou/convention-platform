import express from "express";
import User from "../models/User.js";
import { protect } from "../middlewares/authMiddleWare.js";
import { authorize } from "../middlewares/authorizeMiddleWare.js";


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


// 🧾 Récupérer tous les utilisateurs (admin only)
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

//  Modifier un utilisateur (admin only)
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: "Erreur de mise à jour" });
  }
});

// ❌ Supprimer un utilisateur (admin only)
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(400).json({ message: "Erreur de suppression" });
  }
});


export default router;
