import { Document, Schema, model, models } from "mongoose";

// finitura, nome, lunghezza, larghezza, spessore, immagine, email
export interface IMagazzino extends Document {
  finitura: string;
  nome: string;
  lunghezza: number;
  larghezza: number;
  spessore: number;
  immagine: string;
  email: string;
  quantity: number;
}

const MagazzinoSchema = new Schema(
  {
    finitura: {
      type: String,
      required: true,
    },
    nome: {
      type: String,
      required: true,
    },
    lunghezza: {
      type: Number,
      required: true,
    },
    larghezza: {
      type: Number,
      required: true,
    },
    spessore: {
      type: Number,
      required: true,
    },
    immagine: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Magazzino =
  models.Magazzino || model<IMagazzino>("Magazzino", MagazzinoSchema);

export default Magazzino;
