import mongoose from "mongoose";

const conventionSchema = new mongoose.Schema(
  {
    numero: {
      type: String,
      required: true,
      unique: true,
    },
    site: {
      type: String,
      required: true,
    },
    dateDebut: {
      type: Date,
      required: true,
    },
    dateFin: {
      type: Date,
      required: true,
    },
    prestataire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    statut: {
      type: String,
      enum: ["brouillon", "en attente", "validée", "refusée", "signée"],
      default: "brouillon",
    },

    commentaireAdmin: { 
      type: String, 
      default: "" }, 


    documents: [
      {
        name: String,
        url: String,
      },
    ],



  },
  { timestamps: true }
);

export default mongoose.model("Convention", conventionSchema);
