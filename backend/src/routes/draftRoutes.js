import express from "express";
import { protect, authorize } from "../middlewares/authMiddleWare.js";
import DraftConvention from "../models/DraftConvention.js";
import Convention from "../models/Convention.js";

const router = express.Router();

// 💾 Créer un brouillon
router.post("/", protect, authorize("prestataire"), async (req, res) => {
  try {
    const draft = await DraftConvention.create({
      ...req.body,
      prestataire: req.user._id,
    });
    res.status(201).json({ message: "Brouillon enregistré.", draft });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la création du brouillon." });
  }
});

// ✏️ Modifier un brouillon
router.put("/:id", protect, authorize("prestataire"), async (req, res) => {
  try {
    const draft = await DraftConvention.findById(req.params.id);

    if (!draft) return res.status(404).json({ message: "Brouillon introuvable." });
    if (draft.prestataire.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Accès refusé." });

    Object.assign(draft, req.body);
    await draft.save();

    res.json({ message: "Brouillon mis à jour avec succès.", draft });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour." });
  }
});

// 📤 Soumettre un brouillon → création d'une convention officielle
router.post("/:id/submit", protect, authorize("prestataire"), async (req, res) => {
  try {
    const draft = await DraftConvention.findById(req.params.id);
    if (!draft) return res.status(404).json({ message: "Brouillon introuvable." });

    // Vérifie les champs requis avant la soumission
    if (!draft.numero || !draft.site || !draft.dateDebut || !draft.dateFin) {
      return res.status(400).json({
        message: "Tous les champs doivent être remplis avant la soumission.",
      });
    }

    // Création de la convention officielle
    const convention = await Convention.create({
      numero: draft.numero,
      site: draft.site,
      dateDebut: draft.dateDebut,
      dateFin: draft.dateFin,
      prestataire: draft.prestataire,
      statut: "en attente",
    });

    // Supprime le brouillon
    await DraftConvention.findByIdAndDelete(req.params.id);

    res.status(201).json({
      message: "✅ Convention soumise à GRDF.",
      convention,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la soumission." });
  }
});

// 🗑️ Supprimer un brouillon
router.delete("/:id", protect, authorize("prestataire"), async (req, res) => {
  try {
    const draft = await DraftConvention.findById(req.params.id);
    if (!draft) return res.status(404).json({ message: "Brouillon introuvable." });
    if (draft.prestataire.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Accès refusé." });

    await DraftConvention.findByIdAndDelete(req.params.id);
    res.json({ message: "Brouillon supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la suppression." });
  }
});

export default router;
