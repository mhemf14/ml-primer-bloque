import { Client } from 'boardgame.io/react';
import { MLPrimerBloque } from './game/ml/game';

function Board({ G, ctx, moves, playerID }) {
  const p = G.players[playerID];
  return (
    <div>
      <h3>Jugador {playerID}</h3>
      <div>Mazo: {p.castillo.length}</div>
      <div>Mano: {p.mano.map(c =>
        <button key={c} onClick={() => {
          if (c === 'ORO_BASICO') moves.playOro(c);
          else moves.playAliado(c);
        }}>{c}</button>
      )}</div>
      <div>Defensa: {p.lineaDefensa.map(a =>
        <button key={a.instanceId} onClick={() => moves.declareAttack(a.instanceId)}>
          Atacar {a.cardId}
        </button>
      )}</div>
      <button onClick={moves.assignDamage}>Asignar Daño</button>
      <button onClick={moves.endTurn}>Fin Turno</button>
    </div>
  );
}

const GameClient = Client({
  game: MLPrimerBloque,
  board: Board,
  numPlayers: 2,
});

export default function App() {
  return <GameClient playerID="0" />;
}