import { Document, Schema, model, models } from "mongoose";

export interface IUsers extends Document {
  nomeAzienda: string;
  email: string;
  indirizzo: string;
  telefono: number;
  password: string;
  fileBase64: string;
  TourSeen: boolean;
  token: string;
  hasAccess: boolean;
  stripeDetails: {
    customerId: string;
    subscriptionId: string;
    priceId: string;
    stauts: string;
    payment_status: string;
    recurringSubScription: boolean;
  };
  minimumInsert: boolean;
}

const UsersSchema = new Schema(
  {
    TourSeen: { type: Boolean, required: true, default: false },
    nomeAzienda: { type: String, required: true },
    indirizzo: { type: String, required: true },
    telefono: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Changed from 'pwd' to 'password'
    fileBase64: { type: String, required: true }, // Changed from 'filebase64' to 'fileBase64'
    token: { type: String, required: true },
    hasAccess: { type: Boolean, required: true, default: false },
    stripeDetails: {
      type: {
        customerId: { type: String, default: "" },
        subscriptionId: { type: String, default: "" },
        priceId: { type: String, default: "" },
        status: { type: String, default: "" },
        payment_status: { type: String, default: "" },
        recurringSubScription: { type: Boolean, default: true },
      },
      default: {
        customerId: "",
        subscriptionId: "",
        priceId: "",
        status: "",
        payment_status: "",
        recurringSubScription: true,
      },
    },
    minimumInsert: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Users = models.Users || model<IUsers>("Users", UsersSchema);

export default Users;
