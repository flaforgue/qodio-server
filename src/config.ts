/* suitable configs
 * fps=60;speed=2 ok if <= 1000 drones
 * fps=60;speed=2 ok if <= 2000 drones
 */

export default {
  // game
  fps: 60,
  speed: 2, // Number of pixels a Drone can travel in one tick
  nbPlayers: 1,

  // board
  boardHeight: 2400,
  boardWidth: 2400,
  resourceConcentration: 0.00004, // resource per pixels square of the board

  // resource costs
  droneResourceCost: 10,
  buildingResourceCost: 30,
  upgradeResourceCost: 100,

  // initial state
  hiveInitialResources: 150,
};
