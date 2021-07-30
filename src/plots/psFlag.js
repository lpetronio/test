"use strict";
import * as d3 from "d3";
import * as colorUtils from "../utils/colors";
import * as sizeUtils from "../utils/sizeUtils";



function render(config, svg, flagx, offset, label){

    
    let color;
    if (label[0] == "average" || label[0] == "promedio"){
        color = colorUtils.darkgrey
    } else if(label[0] == "significantly increased" || label[0] == "mayor riesgo"){
        color = colorUtils.red
    } else {
        color = colorUtils.darkteal
    }
    
    svg.select("#ps-flag").remove()
    
    let psFlag = svg.append("g")
    .attr("id", "ps-flag")
    .attr("transform", `translate(${flagx - offset}, ${0})`)
    .attr("opacity", 0)
    
    psFlag.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 300)
    .attr("height", sizeUtils.dyMd*3)
    .attr("stroke", colorUtils.lightgrey)
    .attr("fill", color)
    
    psFlag.append("text")
    .attr("x", 150)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("dy", sizeUtils.dyMd)
    .attr("class", "label-md ps-flag-banner")
    .attr("id", "flag-banner-label")
    .html(`${label[0]}`)    
    
    psFlag.append("rect")
    .attr("x", 0)
    .attr("y", 30)
    .attr("width", 300)
    .attr("height", 120)
    .attr("stroke", colorUtils.lightgrey)
    .attr("fill", "white")
    
    psFlag.append("text")
    .attr("x", 15)
    .attr("y", 45)
    .attr("dy", sizeUtils.dyLg)
    .html(function(){
    var x = d3.select(this).attr("x");
    var y = sizeUtils.dyLg;
    return `<tspan class='flag-label' x=${+x} dy=${+y}>${label[1]} </tspan>
    <tspan class='flag-label bold' style='fill:${color}' x=${+x} dy=${+y}>${label[2]}</tspan>`


    }) 
    
    psFlag.append("line")
        .attr("id", "flag-line")
        .attr("x1", offset)
        .attr("x2", offset)
        .attr("y1", 120 + 30)
        // .attr("y2", config.innerHeight)
        .attr("y2", config.innerHeight - 150)
        .style("stroke", "black")
        .attr("opacity", 0)
    
    }


    export {
        render
    }