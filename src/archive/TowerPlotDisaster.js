"use strict";
import { TowerPlotConfig } from "../models/Config";
import * as testUtils from "../utils/test-utils";
import * as d3 from "d3";
import * as colorUtils from "../utils/colors";
import * as sizeUtils from "../utils/sizeUtils";
import * as plotUtils from "../utils/plot-utils";
// import icon from '../img/icon-0.jpg';
/**
 * Draws a scatterplot
 * @param {Object} config - scatterplot configuration object.
 *                          expected attributes are: domId
 *                                                   width
 *                                                   height
 *                                                   padding (object with top, right, bottom, and left attributes)
 * @param {Array} points - array of points to use as data.
 *                         expected attributes are: x, y, radius
 * @param {Boolean} appendSvg - specifies whether an SVG needs to be appended or not
 * @param {Boolean} verbose 
 */

function render(config, data, verbose = testUtils.verbose) { // change points to data. What if a dom is passed in?

    const tConfig = new TowerPlotConfig(config.parentId, 
                                        config.rootId, 
                                        config.width, 
                                        config.height, 
                                        config.padding, 
                                        config.type, 
                                        config.label, 
                                        config.scale, config.ticks);

 
    if (verbose){
        console.log("TowerPlot : render() tConfig, data", tConfig, config, data);
    }
    const parentIdentifier = "towerplot";
    const parentId = document.getElementById(`${config.parentId}-${parentIdentifier}`);
    let svg;
    if (!parentId) { 
        console.log("TowerPlot: no parentId")
      svg =  plotUtils.createGroup(config, parentIdentifier);
    } else {
      svg = d3.select(`#${config.parentId}-${parentIdentifier}`)
    }




// ###############
// ###############
 // move these to update data function
    var plotData;
    if (tConfig.type == "towerplot-stack"){
        plotData = data.map(function(d){ return d}).filter(function(d){ return d.effect != "neutral" })
        plotData.sort(function(a, b){
            return d3.ascending(a.sort_order, b.sort_order)
        })
        plotData.forEach(function(d,i){ d.y = i})
    } else {
        plotData = data.map(function(d){ return d})
    }
    const scale = createScales(tConfig, plotData);
// ###############
// ###############
    // add exit, enter, update
    var rect = svg.selectAll(`.${tConfig.parentId}-rect `)
        .data(plotData)

    rect.enter()
        .append("rect")
        .attr("class", function(d){ return `${tConfig.parentId}-rect towerplot-rect`  }) 
.merge(rect)
    .transition()
    .duration(500)
     .attr("class", function(d){ return `${tConfig.parentId}-rect towerplot-rect`  }) 
    .attr("x", function(d){
       //return scale.x(d.x)
        if (tConfig.parentId == "pscalcplot-plot-0-0"){  return scale.xi(d.x) } 
        else {  return scale.x(d.x) }
    })
    .attr("y", function(d, i){
        return scale.y(d.y) 
    }) 
    .attr("width", function(d){
        if (tConfig.parentId == "pscalcplot-plot-0-0"){
            return scale.tickSizeX 
        } 
        else {  return (scale.x.bandwidth()*0.8) }
    })
    .attr("height", function(d, i){
        return scale.tickSizeY
    }) 
    .attr("fill", (d)=> scale.color(d.color)) // colorScale will update on scroll. 
    .attr("stroke", "white")
    .style("stroke-width", .25)

    rect.exit().remove()


    if (tConfig.parentId == "variantplot-plot-0-0"){
        let labels = document.getElementsByClassName(`${tConfig.parentId}-label`);

        if (labels.length == 0){

            console.log("TowerPlot(): No 'variantplot' plot-label")

            let label = svg.append("g")
                .attr("transform", `translate(${scale.x(1)},${scale.y(10) + (scale.tickSizeY/2)})`)
                .attr("class", `${tConfig.parentId}-label`)
                .style("opacity", 0)
            
                label.append("text")
                .attr("class", `plot-label`)
                .attr("text-anchor", "end")
                .attr("x", -25)
                .attr("y", 0)
                .attr("dy", sizeUtils.plotLabelDy)
                .html("risk variant")
                .style("fill", colorUtils.red)
        
                label.append("line")
                .attr("x1", -20)
                .attr("x2", 0)
                .attr("class", "label-line")


        }

    }



}



function createScales(config, data) {

    console.log("data", data)
    let tickSizeX =  (config.innerWidth / d3.max(data.map(d => d.x)) );
    if (tickSizeX >= 50){ tickSizeX = 50 }

    let yDomain;
    if (config.type == "towerplot-pair"){
        yDomain = d3.extent(data.map(d => d.y))
    } else {
        yDomain = [0, data.length]
    }
    let xDomain = d3.extent(data.map(d => d.x))
let xDomain = [0, 1]

  //  if (config.grid.columns == 1){
   //     xRange = [(config.innerWidth/2) - (tickSizeX*.5), (tickSizeX*2) + 10]
  //  } else {
        xRange = [0, config.innerWidth]
  //  }




    return {

       // xi: d3.scaleLinear().domain([0, 1]).range([0, config.innerWidth]), // for single plot
      //  x: d3.scaleBand().domain(d3.extent(data.map(d => d.x))).range([0, config.innerWidth]), 
        x: d3.scaleBand().domain(xDomain).range(xRange), 
        y: d3.scaleLinear().domain(yDomain).range([config.innerHeight, 0]),
        color: d3.scaleOrdinal().range([colorUtils.lightgrey, colorUtils.red, colorUtils.teal]).domain(["neutral", "positive", "negative"]),
        //color: d3.scaleOrdinal().range([colorUtils.lightgrey, colorUtils.lightgrey, colorUtils.lightgrey]).domain(["neutral", "positive", "negative"]), // conditional update!!
        tickSizeX: tickSizeX,
        tickSizeY: (config.innerHeight / d3.max(data.map(d => d.y)) ) * .95,

    };
}



export {
    render
};