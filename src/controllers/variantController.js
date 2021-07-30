import * as d3 from "d3"; 
// import * as Configuration from "../models/Config";
import * as Lattice from "../Lattice";
import * as Grid from "../Grid";
import * as scrollUtils from "../utils/scrollUtils";
import * as colorUtils from "../utils/colors"
import * as sizeUtils from "../utils/sizeUtils";

let paddingbottom, paddingtop;
//const labels;

if (scrollUtils.windowWidth >=800){
    paddingbottom = 200;
    paddingtop = 10;
} else {
    paddingbottom = 80;
    paddingtop = 10;
}


const variantConfig = {
    rootId: "variant-plot-wrapper",
    parentId: "variantplot",
    width: d3.select("#variant-plot-wrapper").node().clientWidth,
    height: d3.select("#variant-plot-wrapper").node().clientHeight,
    grid:{
        rows:1,
        columns: 3
    },
    type:"towerplot-pair",
    plotConfigs: {
        positions: 30,
        padding: {top: 0, right: 0, bottom:0, left:0},
        type:"towerplot-pair",
        grid:{ // will change depending on stack or pair
            rows: undefined, 
            columns: 2
        },
        scale:{x: "", y:"", color:"" },
        colorType: "grey",
        opacityType: "normal",
        scroll: {
            prog: 0,
            counter: 0,
            speed: 0.2
        }
    },
    padding: {top: paddingtop, right: 0, bottom:paddingbottom, left:100}
};


const variantFiguresConfig = {
    rootId: "variant-plot-wrapper",
    parentId: "variantplotfigures",
    elementId: "node",
    width: d3.select("#variant-plot-wrapper").node().clientWidth,
    height: d3.select("#variant-plot-wrapper").node().clientHeight,
    src: "phenotype",
    color: {
        type: "single",
        fill: true
    },
    plotConfigs: {
        src: "",
        padding: {top: 0, right: 0, bottom:0, left:0},
        scroll: {
            prog: 0,
            counter: 0,
            speed: 0.2
        }
    },
    grid:{
        rows:1,
        columns: 3
    },
    padding: {top: paddingtop, right: 0, bottom:paddingbottom, left:100}
};

let labels;
function init(tConfig = variantConfig, configFigures = variantFiguresConfig, data, language){


        const fConfig = configFigures

        Lattice.render(tConfig, data, false);
        highlightVaiants(tConfig); 

        d3.select(`#${tConfig.rootId}-${tConfig.parentId}`).attr("opacity", 0)

        let label = d3.select(`#${tConfig.parentId}-plot-0-0`)
            .append("g")
            .attr("class", `${tConfig.parentId}-plot-0-0-label`);
        label.append("text")
        label.append("line")


        if (language == "espanol"){
            labels = ["variantes de riesgo"]
        } else if (language == "english"){
            labels = ["risk variant"]
        }


        scrollController(tConfig, fConfig)
}

function scrollController(config, configFigures, data){

    // ###################################### normal variant
    var enter = scrollUtils.createScene("genetic-variation-group-variant", "sectionScene")
    enter.on("enter", function(e){

        
        d3.select("#riskvariant-plot-wrapper-riskvariantplot").attr("opacity", 0)

        d3.select(`#${config.rootId}-${config.parentId}`).transition().duration(500).style("opacity", 1)

        configFigures.src = "phenotype"
        configFigures.color.type = "single"
        Grid.render(configFigures, undefined);

        d3.selectAll(`.${configFigures.parentId}-${configFigures.elementId}`).transition().duration(500).style("opacity", 1)
    })

    .on('leave', function(e){
        if (e.scrollDirection == "FORWARD"){
            d3.select(`#${config.rootId}-${config.parentId}`).transition().duration(500).style("opacity", 1)
            d3.selectAll(`.${configFigures.parentId}-${configFigures.elementId}`).transition().duration(500).style("opacity", 1)

        } else {
            d3.selectAll(`.${configFigures.parentId}-${configFigures.elementId}`).transition().duration(500).style("opacity", 0)
            d3.select(`#${config.rootId}-${config.parentId}`).transition().duration(500).style("opacity", 0)
        }
    })
    
    .addTo(scrollUtils.controller);  

    // ###################################### disease variant
    var scene2 = scrollUtils.createScene("genetic-variation-group-disease-variant", "subsectionScene")
    scene2.on('enter', function(e){
        
        d3.select(`#${config.rootId}-${config.parentId}`).transition().duration(500).style("opacity", 1)
        d3.select("#riskvariant-plot-wrapper-riskvariantplot").attr("opacity", 0)
        configFigures.src = "disease"
        configFigures.color.type = "binary"
        Grid.render(configFigures, undefined);
        d3.selectAll(`.${configFigures.parentId}-${configFigures.elementId}`).transition().duration(500).style("opacity", 1)


    })
    .on('progress', function(e){
        highlightRiskVaiants(config, e.progress)
    })
    .addTo(scrollUtils.controller); 



}

