import { TurnOrder } from 'boardgame.io/core';
import { CARDS } from './cards.db';
import { CARD_TYPE, PHASE, ZONES } from './types';
import { drawFromCastillo, millCastilloToCementerio, regroupOros } from './utils';
import { createPlayerState } from './setup';

export const MLPrimerBloque = {
  name: 'ml-primer-bloque',

  setup: () => ({
    players: {
      '0': createPlayerState(),
      '1': createPlayerState(),
    }
  }),

  turn: {
    order: TurnOrder.DEFAULT,
    onBegin: ({ G, ctx }) => {
      drawFromCastillo(G, ctx.currentPlayer, 1);
    },
    phases: {
      agrupacion: {
        onBegin: ({ G, ctx }) => {
          const p = G.players[ctx.currentPlayer];
          regroupOros(G, ctx.currentPlayer);
          p[ZONES.DEFENSA].push(...p[ZONES.ATAQUE]);
          p[ZONES.ATAQUE] = [];
          p.flags.oroJugadoEnVigilia = false;
        },
        next: 'vigilia',
      },
      vigilia: {
        moves: ['playOro', 'playAliado'],
        next: 'batalla',
      },
      batalla: {
        moves: ['declareAttack', 'assignDamage'],
        next: 'final',
      },
      final: {
        moves: ['endTurn'],
        next: 'agrupacion',
      },
    },
  },

  endIf: ({ G }) => {
    for (const pid in G.players) {
      if (G.players[pid][ZONES.CASTILLO].length === 0) {
        return { winner: pid === '0' ? '1' : '0' };
      }
    }
  },

  moves: {
    playOro({ G, ctx, playerID }, cardId) {
      const p = G.players[playerID];
      if (ctx.phase !== 'vigilia' || p.flags.oroJugadoEnVigilia) return;
      const idx = p[ZONES.MANO].indexOf(cardId);
      if (idx === -1 || CARDS[cardId].tipo !== CARD_TYPE.ORO) return;
      p[ZONES.MANO].splice(idx, 1);
      p[ZONES.RESERVA_ORO].push(cardId);
      p.flags.oroJugadoEnVigilia = true;
    },

    playAliado({ G, ctx, playerID }, cardId) {
      const p = G.players[playerID];
      if (ctx.phase !== 'vigilia') return;
      const idx = p[ZONES.MANO].indexOf(cardId);
      if (idx === -1) return;
      const card = CARDS[cardId];
      if (p[ZONES.RESERVA_ORO].length < card.coste) return;
      p[ZONES.ORO_PAGADO].push(...p[ZONES.RESERVA_ORO].splice(0, card.coste));
      p[ZONES.MANO].splice(idx, 1);
      p[ZONES.DEFENSA].push({
        cardId,
        vida: card.vida,
        fuerza: card.fuerza,
        instanceId: Math.random().toString(36),
      });
    },

    declareAttack({ G, ctx, playerID }, instanceId) {
      const p = G.players[playerID];
      const idx = p[ZONES.DEFENSA].findIndex(a => a.instanceId === instanceId);
      if (idx === -1) return;
      p[ZONES.ATAQUE].push(p[ZONES.DEFENSA].splice(idx, 1)[0]);
    },

    assignDamage({ G, ctx }) {
      const atk = G.players[ctx.currentPlayer];
      const def = G.players[ctx.currentPlayer === '0' ? '1' : '0'];
      atk[ZONES.ATAQUE].forEach(a => {
        millCastilloToCementerio(G, ctx.currentPlayer === '0' ? '1' : '0', a.fuerza);
      });
    },

    endTurn({ events }) {
      events.endTurn();
    },
  }
};