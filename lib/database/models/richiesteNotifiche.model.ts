import { Document, Schema, model, models } from "mongoose";

export interface IRichiesteNotifiche extends Document {
  email: string;
  nomeMateriale: string;
  finitura?: string;
  createdAt: Date;
  dataRipristino: Date;
}

const RichiesteNotifichesSchema = new Schema(
  {
    email: { type: String, required: true },
    nomeMateriale: { type: String, required: true },
    finitura: { type: String },
    createdAt: { type: Date, default: Date.now },
    dataRipristino: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Imposta esplicitamente createdAt come non immutabile
RichiesteNotifichesSchema.path("createdAt").immutable(false);

// Forza la ricompilazione del modello se già esiste
const IRichiesteNotifiches =
  models.RichiesteNotifiches || model<IRichiesteNotifiche>(
    "RichiesteNotifiches",
    RichiesteNotifichesSchema
  );

export default IRichiesteNotifiches;
