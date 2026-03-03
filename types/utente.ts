// ho fatto un file a parte per IMagazzino per evitare di importare tutto il file types.ts e perche o richiamo su diversi componenti se vi serve capire come (andate su property-card-tsx) riga 7
export interface IUsers  {
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
  
  