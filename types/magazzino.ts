// ho fatto un file a parte per IMagazzino per evitare di importare tutto il file types.ts e perche o richiamo su diversi componenti se vi serve capire come (andate su property-card-tsx) riga 7
export interface IMagazzino {
    _id: string
    finitura: string
    nome: string
    lunghezza: number
    larghezza: number
    spessore: number
    immagine: string
    email: string
    quantity: number
  }
  
  