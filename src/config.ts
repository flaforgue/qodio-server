/* suitable configs
 * fps=60;speed=2 ok if <= 1000 drones
 * fps=60;speed=2 ok if <= 2000 drones
 */

export default {
  // game
  fps: 60,
  speed: 2, // Number of pixels a Drone can travel in one tick
  nbPlayers: 2, // Currently 1 or 2 (missing multiple ennemies init and selection when attacking)
  maxHiveLevel: 3,
  hiveProductivity: 10,

  // map
  mapHeight: 1200,
  mapWidth: 1200,
  resourceConcentration: 0.00004, // resource per pixel-squares of the map

  // resource costs
  droneCreationResourceCost: 10,
  warriorCreationResourceCost: 20,
  buildingCreationResourceCost: 30,
  hiveUpgradeResourceCosts: {
    1: 100,
    2: 500,
  },

  // initial state
  hiveInitialMaxLife: 1000,
  hiveInitialResources: 1000,
  hiveInitialDrones: [
    { action: 'wait', nbDrones: 5 },
    { action: 'scout', nbDrones: 0 },
    { action: 'collect', nbDrones: 0 },
    { action: 'build', nbDrones: 0 },
    { action: 'defend', nbDrones: 10 },
    { action: 'attack', nbDrones: 0 },
  ],
};
