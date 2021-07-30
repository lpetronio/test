// import { LatticeConfig } from "./models/Config";
import { LatticeConfig } from "./models/LatticeConfig";
import * as HelixPlot from "./plots/HelixPlot";
import * as TowerPlot from "./plots/TowerPlot";
import * as testUtils from "./utils/test-utils";
import * as plotUtils from "./utils/plot-utils";
import * as d3 from "d3";



function render(config, data, verbose = testUtils.verbose) {

    const rootIdentifier = "svg";
    const parentIdentifier = config.parentId;
    const rootId = document.getElementById(`${config.rootId}-${rootIdentifier}`);
    const parentId = document.getElementById(`${config.rootId}-${parentIdentifier}`); // this is confusing!

    let svg;

    if (!rootId){
        createSvg(config)
        if (!parentId) {  svg =  createGroup(config, parentIdentifier);  } 
        else { svg = d3.select(`#${config.parentId}-${parentIdentifier}`).attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);   }
    } else {
        if (!parentId) {  svg = createGroup(config, parentIdentifier);  } 
        else { svg = d3.select(`#${config.rootId}-${parentIdentifier}`).attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);   }
    }

    const lConfig = new LatticeConfig(  data,
                                        config.parentId, 
                                        config.rootId, 
                                        config.sceneId,
                                        config.type,
                                        config.grid, 
                                        config.width, 
                                        config.height, 
                                        config.plotConfigs, 
                                        config.padding,
                                        config.label, 
                                        config.scale, 
                                        config.ticks); 


    var plot = svg.selectAll(`.${lConfig.parentId}-plot`).data(lConfig.plotData);
    plot.exit().remove();

    plot.enter()
        .append("g")
        .attr("class",`${lConfig.parentId}-plot`)
        .attr("id", (d) => `${lConfig.parentId}-plot-${d.row}-${d.column}` )
    .merge(plot) 
        .attr("class",`${lConfig.parentId}-plot`)
        .attr("id", (d) => `${lConfig.parentId}-plot-${d.row}-${d.column}` )
        .attr("transform", (d) => {
            return `translate(${d.x}, ${d.y})`;
        })
        .each((d) =>{

            if (d.type == "helixplot"){ 
                HelixPlot.render(d, d.data, verbose) 
            }  
            else if (d.type == "towerplot-stack" || d.type == "towerplot-pair" ){
                TowerPlot.render(d, d.data, verbose)
            } 
            else {
                console.log("unknown plot type")
            }
           
        })


  // plot.exit().remove();


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