
import * as d3 from "d3";
import * as randomUtils from "../utils/random";
import * as colorUtils from "../utils/colors";
import * as sizeUtils from "../utils/sizeUtils";
import * as plotUtils from "../utils/plot-utils";
import * as testUtils from "../utils/test-utils";
import { createScale } from "../models/Config";


function render(config, verbose = testUtils.verbose){

    
    if (verbose){
        console.log("DistributionPlot : render() distributionConfig, data", config);
    }


    var config = updateConfig(config)
    var data = config.data.distribution;
    console.log("config", config)

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


    let scale = {
        x: d3.scaleLinear().range([0, config.innerWidth]).domain(d3.extent(data, function(d){ return d.q})),
        y: d3.scaleLinear().range([config.innerHeight, 0]).domain(d3.extent(data, function(d) { return d.p; })),
    }

    var line = d3.line()
        .x(function(d) { return scale.x(d.q); })
        .y(function(d) { return scale.y(d.p); })
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(data)
        .attr("id", "ps-calc-pop-distribution-path")
        .attr("class", "distribution-path")
        .attr("d", line);

     //   svg.selectAll(".dist-label").remove()


    //  svg.append("line")
    //  .attr("class", "dist-label label-average label-line-average")
    //  .attr("id", "dist-line-average")
    //  .attr("x1", scale.x(0))
    //  .attr("x2", scale.x(0))
    //  .attr("y1", config.innerHeight)
    //  .attr("y2", 0)
    //  .attr("stroke", "black")
 
//  svg.append("text")
//      .attr("class", "dist-label label-md label-average")
//      .attr("id", "dist-label-average")
//      .attr("x", scale.x(0))
//      .attr("y", -45)
//      .attr("dy", randomUtils.dyMd)
//      .attr("text-anchor", "middle")
//      .html(function(){
//          var x = d3.select(this).attr("x");
//          var y = d3.select(this).attr("dy");
//          return  "<tspan x="+x+" dy="+(+y)+">Most people</tspan>"
//          + "<tspan x="+x+" dy="+(+y)+">&#8595;</tspan>"

//      })  
 
 svg.append("text")
     .attr('class', "dist-label label-md label-decreased")
     .attr("id", "dist-label-decreased")
     .attr("y", -35)
     .attr("x", scale.x(-1))
     .attr("dy", randomUtils.dyMd)
     .attr("text-anchor", "end")
      .html("&#8592; Lower than average")
   //  .html("&#8592; Lower than most people")
  //   .html("&#8592; Fewer people")
 
 svg.append("text")
     .attr('class', "dist-label label-md label-increased")
     .attr("id", "dist-label-increased")
     .attr("y", -35)
     .attr("x", scale.x(1))
     .attr("dy", randomUtils.dyMd)
     .html("Higher than average &#8594;")
    // .html("Higher than most people &#8594;")
    // .html("Fewer people &#8594;")
 
 
 
 svg.selectAll(".dist-label").attr("opacity", 0)



    // let distributionExtent = d3.extent(config.data.distribution, function(d){ return d.q})

    // let scale = {
    //     x: d3.scaleLinear().range([0, config.innerWidth]).domain(d3.extent(config.data.risk, function(d){ return d.percentile})),
    //     x2: d3.scaleLinear().range([0, config.innerWidth]).domain(distributionExtent),
    //     color: d3.scaleLinear().range([colorUtils.teal, colorUtils.lightteal, colorUtils.lightgrey, colorUtils.lightred, colorUtils.red]).domain([0, 15, 50, 85, 100]),
    //     y: d3.scaleLinear().range([config.innerHeight, 0]).domain(d3.extent(config.data.distribution, function(d) { return d.p; })),
    //     tickSizeX: config.innerWidth / config.data.risk.length,
    //     tickSizeY: config.innerHeight
    // }
    // config.scale = scale;
   //createScales(config)
        
    //renderPath(config, config.data.distribution)



}

// cant name this the same as in Config.js????
function createScales(config){

    let distributionExtent = d3.extent(config.data.distribution, function(d){ return d.q})

    let scale = {
    //    x: d3.scaleLinear().range([0, config.innerWidth]).domain(d3.extent(config.data.risk, function(d){ return d.percentile})),
        x2: d3.scaleLinear().range([0, config.innerWidth]).domain(distributionExtent),
     //   color: d3.scaleLinear().range([colorUtils.teal, colorUtils.lightteal, colorUtils.lightgrey, colorUtils.lightred, colorUtils.red]).domain([0, 15, 50, 85, 100]),
        y: d3.scaleLinear().range([config.innerHeight, 0]).domain(d3.extent(config.data.distribution, function(d) { return d.p; })),
      //  tickSizeX: config.innerWidth / config.data.risk.length,
     //   tickSizeY: config.innerHeight
    }
    config.scale = scale;

}



