import { Document, Schema, model, models } from "mongoose";

export interface IRichiesta extends Document {
  emailMateriale: string;
  emailUser: string;
  nomeMateriale: string;
  distanza: string;
  misure?: string;
  image?: string;
  finitura?: string;  
}

const RichiestaSchema = new Schema(
  {
    emailMateriale: {type: String, required: true},
    emailUser: {type: String, required: true},
    nomeMateriale: {type: String, required: true},
    distanza: {type: String, required: true},
    misure: {type: String},
    image: {type: String},
    finitura: {type: String},
  },
  { timestamps: true }
);

const Richiesta = models.Richiesta || model<IRichiesta>("Richiesta", RichiestaSchema);

export default Richiesta;
