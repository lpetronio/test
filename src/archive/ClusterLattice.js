import { ClusterLatticeConfig } from "./models/Config";
import * as testUtils from "./utils/test-utils";
import * as d3 from "d3";


function render(config, verbose = testUtils.verbose) {

    const rootIdentifier = "svg";
    const parentIdentifier = "g";
    const rootId = document.getElementById(`${config.rootId}-${rootIdentifier}`);
    const parentId = document.getElementById(`${config.rootId}-${parentIdentifier}`);

    let svg;

    if (!rootId){
        createSvg(config)
        if (!parentId) {  svg =  createGroup(config, parentIdentifier);  } 
        else { svg = d3.select(`#${config.parentId}-${parentIdentifier}`).attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);   }
    } else {
        if (!parentId) {  svg = createGroup(config, parentIdentifier);  } 
        else { svg = d3.select(`#${config.rootId}-${parentIdentifier}`).attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);   }
    }

    const cConfig = new ClusterLatticeConfig(config.parentId, config.rootId, config.grid, config.width, config.height, config.plotConfigs, config.type, config.padding); 
        
    if (verbose){
        console.log("lattice lConfig", cConfig);
    }

    const centre = { x: cConfig.innerWidth/2, y: cConfig.innerHeight/2 };
    const forceStrength = 0.03;
    //const radius = cConfig.plotConfigs[0].width - 10;
    const radius = 10;

  // create a force simulation and add forces to it
  const simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(1))
    .force('x', d3.forceX().strength(forceStrength).x(centre.x))
    .force('y', d3.forceY().strength(forceStrength).y(centre.y))
    .force('collision', d3.forceCollide().radius(d => radius + 1));

  // force simulation starts up automatically, which we don't want as there aren't any nodes yet
 simulation.stop();

    var plot = svg.selectAll(`.${cConfig.parentId}-plot`).data(cConfig.plotConfigs);

    plot.enter()
        .append("circle")
        .attr("class", `${cConfig.parentId}-plot`)
        .attr("id", (d) => `${cConfig.parentId}-plot-${d.row}-${d.column}` )
    .merge(plot)
        .transition()
        .duration(5000)
        .attr("class", `${cConfig.parentId}-plot`)
        .attr("id", (d) => `${cConfig.parentId}-plot-${d.row}-${d.column}` )
        .attr("r", radius)

    plot.exit().remove()

  simulation.nodes(cConfig.plotConfigs)
    .on('tick', ticked)
    .restart();

  function ticked() {
        plot.attr('cx', d => d.x)
            .attr('cy', d => d.y)
  }
}


  
/**
 * Creates a group in the given rootId and returns it.
 * @param {PlotConfig} config 
 * @param {String} id  - id to be appended to end of the group name in the form of config.rootId-id
 */

export function createGroup(config, id) {
    const g = d3.select(`#${config.rootId}-svg`).append("g").attr("id", `${config.rootId}-${id}`)
        .attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);
    return g;
}


export function createSvg(config) {
    const svg = d3.select(`#${config.rootId}`).append("svg").attr("id", `${config.rootId}-svg`) 
        .attr("width", config.width)
        .attr("height", config.height)
    return svg;
}


export{
    render
};