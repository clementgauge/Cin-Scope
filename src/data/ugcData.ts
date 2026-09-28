import { UgcShowtime } from '../types';

export interface UgcCinemaLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  postalCode: string;
  lat: number;
  lng: number;
  hasImax?: boolean;
  screenCount: number;
  distanceKm?: number;
}

export const UGC_CINEMAS: UgcCinemaLocation[] = [
  // Paris & Île-de-France
  {
    id: 'ugc-les-halles',
    name: 'UGC Ciné Cité Les Halles',
    city: 'Paris',
    address: 'Forum des Halles, Niveau -3, 75001 Paris',
    postalCode: '75001',
    lat: 48.8619,
    lng: 2.3470,
    hasImax: true,
    screenCount: 27,
  },
  {
    id: 'ugc-bercy',
    name: 'UGC Ciné Cité Bercy',
    city: 'Paris',
    address: '2 Cour Saint-Émilion, 75012 Paris',
    postalCode: '75012',
    lat: 48.8329,
    lng: 2.3871,
    hasImax: true,
    screenCount: 18,
  },
  {
    id: 'ugc-gobelins',
    name: 'UGC Gobelins',
    city: 'Paris',
    address: '66 bis Avenue des Gobelins, 75013 Paris',
    postalCode: '75013',
    lat: 48.8344,
    lng: 2.3533,
    screenCount: 11,
  },
  {
    id: 'ugc-normandie',
    name: 'UGC Normandie (Champs-Élysées)',
    city: 'Paris',
    address: '116 bis Avenue des Champs-Élysées, 75008 Paris',
    postalCode: '75008',
    lat: 48.8718,
    lng: 2.3015,
    screenCount: 4,
  },
  {
    id: 'ugc-paris-19',
    name: 'UGC Ciné Cité Paris 19',
    city: 'Paris',
    address: '166 Boulevard Macdonald, 75019 Paris',
    postalCode: '75019',
    lat: 48.8988,
    lng: 2.3782,
    hasImax: true,
    screenCount: 14,
  },
  {
    id: 'ugc-la-defense',
    name: 'UGC Ciné Cité La Défense',
    city: 'Puteaux / La Défense',
    address: 'Centre Commercial Westfield Les 4 Temps, 92092 Puteaux',
    postalCode: '92800',
    lat: 48.8913,
    lng: 2.2392,
    hasImax: true,
    screenCount: 16,
  },
  {
    id: 'ugc-creteil',
    name: 'UGC Ciné Cité Créteil',
    city: 'Créteil',
    address: 'Centre Commercial Créteil Soleil, 94000 Créteil',
    postalCode: '94000',
    lat: 48.7772,
    lng: 2.4578,
    screenCount: 18,
  },
  // Lyon
  {
    id: 'ugc-confluence',
    name: 'UGC Ciné Cité Confluence',
    city: 'Lyon',
    address: '112 Cours Charlemagne, 69002 Lyon',
    postalCode: '69002',
    lat: 45.7423,
    lng: 4.8184,
    hasImax: true,
    screenCount: 14,
  },
  {
    id: 'ugc-cite-internationale',
    name: 'UGC Ciné Cité Internationale',
    city: 'Lyon',
    address: '80 Quai Charles de Gaulle, 69006 Lyon',
    postalCode: '69006',
    lat: 45.7865,
    lng: 4.8569,
    screenCount: 14,
  },
  // Bordeaux
  {
    id: 'ugc-bordeaux',
    name: 'UGC Ciné Cité Bordeaux',
    city: 'Bordeaux',
    address: 'Rue Georges Bonnac, 33000 Bordeaux',
    postalCode: '33000',
    lat: 44.8385,
    lng: -0.5843,
    screenCount: 18,
  },
  // Strasbourg
  {
    id: 'ugc-strasbourg',
    name: 'UGC Ciné Cité Strasbourg Étoile',
    city: 'Strasbourg',
    address: '25 Route du Rhin, 67100 Strasbourg',
    postalCode: '67100',
    lat: 48.5721,
    lng: 7.7612,
    hasImax: true,
    screenCount: 22,
  },
  // Lille
  {
    id: 'ugc-lille',
    name: 'UGC Ciné Cité Lille',
    city: 'Lille',
    address: '40 Rue de Béthune, 59800 Lille',
    postalCode: '59800',
    lat: 50.6342,
    lng: 3.0645,
    screenCount: 14,
  },
  // Toulouse
  {
    id: 'ugc-toulouse',
    name: 'UGC Montaudran',
    city: 'Toulouse',
    address: 'Place Marcel Bouilloux-Lafont, 31400 Toulouse',
    postalCode: '31400',
    lat: 43.5714,
    lng: 1.4795,
    screenCount: 7,
  },
  // Nantes
  {
    id: 'ugc-nantes',
    name: 'UGC Ciné Cité Atlantis',
    city: 'Saint-Herblain / Nantes',
    address: 'Boulevard Salvador Allende, 44800 Saint-Herblain',
    postalCode: '44800',
    lat: 47.2272,
    lng: -1.6318,
    screenCount: 12,
  },
];

