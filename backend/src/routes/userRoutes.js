import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { protect } from "../middlewares/authMiddleWare.js";
import { authorize } from "../middlewares/authorizeMiddleWare.js";

const router = express.Router();

/* ==========================
   🔹  ROUTES UTILISATEURS
   ========================== */

// 👥 Créer un utilisateur (public ou admin selon ton besoin futur)
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

// 📝 Modifier les infos de profil connecté
router.put("/me", protect, async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({ message: "Profil mis à jour avec succès", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ==========================
   🔒  CHANGEMENT MOT DE PASSE
   ========================== */
router.put("/change-password", protect, async (req, res) => {
  try {
    console.log("🟢 Requête reçue sur /change-password");

    const { currentPassword, newPassword } = req.body;
    console.log("➡️ Body reçu :", req.body);

    if (!currentPassword || !newPassword) {
      console.log("❌ Champs manquants");
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires." });
    }

    // Vérifie si l'utilisateur est bien authentifié
    console.log("👤 Utilisateur connecté :", req.user?._id);
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      console.log("❌ Utilisateur non trouvé en base");
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Vérification de l'ancien mot de passe
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log("🔐 Mot de passe actuel correct ?", isMatch);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Ancien mot de passe incorrect." });
    }

    // Mise à jour du mot de passe
    user.password = newPassword;
    await user.save();

    console.log("✅ Mot de passe mis à jour avec succès !");
    return res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    console.error("💥 Erreur dans /change-password :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

/* ==========================
   🔐  ROUTES ADMIN ONLY
   ========================== */

// 👥 Récupérer tous les utilisateurs
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✏️ Modifier un utilisateur (admin only)
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    res.json(updatedUser);
  } catch {
    res.status(400).json({ message: "Erreur de mise à jour" });
  }
});

// ❌ Supprimer un utilisateur (admin only)
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });
  } catch {
    res.status(400).json({ message: "Erreur de suppression" });
  }
});

export default router;
