"use strict";
import { TowerPlotConfig } from "../models/TowerConfig";
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

    const tConfig = new TowerPlotConfig(data,
                                        config.parentId, 
                                        config.rootId, 
                                        config.type, 
                                        config.grid, 
                                        config.width, 
                                        config.height, 
                                        config.padding, 
                                        config.scale,
                                        config.colorType,
                                        config.opacityType);

 
    if (verbose){
      //  console.log("TowerPlot : render() tConfig, data", tConfig, data);
    }
    const parentIdentifier = "towerplot";
    const parentId = document.getElementById(`${config.parentId}-${parentIdentifier}`);
    let svg;
    if (!parentId) { 
      svg =  plotUtils.createGroup(config, parentIdentifier);
    } else {
      svg = d3.select(`#${config.parentId}-${parentIdentifier}`)
    }

  let plotData;

    if (config.sceneId == "psplot-individual"){
      if (tConfig.parentId == "psplot-plot-0-3"){
        plotData = tConfig.plotData
      } else {
        plotData = []
      } 
    }else {
      plotData = tConfig.plotData
    }


    var rect = svg.selectAll(`.${tConfig.parentId}-rect `)
        .data(plotData)

      rect.enter()
        .append("rect")
        .attr("class", function(){ return `${tConfig.parentId}-rect towerplot-rect`  }) 
        .attr("x", function(rect){ return rect.x  })
        .attr("y", function(rect){   return rect.y }) 
        .attr("width", function(rect){ return rect.width  })
        .attr("height", function(rect){   return rect.height }) 
        .attr("fill", (rect)=> rect.color)  
        .attr("stroke", "white")
        .style("stroke-width", .25)
        .style("opacity", function(rect){ return rect.opacity})
      .merge(rect)
        .transition()
        .duration(500)
        .attr("class", function(){ return `${tConfig.parentId}-rect towerplot-rect`  }) 
        .attr("x", function(rect){ return rect.x  })
        .attr("y", function(rect){   return rect.y }) 
        .attr("width", function(rect){ return rect.width  })
        .attr("height", function(rect){   return rect.height }) 
        .style("opacity", function(rect){ return rect.opacity})
        .attr("fill", (rect)=> rect.color)  
        .attr("stroke", "white")
        .style("stroke-width", .25)

    rect.exit().remove()



    // if (tConfig.parentId == "variantplot-plot-0-0"){
    //     let labels = document.getElementsByClassName(`${tConfig.parentId}-label`);
    //     if (labels.length == 0){
    //         let label = svg.append("g")
    //             .attr("transform", `translate(${tConfig.scale.x(1)},${tConfig.scale.y(10) + (tConfig.scale.height/2)})`)
    //             .attr("class", `${tConfig.parentId}-label`)
    //             .style("opacity", 0)
            
    //             label.append("text")
    //             .attr("class", `plot-label`)
    //             .attr("text-anchor", "end")
    //             .attr("x", -25)
    //             .attr("y", 0)
    //             .attr("dy", sizeUtils.plotLabelDy)
    //             .html("risk variant")
    //             .style("fill", colorUtils.red)
        
    //             label.append("line")
    //             .attr("x1", -20)
    //             .attr("x2", 0)
    //             .attr("class", "label-line")

    //     }

    // } 


//     if (config.sceneId == "psplot-individual"){
//       svg.append("path")
//       .attr("d", "M16.9,10.3l-0.5,11.4c-0.1,1.3-1,2.3-2.3,2.4l0,0l-1.1,12.7c0,1.5-0.8,2.7-1.7,2.7H6.8c-0.9,0-1.7-1.2-1.7-2.7L4,24.1l0,0C2.7,24,1.7,23,1.7,21.7L1.1,10.3c0-1.3,1.2-2.1,2.7-2.1h2.7C5.4,7.5,4.7,6.2,4.8,4.8c0-2.4,1.9-4.3,4.3-4.3c2.4,0,4.3,1.9,4.3,4.3c0,1.4-0.7,2.7-1.8,3.5h2.6C15.6,8.2,16.9,9,16.9,10.3z")
//                   .attr("fill", function(e){
//                       return e.color
//                   })
//       .attr("class", "column")
//       .attr('transform', function(d) {
//           return `translate(${d.x0 + d.x},${d.y0 + d.y})`;
//       })
// console.log("sceneId")

//       }

  



}



// function createScales(config, data) {

//     let yDomain, tickSizeY;
//     if (config.type == "towerplot-pair"){
//         tickSizeY = (config.innerHeight / d3.max(data.map(d => d.y)) );
//         yDomain = d3.extent(data.map(d => d.y));
//     } else {
//         tickSizeY = (config.innerHeight / data.length);
//         yDomain = [0, data.length]
//     }
//      let xDomain = d3.extent(data.map(d => d.x))

//     return {
//         x: d3.scaleBand().domain(xDomain).range([0, config.innerWidth]),
//         y: d3.scaleLinear().domain(yDomain).range([config.innerHeight, 0]),
//         color: d3.scaleOrdinal().range([colorUtils.lightgrey, colorUtils.red, colorUtils.teal]).domain(["neutral", "positive", "negative"]),
//   //      tickSizeX: tickSizeX,
//         tickSizeY: tickSizeY * 0.9
//     };
// }



export {
    render
};