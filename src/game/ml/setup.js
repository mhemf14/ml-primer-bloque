import { ZONES } from './types';

function makeDeck50() {
  const deck = [];
  for (let i = 0; i < 30; i++) deck.push('ORO_BASICO');
  for (let i = 0; i < 20; i++) deck.push('ALIADO_2_2');
  return deck;
}

export function createPlayerState() {
  return {
    [ZONES.CASTILLO]: makeDeck50(),
    [ZONES.MANO]: [],
    [ZONES.RESERVA_ORO]: ['ORO_BASICO'],
    [ZONES.ORO_PAGADO]: [],
    [ZONES.DEFENSA]: [],
    [ZONES.ATAQUE]: [],
    [ZONES.APOYO]: [],
    [ZONES.CEMENTERIO]: [],
    [ZONES.DESTIERRO]: [],
    [ZONES.EFECTOS_PERMANENTES]: [],
    flags: {
      oroJugadoEnVigilia: false,
      lastAgrupacionTurn: 0,
    }
  };
}