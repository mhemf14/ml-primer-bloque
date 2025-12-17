import { ZONES } from './types';

export function drawFromCastillo(G, playerID, n = 1) {
  const p = G.players[playerID];
  for (let i = 0; i < n; i++) {
    if (p[ZONES.CASTILLO].length === 0) return;
    p[ZONES.MANO].push(p[ZONES.CASTILLO].shift());
  }
}

export function millCastilloToCementerio(G, playerID, n = 1) {
  const p = G.players[playerID];
  for (let i = 0; i < n; i++) {
    if (p[ZONES.CASTILLO].length === 0) return;
    p[ZONES.CEMENTERIO].push(p[ZONES.CASTILLO].shift());
  }
}

export function regroupOros(G, playerID) {
  const p = G.players[playerID];
  p[ZONES.RESERVA_ORO].push(...p[ZONES.ORO_PAGADO]);
  p[ZONES.ORO_PAGADO] = [];
}