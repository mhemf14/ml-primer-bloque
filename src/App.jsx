import React from 'react'
import { createRoot } from 'react-dom/client'
import { Client } from 'boardgame.io/client'
import { MLPrimerBloque } from './game/ml/game'

const GameClient = Client({
  game: MLPrimerBloque,
  numPlayers: 2,
})

function App() {
  const [state, setState] = React.useState(null)

  React.useEffect(() => {
    GameClient.start()
    GameClient.subscribe(setState)
    return () => GameClient.stop()
  }, [])

  if (!state) return <div>Cargando...</div>

  const { G, ctx } = state

  return (
    <div>
      <h3>Jugador {ctx.currentPlayer}</h3>
      <div>Cartas en Castillo: {G.players['0'].castillo.length}</div>
      <button onClick={() => GameClient.moves.endTurn()}>
        Terminar Turno
      </button>
    </div>
  )
}

export default App
