"use strict";
import { PairPlotConfig } from "../models/Config";
import * as testUtils from "../utils/test-utils";
import * as d3 from "d3";
import * as colors from "../utils/colors"

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
function render(config = testUtils.pairPlotConfig, points = testUtils.points, appendSvg = true, verbose = testUtils.verbose) { // change points to data. What if a dom is passed in?
    if (verbose){
        console.log("ScatterPlot : render()");
        console.log(config);
    }

    const pConfig = new PairPlotConfig(config.parentId, config.domId, config.width, config.height, config.padding, config.label, config.scale, config.ticks, config.grid);

    const domId = document.getElementById(`${pConfig.domId}-pairplot`);
    let svg;
    if (appendSvg) { 
      svg = createSvg(pConfig);
    } else {
        if (domId){
            svg = d3.select(`#${pConfig.domId}-pairplot`)
        } else {
            svg = createGroup(pConfig) 
        }
    }
    const scale = createScales(pConfig, points);

    // add exit, enter, update
    var rows = svg.selectAll(".row").data(points, function(d){ return d.relation})
    rows.enter()
        .append("g")
        .attr("transform", (d)=>`translate(${scale.x(0)},${scale.y(d.row)})`)
        .attr("class", "row") // add more to this..
    .merge(rows)
    .transition()
    .duration(500)
        .each(function(d, i){
           var column = d3.select(this).selectAll("rect")
                .data(d.columns, function(e){
                    return d.effect
                })
            column.enter()
                .append("rect")
                .attr("x", (e)=> scale.x(e.column))
                .attr("y", -pConfig.sizeh/2 ) // so that last row doesn't get cut off. Temp solution!!
                .attr("width", pConfig.sizew)
                .attr("height", pConfig.sizeh)
                .attr("fill", (e)=> scale.color(e.effect)) // colorScale will update on scroll. 
                .attr("stroke", "white")
            .merge(column)
            .transition()
            .duration(500)
                .attr("x", (e)=> scale.x(e.column))
                .attr("y", -pConfig.sizeh/2 ) // so that last row doesn't get cut off. Temp solution!!
                .attr("width", pConfig.sizew)
                .attr("height", pConfig.sizeh)
                .attr("fill", (e)=> scale.color(e.effect)) // colorScale will update on scroll. 
                .attr("stroke", "white")
            column.exit().remove()

        })
    rows.exit().remove()
    // const plotLabel = pConfig.label.plot ? svg.append("text").html(pConfig.label.plot)
    // .attr("x", pConfig.innerWidth/2)
    // .attr("y", -pConfig.padding.top/3)
    // .attr("text-anchor", "middle") : undefined;
}

/**
 * Creates an SVG element in the given domId and returns it.
 * @param {PairPlotConfig} config 
 */
function createSvg(config) {
    // error check that domId exists, meets padding requirements
    // create svg
    const svg = d3.select(`#${config.domId}`).append("svg").attr("id", `${config.domId}-svg`)
        .attr("width", config.width)
        .attr("height", config.height)
        .append("g").attr("id", `${config.domId}-pairplot`)
        .attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);

    return svg;
}

/**
 * Creates a group in the given domId and returns it.
 * @param {PairPlotConfig} config 
 */
function createGroup(config) {
    const g = d3.select(`#${config.domId}`).append("g").attr("id", `${config.domId}-pairplot`)
        .attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);
    return g;
}
/**
 * TODO: allow user to specify color scale. "color" attribute isn't used right now
 * Creates all the scales needed for generating the scatter plot.
 * @param {PairPlotConfig} config
 * @param {Array} points - array of points. Expected attributes are x, y, and radius
 * MOVE SCALES TO CONFIG????
 */
function createScales(config, points) {

    // let color;
    // if (config.scale.colorType = "diseaseColor"){
    //     color =  d3.scaleOrdinal().range([colors.grey, colors.red, colors.teal]).domain(["neu", "pos", "neg"])
    // } else if (config.scale.colorType = "variantColor"){
    //     color =  d3.scaleOrdinal().range([colors.grey, colors.yellow, colors.grey]).domain(["neu", "pos", "neg"])
    // }

    return {
        x: d3.scaleBand().domain([0,config.grid.columns - 1]).range([0, config.innerWidth]),
        y: d3.scaleLinear().domain(d3.extent(points.map(d => d.row))).range([config.innerHeight, 0]),
        color: d3.scaleOrdinal().range([colors.lightgrey, colors.red, colors.teal, colors.yellow]).domain(["neu", "pos", "neg", "var"])
       // color: color
    };
}

export {
    render
};