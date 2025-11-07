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
 * Crée une nouvelle convention (admin/prestataire uniquement)
 */
router.post("/", protect, authorize("admin", "prestataire"), async (req, res) => {
  try {
    const { numero, site, dateDebut, dateFin, prestataire, statut } = req.body;

    // ✅ Si l'utilisateur est prestataire, on force son propre ID et un statut "en attente"
    const prestataireId = req.user.role === "prestataire" ? req.user._id : prestataire;
    const statutFinal = req.user.role === "prestataire" ? "en attente" : statut || "brouillon";

    if (!numero || !site || !dateDebut || !dateFin) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    const existing = await Convention.findOne({ numero });
    if (existing) {
      return res.status(400).json({ message: "Une convention avec ce numéro existe déjà." });
    }

    const convention = await Convention.create({
      numero,
      site,
      dateDebut,
      dateFin,
      prestataire: prestataireId,
      statut: statutFinal,
    });

     res.status(201).json({
      message:
        statutFinal === "brouillon"
          ? "Convention enregistrée en brouillon."
          : "Convention soumise à GRDF.",
      convention,
    });
  } catch (error) {
    console.error("Erreur création convention :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✏️ Modification d'une convention (prestataire uniquement, si brouillon)
router.put("/:id", protect, authorize("prestataire"), async (req, res) => {
  try {
    const convention = await Convention.findById(req.params.id);

    if (!convention) {
      return res.status(404).json({ message: "Convention introuvable." });
    }

    // Vérifie que le prestataire est bien le propriétaire
    if (convention.prestataire.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès non autorisé." });
    }

    // Ne peut modifier que si statut = brouillon
    if (convention.statut !== "brouillon") {
      return res.status(400).json({
        message: "Impossible de modifier une convention déjà soumise ou validée.",
      });
    }

    Object.assign(convention, req.body);
    await convention.save();

    res.json({ message: "Brouillon mis à jour avec succès.", convention });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});


/**
 * 🟢 PUT /api/conventions/:id
 * Met à jour une convention (admin uniquement) --- a enlver plutard !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
    const { id } = req.params;

    console.log("🗑️ Suppression demandée pour l'ID :", id);

    // Vérifie si l'ID est valide pour MongoDB
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID de convention invalide." });
    }

    const convention = await Convention.findById(id);

    if (!convention) {
      console.log("❌ Aucune convention trouvée avec cet ID.");
      return res.status(404).json({ message: "Convention non trouvée." });
    }

    await convention.deleteOne();

    console.log("✅ Convention supprimée avec succès :", id);
    res.json({ message: "Convention supprimée avec succès." });
  } catch (error) {
    console.error("💥 Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression." });
  }
});

/**
// 🟢 Validation / refus d’une convention (admin only)
 */
router.put("/:id/validation", protect, authorize("admin"), async (req, res) => {
  try {
    const { statut, commentaireAdmin } = req.body;

    const statutsAutorises = ["validée", "refusée"];
    if (!statutsAutorises.includes(statut)) {
      return res.status(400).json({ message: "Statut non valide." });
    }

    const convention = await Convention.findById(req.params.id);
    if (!convention) {
      return res.status(404).json({ message: "Convention introuvable." });
    }

    // 🚫 Vérifie si déjà traitée
    if (convention.statut !== "en attente") {
      return res.status(400).json({
        message: `Impossible de ${statut === "validée" ? "valider" : "refuser"} cette convention car elle est déjà "${convention.statut}".`,
      });
    }

    // ✅ Met à jour
    convention.statut = statut;
    convention.commentaireAdmin = commentaireAdmin || "";
    await convention.save();

    res.json({
      message: `Convention ${statut === "validée" ? "validée ✅" : "refusée ❌"} avec succès.`,
      convention,
    });
  } catch (error) {
    console.error("Erreur validation convention :", error);
    res.status(500).json({ message: "Erreur serveur lors de la validation." });
  }
});





export default router;