function highlightVaiants(config){

    const p1 = d3.select(`#${config.parentId}-plot-0-0`)
    const p2 = d3.select(`#${config.parentId}-plot-0-1`)
    const p3 = d3.select(`#${config.parentId}-plot-0-2`)

    p1.selectAll(".towerplot-rect")
    .style("fill", colorUtils.lightgrey)
    .filter((d, i)=> {  
        return d.position == 10 && d.copy == 1 
            || d.position == 27 && d.copy == 2
        })
    .style("fill", colorUtils.yellow)
    .classed("yellow", true)

    p2.selectAll(".towerplot-rect")
    .style("fill", colorUtils.lightgrey)
    .filter((d, i)=> {  
        return d.position == 27 
            || d.position == 5 && d.copy == 1 
        })
    .style("fill", colorUtils.yellow)
    .classed("yellow", true)

    p3.selectAll(".towerplot-rect")
    .style("fill", colorUtils.lightgrey)
    .filter((d, i)=> {   
        return d.position == 27 && d.copy == 1
            || d.position == 5 && d.copy == 2 
    })  
    .style("fill", colorUtils.yellow)
    .classed("yellow", true)

}

// below function should behave like helix but the issue is the helix renders once in init(), so label doesnt need to get removed/redrawn
function highlightRiskVaiants(config, prog){

    const plot = d3.select(`#${config.parentId}-plot-0-0`)
   
   let row = plot.selectAll(".towerplot-rect")
        .filter((d, i)=> { return d.position == 10 && d.copy == 1 });
    
    let height = parseInt(row.attr("height")) / 2;
    let y = parseInt(row.attr("y"));
    row.style("fill", scrollUtils.yellowToRed(prog))  

   let label = d3.selectAll(`.variantplot-plot-0-0-label`)
   label
        .style("opacity", scrollUtils.animateIn(prog))
        .attr("transform", `translate( ${-25} , ${y + height} )`)

    label.selectAll("text")
        .style("fill", colorUtils.red)
         .attr("dy", sizeUtils.plotLabelDy)
        .attr("text-anchor", "end")
        .classed("plot-label", true)
        .html(labels[0])

        label.selectAll("line")
        .attr("x1", 5)
        .attr("x2", 20)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke", "black")

}



// function createLabel(config){
//     if (config.parentId == "variantplot-plot-0-0"){
//         let labels = document.getElementsByClassName(`${tConfig.parentId}-label`);
//         if (labels.length == 0){
//             let label = svg.append("g")
//                 .attr("transform", `translate(${tConfig.scale.x(1)},${tConfig.scale.y(10) + (tConfig.scale.height/2)})`)
//                 .attr("class", `${tConfig.parentId}-label`)
//                 .style("opacity", 0)
            
//                 label.append("text")
//                 .attr("class", `plot-label`)
//                 .attr("text-anchor", "end")
//                 .attr("x", -25)
//                 .attr("y", 0)
//                 .attr("dy", sizeUtils.plotLabelDy)
//                 .html("risk variant")
//                 .style("fill", colorUtils.red)
        
//                 label.append("line")
//                 .attr("x1", -20)
//                 .attr("x2", 0)
//                 .attr("class", "label-line")

//         }

//     } 
// }


// function createVariantLabel(plot_, row_, class_){
//     let svg = d3.select(`#${plot_}`);
//     let row = svg.selectAll(`.${row_}`);
//     let y = parseInt(row.selectAll("line").attr("y1"));
    

//     let height = row.selectAll("line").attr("stroke-width") / 2;
//     y = y + height;

//     let label = svg.append("g").attr("class", class_)
//     .attr("transform", `translate(0,${y})` )
//     .style("opacity", 0)

//     label.append("text") 
//         .attr("x", -50)     
//         .attr("class", "plot-label")
//         .attr("text-anchor", "end")
//         .attr("dy", sizeUtils.plotLabelDy)
//         .style("fill", colorUtils.darkgrey)
//         .html(labels[0])

//     label.append("line")
//         .attr('class', `label-line`)
//         .attr("x1", -10)
//         .attr("x2",  -40)
//         .attr("y1", 0)
//         .attr("y2", 0)
//         .attr("stroke", "black")
// }


export {
    init
}