// src/routes/draftRoutes.js
import express from "express";
import { protect, authorize } from "../middlewares/authorizeMiddleWare.js";
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
    res.status(201).json(draft);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 📋 Récupérer les brouillons du prestataire
router.get("/", protect, authorize("prestataire"), async (req, res) => {
  try {
    const drafts = await DraftConvention.find({ prestataire: req.user._id });
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✏️ Modifier un brouillon
router.put("/:id", protect, authorize("prestataire"), async (req, res) => {
  try {
    const draft = await DraftConvention.findOneAndUpdate(
      { _id: req.params.id, prestataire: req.user._id },
      req.body,
      { new: true }
    );
    if (!draft) return res.status(404).json({ message: "Brouillon introuvable" });
    res.json(draft);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 📤 Soumettre un brouillon (le transformer en convention)
router.post("/:id/submit", protect, authorize("prestataire"), async (req, res) => {
  try {
    const draft = await DraftConvention.findOne({
      _id: req.params.id,
      prestataire: req.user._id,
    });

    if (!draft) return res.status(404).json({ message: "Brouillon introuvable" });

    const convention = await Convention.create({
      numero: draft.numero,
      site: draft.site,
      dateDebut: draft.dateDebut,
      dateFin: draft.dateFin,
      prestataire: draft.prestataire,
      statut: "en attente",
    });

    await draft.deleteOne();
    res.json({ message: "✅ Brouillon soumis à GRDF", convention });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🗑️ Supprimer un brouillon
router.delete("/:id", protect, authorize("prestataire"), async (req, res) => {
  try {
    const deleted = await DraftConvention.findOneAndDelete({
      _id: req.params.id,
      prestataire: req.user._id,
    });
    if (!deleted)
      return res.status(404).json({ message: "Brouillon introuvable" });
    res.json({ message: "Brouillon supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