// Calculate Haversine distance in km
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Generate realistic showtimes for a film at closest UGC cinemas
export function getUgcShowtimesForMovie(
  movieTitle: string,
  userLat?: number,
  userLng?: number,
  targetCity?: string
): UgcShowtime[] {
  let cinemas = [...UGC_CINEMAS];

  if (targetCity) {
    const matched = cinemas.filter((c) =>
      c.city.toLowerCase().includes(targetCity.toLowerCase())
    );
    if (matched.length > 0) cinemas = matched;
  }

  // If user coordinates provided, sort by proximity
  if (userLat !== undefined && userLng !== undefined) {
    cinemas = cinemas
      .map((c) => ({
        ...c,
        distanceKm: calculateDistance(userLat, userLng, c.lat, c.lng),
      }))
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  } else {
    // Default reference Paris (Châtelet)
    const refLat = 48.8584;
    const refLng = 2.3488;
    cinemas = cinemas
      .map((c) => ({
        ...c,
        distanceKm: calculateDistance(refLat, refLng, c.lat, c.lng),
      }))
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }

  const isSpiderMan = movieTitle.toLowerCase().includes('spider') || movieTitle.toLowerCase().includes('brand new day');

  // Take the 5 closest
  return cinemas.slice(0, 5).map((cinema, idx) => {
    let times: string[];
    let format: string;

    if (idx === 0) {
      times = isSpiderMan
        ? ['13:45', '16:30', '19:15', '21:00', '22:30']
        : ['14:00', '16:45', '19:30', '22:15'];
      format = cinema.hasImax ? 'VOSTFR & VF · Salle IMAX Laser' : 'VOSTFR & VF · Son Dolby Atmos';
    } else if (idx === 1) {
      times = isSpiderMan ? ['14:15', '17:00', '20:15', '22:45'] : ['14:30', '17:15', '20:00'];
      format = 'VOSTFR · Salle UGC Confort';
    } else if (idx === 2) {
      times = isSpiderMan ? ['13:30', '16:15', '19:00', '21:45'] : ['15:00', '18:00', '20:45'];
      format = 'VF · Son Numérique 7.1';
    } else {
      times = ['14:00', '17:30', '20:30'];
      format = 'VOSTFR / VF';
    }

    const encodedTitle = encodeURIComponent(movieTitle);
    return {
      cinemaName: cinema.name,
      address: cinema.address,
      city: cinema.city,
      postalCode: cinema.postalCode,
      distanceKm: cinema.distanceKm,
      format,
      times,
      bookingUrl: `https://www.ugc.fr/reservation/seances.html?film=${encodedTitle}`,
      lat: cinema.lat,
      lng: cinema.lng,
    };
  });
}
