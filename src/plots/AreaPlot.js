
"use strict";
import * as d3 from "d3";
import * as colorUtils from "../utils/colors";
import * as sizeUtils from "../utils/sizeUtils";
import { BinPlotConfig } from "../models/BinConfig";

function render(config, svg, data, labels){

    

    const bConfig = new BinPlotConfig(  data,
                                    config.parentId, 
                                    config.rootId, 
                                    config.type, 
                                    config.color,
                                    config.bins,
                                    config.size,
                                    config.width, 
                                    config.height, 
                                    config.padding, 
                                    config.colorType);



    var area = d3.area()
        .x(function(d) { return bConfig.scale.q(d.q); })
        .y0(d => bConfig.height)
        .y1(function(d) { return bConfig.scale.p(d.p); })
        .curve(d3.curveMonotoneX);

    svg.selectAll(".distribution-path").remove();
    svg.selectAll("text").remove();

    svg.append("path")
        .datum(data)
        .attr("class", "distribution-path")
        .attr("id", "distribution-path")
        .attr("d", area)
        .attr("fill", colorUtils.lightgrey)

        // svg.append("text")
        // .attr("class", "plot-label")
        // .attr("id", "distribution-path-label-average")
        // .attr("dy", sizeUtils.dyMd)
        // .attr("x", bConfig.width/2)
        // .attr("y", function(d){
        //     return bConfig.padding.top - (d3.select(this).attr("dy")*1.5)
        // })
        // .attr("text-anchor", "middle")
        // .html(function(){
        //     var x = d3.select(this).attr("x");
        //     var y = d3.select(this).attr("dy");
        //     return  `<tspan x='${+x}' dy='${0}'>${labels[0]}</tspan>`
        //     + `<tspan x='${+x}' dy='${+y}'>&#8595;</tspan>`
        // })
        // .attr("opacity", 0)
}

export{
    render
}