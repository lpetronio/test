"use strict";
import { HelixPlotConfig } from "../models/HelixConfig";
import * as helixUtils from "../utils/helix-pt";
import * as testUtils from "../utils/test-utils";
import * as d3 from "d3";
import * as colorUtils from "../utils/colors";
import * as plotUtils from "../utils/plot-utils";

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
function render(config, verbose = testUtils.verbose) { // change points to data. What if a dom is passed in?
    if (verbose){
    //    console.log("HelixPlot : render()");
    }

    const plotIdentifier = "helixplot";
    const parentId = document.getElementById(`${config.parentId}-${plotIdentifier}`);

    let svg;

    if (!parentId) { 
     //   console.log("parentId DOES NOT exists for ", `${config.parentId}-${plotIdentifier}`)
      svg =  plotUtils.createGroup(config, plotIdentifier);
    } else {
    //    console.log("parentId exists for ", `${config.parentId}-${plotIdentifier}`)
      svg = d3.select(`#${config.parentId}-${plotIdentifier}`)
    }
 
    const hConfig = new HelixPlotConfig(config.parentId, 
                                        config.rootId, 
                                        config.width, 
                                        config.height, 
                                        config.padding, 
                                        config.label, 
                                        config.scale, 
                                        config.ticks, 
                                        config.grid, config.scroll); 


    const data = helixUtils.createHelixPt(hConfig) // move to promises
    const scale = createScales(hConfig, data);




    let plot = svg.selectAll("g").data(data)
    plot.exit().remove()

    plot.enter()
        .append("g")
        .attr("class", function(d, i){ return `column-${config.column} row-${i}` }) // remove row-4 circle
        .attr("id", function(d, i){ return `column-${config.column}-row-${i}` }) // remove row-4 circle
        .merge(plot) // do we need this to update?
        .transition()
        .duration(500)
        .attr("class", function(d, i){ return `column-${config.column} row-${i}` }) // remove row-4 circle
        .attr("id", function(d, i){ return `column-${config.column}-row-${i}` }) // remove row-4 circle
        .each(function (d) {
            d3.select(this).selectAll("circle").remove()
            d3.select(this).selectAll("line").remove()

            var inverted = (scale.x(d[1].x) < scale.x(d[0].x)) ? 1 : -1;

            d3.select(this).append('line')
                .attr("class", "helix-bar")
                .attr("y2", scale.y(d[0].y))
                .attr("y1", scale.y(d[0].y))             
                .attr("x1", function () {  
                    if (hConfig.scroll.prog >= scale.unwound) {
                       return scale.x(d[0].x) + inverted * scale.z(d[0].z)
                    } else {
                       return (scale.x(d[0].x) + inverted * scale.z(d[0].z)) - (inverted * scale.radius(d[0].z)) 
                    }
               })
                .attr("x2", function () {  
                    if (hConfig.scroll.prog >= scale.unwound) {
                       return scale.x(d[1].x) + inverted * scale.z(d[1].z)
                    } else {
                       return (scale.x(d[1].x) + inverted * scale.z(d[1].z)) + (inverted * scale.radius(d[1].z)) 
                    }
               })
                .attr("stroke", function (d) {  return d[0].fill  })
                .attr("stroke-width", scale.stroke(hConfig.scroll.prog))
                .attr("opacity", function (d) {  
                    if (hConfig.scroll.prog >= scale.unwound) {
                       return 1
                    } else {
                        return  inverted * (d[0].x - d[1].x) * 0.3
                    }
               })

            d3.select(this)
                .selectAll("circle")
                .data(d)
                .enter()
                .append("circle")
                .attr("class", function(e, j){ return `helix-circle helix-circle-${j}`  })
                .attr("cx", function (d) { return scale.x(d.x) })
                .attr("cy", function (d) { return scale.y(d.y) })
                .attr("r",  function (d) {
                    if (hConfig.scroll.prog > scale.unwound){ return 0 }
                     else { return scale.radius(d.z)  }
                })
                .attr("stroke", (d)=> d.stroke)
                .attr("fill", function (d) { return d.fill  })
                 .attr("opacity", function (d) {  
                     if (hConfig.scroll.prog >= scale.unwound) {
                        return 1
                     } else {
                        return scale.z(d.z) / 5   
                     }
                })
        })
 
        svg.selectAll(".row-3").selectAll(".helix-circle-0").moveToBack()
        svg.selectAll(".row-4").selectAll(".helix-circle-0").moveToBack()
        svg.selectAll(".row-5").selectAll(".helix-circle-0").moveToBack()
        svg.selectAll(".row-12").selectAll(".helix-circle-1").moveToBack()


}



d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

/**
 * TODO: allow user to specify color scale. "color" attribute isn't used right now
 * Creates all the scales needed for generating the scatter plot.
 * @param {HelixPlotConfig} config
 * @param {Array} points - array of points. Expected attributes are x, y, and radius
 * MOVE SCALES TO CONFIG????
 */
function createScales(config, points) {

    let flat = [];
    points.forEach((d)=>{
        d.forEach((e)=>{
            flat.push({x:e.x, z:e.z})
        })
    })
    return{
        z: d3.scaleLinear().range([5, 1]).domain(d3.extent(flat, function(d){ return d.z })),
        x: d3.scaleLinear().range([0, config.innerWidth]).domain(d3.extent(flat, function(d){ return d.x })),
        y: d3.scaleLinear().domain([0, config.grid.rows]).range([0, config.innerHeight]),
        stroke: d3.scaleLinear().domain([0, 0.85, 1]).range([5, 5, config.ticks.height*.8]), // domain is torsion
        radius: d3.scaleSqrt().range([ config.ticks.height*.7, config.ticks.height*.2]).domain(d3.extent(flat, function(d){ return d.z })),
        unwound: .8
    }
}

export {
    render
};