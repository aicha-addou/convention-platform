import express from "express";
import Convention from "../models/Convention.js";
import { protect } from "../middlewares/authMiddleWare.js";
import { authorize } from "../middlewares/authorizeMiddleWare.js";

const router = express.Router();

/* ============================================================
   🧾 CRUD CONVENTIONS
   ============================================================ */

/**
 * 🟢 GET /api/conventions
 * Récupère toutes les conventions (admin uniquement)
 */
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const conventions = await Convention.find()
      .populate("prestataire", "name email role")
      .sort({ createdAt: -1 });

    res.json(conventions);
  } catch (error) {
    console.error("Erreur récupération conventions :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * 🟢 GET /api/conventions/mine
 * Récupère les conventions du prestataire connecté
 */
router.get("/mine", protect, authorize("prestataire"), async (req, res) => {
  try {
    const conventions = await Convention.find({ prestataire: req.user._id })
      .sort({ createdAt: -1 });

    res.json(conventions);
  } catch (error) {
    console.error("Erreur récupération conventions prestataire :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * 🟢 GET /api/conventions/:id
 * Récupère une convention spécifique
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const convention = await Convention.findById(req.params.id)
      .populate("prestataire", "name email");

    if (!convention) {
      return res.status(404).json({ message: "Convention non trouvée" });
    }

    // Si l'utilisateur est prestataire, il ne peut voir que ses conventions
    if (
      req.user.role === "prestataire" &&
      convention.prestataire.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Accès refusé à cette convention" });
    }

    res.json(convention);
  } catch (error) {
    console.error("Erreur récupération convention :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * 🟢 POST /api/conventions
 * Crée une nouvelle convention (admin uniquement)
 */
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const { numero, site, dateDebut, dateFin, prestataire } = req.body;

    if (!numero || !site || !dateDebut || !dateFin || !prestataire) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    // Vérifie que le numéro n’existe pas déjà
    const existing = await Convention.findOne({ numero });
    if (existing) {
      return res.status(400).json({ message: "Une convention avec ce numéro existe déjà." });
    }

    const convention = await Convention.create(req.body);
    res.status(201).json({ message: "Convention créée avec succès", convention });
  } catch (error) {
    console.error("Erreur création convention :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * 🟢 PUT /api/conventions/:id
 * Met à jour une convention (admin uniquement)
 */
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const convention = await Convention.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!convention) {
      return res.status(404).json({ message: "Convention non trouvée." });
    }

    res.json({ message: "Convention mise à jour avec succès", convention });
  } catch (error) {
    console.error("Erreur mise à jour convention :", error);
    res.status(400).json({ message: "Erreur lors de la mise à jour." });
  }
});

/**
 * 🟢 DELETE /api/conventions/:id
 * Supprime une convention (admin uniquement)
 */
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const convention = await Convention.findByIdAndDelete(req.params.id);

    if (!convention) {
      return res.status(404).json({ message: "Convention non trouvée." });
    }

    res.json({ message: "Convention supprimée avec succès" });
  } catch (error) {
    console.error("Erreur suppression convention :", error);
    res.status(400).json({ message: "Erreur lors de la suppression." });
  }
});

export default router;
