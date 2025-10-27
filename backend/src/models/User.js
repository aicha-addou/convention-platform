import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["prestataire", "referent", "admin"],
      default: "prestataire",
    },
  },
  { timestamps: true }
);

// 🔒 Hachage automatique du mot de passe
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {return next();}
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

export default mongoose.model("User", userSchema);
