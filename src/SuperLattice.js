// import { LatticeConfig } from "./models/Config";
import { SuperLatticeConfig } from "./models/SuperLatticeConfig";
import * as HelixPlot from "./plots/HelixPlot";
import * as TowerPlot from "./plots/TowerPlot";
import * as testUtils from "./utils/test-utils";
import * as plotUtils from "./utils/plot-utils";
import * as d3 from "d3";
import * as colorUtils from "./utils/colors";
import * as scrollUtils from "./utils/scrollUtils";



function render(config, svg, data, verbose = testUtils.verbose) {


    let data_;
    if (config.sceneId == "psplot-individual"){
        data_ =   Array.from(data).filter((n, i) => n.percentile >= 47 && n.percentile <=53); // 7
    } else {
        data_ = Array.from(data).filter((n, i) => i % 4 === 0);
    }
    

    const lConfig = new SuperLatticeConfig(  data_,
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


    let plotData = lConfig.plotData;

    var plot = svg.selectAll(`.${lConfig.parentId}-plot`).data(plotData)
    plot.exit().remove();

    plot.enter()
        .append("g")
        .attr("class",`${lConfig.parentId}-plot`)
    .merge(plot) 
        .attr("class",`${lConfig.parentId}-plot`)
        .attr("id", (d, i) => `${lConfig.parentId}-plot-${d.row}-${d.column}` )
        .attr("transform", (d) => {
            if (config.sceneId == "psplot-individual" && d.column == 3){

                if (scrollUtils.windowWidth >= 800){
                    return `translate(${config.width/2 - (d.width/2)},${d.y})`;
                } else {
                    return `translate(${config.width/2  - (d.width/2)},${d.y})`;
                }
            }
            
            return `translate(${d.x}, ${d.y})`;
        })
        .each((d) =>{
         //   d3.select(`#psplot-plot-0-3`).select("path").remove()
            TowerPlot.render(d, d.data, verbose)

            if (config.sceneId == "psplot-individual" && d.column == 3){
                svg.selectAll(".single-figure").remove()
               let g = d3.select(`#psplot-plot-0-3`)
                .append("g")
                .attr("class", "single-figure")
                .attr('transform', function(d) {
                    if (scrollUtils.windowWidth >= 800){
                        return `translate(10,${config.height + 5})scale(4)`;
                    } else {
                        return `translate(10,${config.height + 5})scale(1.25)`;
                        // return `translate(${d.width/3},${config.height + 5})scale(1.5)`;
                    }
              
                })
               
                g .append("path")
                .attr("d", "M16.9,10.3l-0.5,11.4c-0.1,1.3-1,2.3-2.3,2.4l0,0l-1.1,12.7c0,1.5-0.8,2.7-1.7,2.7H6.8c-0.9,0-1.7-1.2-1.7-2.7L4,24.1l0,0C2.7,24,1.7,23,1.7,21.7L1.1,10.3c0-1.3,1.2-2.1,2.7-2.1h2.7C5.4,7.5,4.7,6.2,4.8,4.8c0-2.4,1.9-4.3,4.3-4.3c2.4,0,4.3,1.9,4.3,4.3c0,1.4-0.7,2.7-1.8,3.5h2.6C15.6,8.2,16.9,9,16.9,10.3z")
                .attr("fill", colorUtils.lightgrey)

            } 


        })

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