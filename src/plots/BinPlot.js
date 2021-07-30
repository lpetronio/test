
"use strict";
import * as d3 from "d3";
import * as colorUtils from "../utils/colors";
import * as sizeUtils from "../utils/sizeUtils";
import { BinPlotConfig } from "../models/BinConfig";

function render(config, svg, data, labels){

    svg.selectAll("text").remove();

    const bConfig = new BinPlotConfig(  data,
                                    config.parentId, 
                                    config.rootId, 
                                    config.type, 
                                    config.color,
                                    config.bins,
                                    config.size,
                                    config.width, 
                                    config.height, 
                                    config.padding);

                                    let bins = svg.selectAll(".column")
                                    .data(bConfig.flatData, function(d){ return `${d.x0}` })
                                    //.data(bConfig.flatData)
                                    bins.exit().remove()
                                
                                    bins
                                        .enter()
                                        .append("path")
                                        .attr("d", "M16.9,10.3l-0.5,11.4c-0.1,1.3-1,2.3-2.3,2.4l0,0l-1.1,12.7c0,1.5-0.8,2.7-1.7,2.7H6.8c-0.9,0-1.7-1.2-1.7-2.7L4,24.1l0,0C2.7,24,1.7,23,1.7,21.7L1.1,10.3c0-1.3,1.2-2.1,2.7-2.1h2.7C5.4,7.5,4.7,6.2,4.8,4.8c0-2.4,1.9-4.3,4.3-4.3c2.4,0,4.3,1.9,4.3,4.3c0,1.4-0.7,2.7-1.8,3.5h2.6C15.6,8.2,16.9,9,16.9,10.3z")
                                                    .attr("fill", function(e){
                                                        return e.color
                                                    })
                                        .attr("class", "column")
                                        .attr('transform', function(d) {
                                            return `translate(${d.x0 + d.x},${d.y0 + d.y})`;
                                        })
                                
                                    .merge(bins)
                                        .transition()
                                        .duration(600)
                                        .attr('transform', function(d) {
                                            return `translate(${d.x0 + d.x},${d.y0 + d.y})`;
                                        })
                                        .attr("class", "column")
                                        .attr("fill", function(e){
                                            return e.color
                                        })
                                        // .attr('y', function(d) {
                                        //     return d.y0 + d.y;
                                        // })
                                        // .attr('x', function(d) {
                                        //     return d.x0 + d.x;
                                        // })
                                        // .each(function(d, i){
                                
                                        //     let g = d3.select(this).selectAll("g").data(d.values)
                                
                                        //     g.exit().remove()
                                           
                                        //     g.enter()
                                        //         .append("g")
                                        //     .merge(g)
                                        //         .attr("class", "figure distribution-figure")
                                        //         .attr('transform', function(d) {
                                        //             return `translate(${d.x},${d.y})`;
                                        //         })
                                        //         .each(function(each){
                                        //             console.log(each)
                                        //             d3.select(this).selectAll("path").remove()
                                        //             d3.select(this).append("path")
                                        //             .attr("d", "M16.9,10.3l-0.5,11.4c-0.1,1.3-1,2.3-2.3,2.4l0,0l-1.1,12.7c0,1.5-0.8,2.7-1.7,2.7H6.8c-0.9,0-1.7-1.2-1.7-2.7L4,24.1l0,0C2.7,24,1.7,23,1.7,21.7L1.1,10.3c0-1.3,1.2-2.1,2.7-2.1h2.7C5.4,7.5,4.7,6.2,4.8,4.8c0-2.4,1.9-4.3,4.3-4.3c2.4,0,4.3,1.9,4.3,4.3c0,1.4-0.7,2.7-1.8,3.5h2.6C15.6,8.2,16.9,9,16.9,10.3z")
                                        //             .attr("fill", function(e){
                                        //                 return e.color
                                        //             })
                                        //             .attr("x", each.x)
                                        //             .attr("y", each.y)
                                        //         })
                                
                                        //     })
    // let bins = svg.selectAll(".column").data(bConfig.plotData)
    // bins.exit().remove()

    // bins
    //     .enter()
    //     .append("g")
    //     .attr("class", "column")
    //     .attr('transform', function(d) {
    //         return `translate(${d.x},${d.y})`;
    //     })

    // .merge(bins)
    //     .transition()
    //     .duration(600)
    //     .attr('transform', function(d) {
    //         return `translate(${d.x},${d.y})`;
    //     })
    //     .each(function(d, i){

    //         let g = d3.select(this).selectAll("g").data(d.values)

    //         g.exit().remove()
           
    //         g.enter()
    //             .append("g")
    //         .merge(g)
    //             .attr("class", "figure distribution-figure")
    //             .attr('transform', function(d) {
    //                 return `translate(${d.x},${d.y})`;
    //             })
    //             .each(function(each){
    //                 console.log(each)
    //                 d3.select(this).selectAll("path").remove()
    //                 d3.select(this).append("path")
    //                 .attr("d", "M16.9,10.3l-0.5,11.4c-0.1,1.3-1,2.3-2.3,2.4l0,0l-1.1,12.7c0,1.5-0.8,2.7-1.7,2.7H6.8c-0.9,0-1.7-1.2-1.7-2.7L4,24.1l0,0C2.7,24,1.7,23,1.7,21.7L1.1,10.3c0-1.3,1.2-2.1,2.7-2.1h2.7C5.4,7.5,4.7,6.2,4.8,4.8c0-2.4,1.9-4.3,4.3-4.3c2.4,0,4.3,1.9,4.3,4.3c0,1.4-0.7,2.7-1.8,3.5h2.6C15.6,8.2,16.9,9,16.9,10.3z")
    //                 .attr("fill", function(e){
    //                     return e.color
    //                 })
    //                 .attr("x", each.x)
    //                 .attr("y", each.y)
    //             })

    //         })


    svg.append("text")
        .attr("class", "plot-label")
        .attr("id", "distribution-path-label-mostppl")
        .attr("dy", sizeUtils.dyMd)
        .attr("x", bConfig.width/2)
        .attr("y", function(d){
            return bConfig.padding.top - (d3.select(this).attr("dy")*1.5)
        })
        .attr("text-anchor", "middle")
        .html(function(){
            var x = d3.select(this).attr("x");
            var y = d3.select(this).attr("dy");
            return  `<tspan x='${+x}' dy='${0}'>${labels[0]}</tspan>`
            + `<tspan x='${+x}' dy='${+y}'>&#8595;</tspan>`
        })
        .attr("opacity", 0)





}

export{
    render
}