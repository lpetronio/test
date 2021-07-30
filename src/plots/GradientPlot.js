
import * as d3 from "d3";
import * as colorUtils from "../utils/colors";
import * as sizeUtils from "../utils/sizeUtils";

function render(config, svg, data, labels){

    let x = d3.scaleLinear().range([0, config.innerWidth]).domain(d3.extent(data, function(d){ return d.q}));

    svg.selectAll("defs").remove()
    svg.selectAll("rect").remove()

    var defs = svg.append("defs");
    makeGradient(config, x, defs)

    svg.append('rect')
        .attr("x", 0)
        .attr("y", config.padding.top)
        .attr("width", config.innerWidth)
        .attr("height", config.innerHeight - sizeUtils.dyMd)
        .attr("fill", "url(#linear-gradient)");

    var ticks = [
        //  { x: x(-2.4), percentile: "0 percentile"},
        { x: 0, percentile: `0 ${labels[3]}`},
         { x: x(-1.6), percentile: 5},
         { x: x(-0.8), percentile: 20},
         { x: x(0), percentile: 50},
         { x: x(0.8), percentile: 80},
         { x: x(1.6), percentile: 95},
        { x: config.innerWidth, percentile: 99}
         //  { x: x(2.4), percentile: 99}
         ]
         
        var ticks = svg.selectAll(".gradientplot-tick")
             .data(ticks)
             .enter()
             .append("g")
             .attr("class", `axis-tick gradientplot-tick`)
             .attr("transform", function(d){ return `translate(${d.x},${0})` })
         
        ticks.append("line")
             .attr("x1", 0)
             .attr("x2", 0)
             .attr("y1", config.padding.top)
             .attr("y2", -sizeUtils.dy/2)
             .style("stroke", "black")
             .style("stroke-width", 1)
 
        ticks.append("text")
             .attr("x", 0)
             .attr("y", -sizeUtils.dy)
             .html(function(d){ return d.percentile })
             .attr("text-anchor", function(d, i){
                 if (i==0){ return "start" } 
                 else { return "middle" }
             })
             var triangle = d3.symbol().type(d3.symbolTriangle);
 
        ticks.filter(function(d){ return d.percentile == 50}).append("path")
             .attr("class", "tick-triangle gradientplot-triangle" )
             .attr("id",  function(d){
                 return `gradientplot-triangle-${d.percentile}`
             }) 
             .attr('d', triangle)
             .attr("fill", "black")
             .attr('transform', function(d) {
                 return `translate(0,${(-sizeUtils.dy*2)})rotate(-180)`;
               })
               .attr("opacity", 0)

        /**
         * risk bin labels
         */
        svg.append("text")
            .attr("x", x(-1.6))
            .attr("y", config.innerHeight)
            .attr("text-anchor", "middle")
            // .attr("dy", sizeUtils.dyLg)
            .attr("class", "plot-label gradientplot-label-riskbin")
            .attr("id", "gradientplot-label-riskbin-decreased")
            .html(labels[1])
            .attr("opacity", 0)

        svg.append("text")
            .attr("x", x(0))
            .attr("y", config.innerHeight)
            // .attr("dy", sizeUtils.dyLg)
            .attr("text-anchor", "middle")
            .attr("class", "plot-label gradientplot-label-riskbin")
            .attr("id", "gradientplot-label-riskbin-average")
            .html(labels[0])
            .attr("opacity", 0)

        svg.append("text")
            .attr("x", x(1.6))
            .attr("y", config.innerHeight)
            .attr("text-anchor", "middle")
            // .attr("dy", sizeUtils.dyLg)
            .attr("class", "plot-label gradientplot-label-riskbin")
            .attr("id", "gradientplot-label-riskbin-increased")
            .html(labels[2])
            .attr("opacity", 0)




}

function makeGradient(config, x, defs){
    var gradient = defs.append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

    gradient.append("stop")
    .attr('class', 'start')
    .attr("offset", getStop(-2.4)) 
    .attr("stop-color", colorUtils.teal)
    .attr("stop-opacity", 1);

    gradient.append("stop")
    .attr('class', 'start')
    .attr("offset", getStop(-1.6))
    .attr("stop-color", colorUtils.lightteal)
    .attr("stop-opacity", 1);

    gradient.append("stop")
    .attr('class', 'start')
    .attr("offset", getStop(-0.8))
    .attr("stop-color", colorUtils.lightgrey)
    .attr("stop-opacity", 1);


    gradient.append("stop")
    .attr('class', 'start')
    .attr("offset", getStop(0))
    .attr("stop-color", colorUtils.lightgrey)
    .attr("stop-opacity", 1);
 
    gradient.append("stop")
    .attr('class', 'start')
    .attr("offset", getStop(0.8))
    .attr("stop-color", colorUtils.lightgrey)
    .attr("stop-opacity", 1);

    gradient.append("stop")
    .attr('class', 'start')
    .attr("offset", getStop(1.6))
    .attr("stop-color", colorUtils.lightred)
    .attr("stop-opacity", 1);

    gradient.append("stop")
    .attr('class', 'start')
    .attr("offset", getStop(2.4))
    .attr("stop-color", colorUtils.red)
    .attr("stop-opacity", 1);


    function getStop(n){
        return `${( ( Math.abs(x(n) ) / config.innerWidth) * 100 ) }%`
    }


}





export{
    render
}