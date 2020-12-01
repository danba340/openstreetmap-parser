const fs = require('fs');
const plotLineCoords = require("./cordPlotter").plotLineCoords

function parseTag(tag) {
  if (!tag) return null;
  else if (tag.length) return tag.map(tag => ({
    k: tag["-k"],
    v: tag["-v"],
  }));
  else return [{
    k: tag["-k"],
    v: tag["-v"],
  }]
}

const rawdata = fs.readFileSync('abborre.json');
const mapJson = JSON.parse(rawdata);
const map = mapJson.osm
const nodes = map.node
  .filter(node => node["-lat"] && node["-lon"])
  .map(node => ({
    id: node["-id"],
    lat: node["-lat"],
    lon: node["-lon"],
    tags: parseTag(node.tag)
  }))
const ways = map.way
  .map(way => ({
    id: way["-id"],
    tags: parseTag(way.tag),
    nodes: way.nd,
    ref: ["-ref"]
  }))
console.log(map.way)

function closeness(la1, lo1, la2, lo2) {
  return Math.abs(la1 - la2) + Math.abs(lo1 - lo2)
}

function getWaterTiles(ways, nodes) {
  const waterNodeIds = ways.
    filter(way => way.tags && way.tags.some(tag => tag.k === "waterway"))
    .map(way => way.id).reduce((acc, val) => acc.concat(val), []);
  const waterNodes = waterNodeIds.map(id => getNodeById(nodes, id["-ref"]))
  return waterNodes.reduce((acc, val) => acc.concat(val), []);
}


function getNodeById(nodes, id) {
  return nodes.filter(node => node.id === id);
}

function pathToNodes(path, nodes) {
  return path.map(coord => {
    const byClosest = nodes.sort((a, b) => {
      return closeness(coord.lat, coord.lon, a.lat, a.lon) - closeness(coord.lat, coord.lon, b.lat, b.lon)
    })
    return byClosest[0];
  })
}

function uniqueArrayOfObj(arr) {
  return arr.filter((obj, index) => {
    const _obj = JSON.stringify(obj);
    return index === arr.findIndex(obj => {
      return JSON.stringify(obj) === _obj;
    });
  });
}

const waterTiles = getWaterTiles(ways, nodes)

const closest = waterTiles.sort((a, b) => {
  return closeness(nodes[0].lat, nodes[0].lon, a.lat, a.lon) - closeness(nodes[0].lat, nodes[0].lon, b.lat, b.lon)
})
console.log(closest[0].lat)
console.log(closest[0].lon)
console.log(nodes[0].lat)
console.log(nodes[0].lon)
console.log("DONE")
const start = {
  lat: nodes[nodes.length - 1].lat,
  lon: nodes[nodes.length - 1].lon
}
const end = {
  lat: nodes[0].lat,
  lon: nodes[0].lon
}
const path = plotLineCoords(start, end, 10)
const nodesFromPath = pathToNodes(path, nodes);
const uniqueNodesFromPath = uniqueArrayOfObj(nodesFromPath)
// console.log(uniqueNodesFromPath)
// for (const node of uniqueNodesFromPath) {
//   console.log(`${node.lat},${node.lon},"${node.id}"`)
// }
for (const node of nodes.filter(node => node.id >= 251152984 && node.id <= 251153042)) {
  console.log(`${node.lat},${node.lon},"${node.id}"`)
}