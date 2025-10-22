import express from "express";
import User from "../models/User.js";

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

// Lister tous les utilisateurs
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

export default router;
