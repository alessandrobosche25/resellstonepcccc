import { Document, Schema, model, models } from "mongoose";

export interface INotifiche extends Document {
  email: string;
  titolo: string;
  descrizione: string;
  link:string;  
  createdAt: Date;
  image: string;
  linkRicerca: string;
  mittente: string;
  nomeMateriale: string;
}

const NotificheSchema = new Schema(
  {
    email: {type: String, required: true},
    titolo: {type: String, required: true},
    descrizione: {type: String, required: true},
    link: {type: String, required: true},
    createdAt: {type: String, required: false},
    image: {type: String, required: true},
    linkRicerca: {type: String, required: true},
    mittente: {type: String, required: true},
    nomeMateriale: {type: String, required: true},
  },
  { timestamps: true }
);

const Notifiche = models.Notifiche || model<INotifiche>("Notifiche", NotificheSchema);

export default Notifiche;
