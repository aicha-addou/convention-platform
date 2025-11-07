import mongoose from "mongoose";

const draftConventionSchema = new mongoose.Schema(
  {
    numero: { type: String }, // facultatif dans un brouillon
    site: { type: String },
    dateDebut: { type: Date },
    dateFin: { type: Date },
    prestataire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    statut: {
      type: String,
      enum: ["brouillon"],
      default: "brouillon",
    },
  },
  { timestamps: true }
);

export default mongoose.model("DraftConvention", draftConventionSchema);