function renderPath(config, data){


    let scale = {
        x: d3.scaleLinear().range([0, config.innerWidth]).domain(d3.extent(data, function(d){ return d.q})),
        y: d3.scaleLinear().range([config.innerHeight, 0]).domain(d3.extent(data, function(d) { return d.p; })),
    }

    var line = d3.line()
        .x(function(d) { return scale.x(d.q); })
        .y(function(d) { return scale.y(d.p); })
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(data)
        .attr("id", "ps-calc-pop-distribution-path")
        .attr("class", "distribution-path")
       // .style("opacity", 0)
        .attr("d", line);

     //   svg.selectAll(".dist-label").remove()


        svg.append("line")
            .attr("class", "dist-label label-average label-line-average")
            .attr("x1", scale.x(0))
            .attr("x2", scale.x(0))
            .attr("y1", config.innerHeight)
            .attr("y2", 0)
            .attr("stroke", "black")
        
        // svg.append("text")
        //     .attr("class", "dist-label label-md label-average")
        //     .attr("x", scale.x(0))
        //   //  .attr("y", -35)
        //     .attr("y", -45)
        //     .attr("dy", randomUtils.dyMd)
        //     .attr("text-anchor", "middle")
        //   //  .html("&#8595;")
        //     .html(function(){
        //         var x = d3.select(this).attr("x");
        //         var y = d3.select(this).attr("dy");
        //         return  "<tspan x="+x+" dy="+(+y)+">Most people</tspan>"
        //         + "<tspan x="+x+" dy="+(+y)+">&#8595;</tspan>"

        //     })  
        
        svg.append("text")
            .attr('class', "dist-label label-md label-decreased")
            .attr("y", -35)
            .attr("x", scale.x(-1))
            .attr("dy", randomUtils.dyMd)
            .attr("text-anchor", "end")
             .html("&#8592; Lower than average")
          //  .html("&#8592; Lower than most people")
         //   .html("&#8592; Fewer people")
        
        svg.append("text")
            .attr('class', "dist-label label-md label-increased")
            .attr("y", -35)
            .attr("x", scale.x(1))
            .attr("dy", randomUtils.dyMd)
            .html("Higher than average &#8594;")
           // .html("Higher than most people &#8594;")
           // .html("Fewer people &#8594;")
        
        
        
   // svg.selectAll(".dist-label").attr("opacity", 0)

}






function updateConfig(config){
    config.innerHeight = config.height - config.padding.top - config.padding.bottom;
    config.innerWidth = config.width - config.padding.left - config.padding.right;
    return config
}

function createGroup(config, id) {
    const g = d3.select(`#${config.rootId}-svg`).append("g").attr("id", `${config.rootId}-${id}`)
        .attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);
    return g;
}

//function renderPsStack(config){


    // let svg = d3.select(`#ps-calc-pop-plot-wrapper-svg`)
    //     .append("g")  
    //     .attr("id", "ps-calc-pop-plot-wrapper-distribution")
    //     .style("opacity", 0)
    //     .attr("transform", `translate(${parentConfig.padding.left}, ${parentConfig.padding.top + (siblingConfig.padding.top/2)})`);

    // d3.select("#ps-calc-pop-plot-wrapper-distribution").moveToBack()

    // renderStack(svg, parentConfig, siblingConfig.data.distribution2)
    // renderPath(svg, parentConfig, siblingConfig.data.distribution)

//}


// function renderStack(svg, config, data){

//     config.innerWidth = config.width - config.padding.left - config.padding.right;
//     config.innerHeight = config.height - config.padding.top - config.padding.bottom;

//     var x = d3.scaleLinear()
//         .domain(d3.extent(data.map(d => d.x)))     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
//         .range([0, config.innerWidth])
    
//     // set the parameters for the histogram
//     var histogram = d3.histogram()
//         .value(function(d) { return d.x; })   // I need to give the vector of value
//         .domain(x.domain())  // then the domain of the graphic
//         .thresholds(x.ticks(50)); // then the numbers of bins
    
//     var bins = histogram(data);
//     let size = 20;
    
//     var y = d3.scaleLinear()
//         .range([config.innerHeight + size, -size])
//         .domain([0, d3.max(bins, function(d) { return d.length; })]); 
    
//       let bin = svg.selectAll(".bin")
//         .data(bins)
//         .enter()
//         .append("g")
//         .attr("class", "ps-calc-pop-distribution-isotype")
//         .attr("transform", function(d, i){  return `translate(${x(d.x0)},${-size*3})` })
//         .each(function(d, i){
            
//             d3.select(this)
//                 .selectAll(".isotype")
//                 .data(function(e){  return e })
//                 .enter()
//                 .append("svg:image")
//                 .attr('x', 0)
//                 .attr('y', function(e, j){ return y(j) + size  })
//                 .attr('height',  size)
//                 .attr("class", "ps-calc-pop-isotype-img")
//                 .attr("xlink:href","images/isotype.png")
//         })

// }



      

export{
    render
}