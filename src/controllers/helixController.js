import * as d3 from "d3";
import * as Lattice from "../Lattice";
import * as scrollUtils from "../utils/scrollUtils";
import * as colorUtils from "../utils/colors";
import * as testUtils from "../utils/test-utils";
import * as sizeUtils from "../utils/sizeUtils";
// import { lang } from "../Promises";

let padding, labels;

if (scrollUtils.windowWidth >=800){
    padding = {
        top: 10, 
        right: (d3.select("#variant-plot-wrapper").node().clientWidth*.3), 
        bottom: 10, 
        left: (d3.select("#variant-plot-wrapper").node().clientWidth*.3)
    }
} else {
    padding = {
        top: 40, 
        right: 0, 
        bottom: 10, 
        left: 140
    }
}


const helixConfig = {
    rootId: "variant-plot-wrapper",
    parentId: "helixplot",
    width: d3.select("#variant-plot-wrapper").node().clientWidth,
    height: d3.select("#variant-plot-wrapper").node().clientHeight,
    grid:{
        rows:1,
        columns: 2
    },
    type:"helixplot",

    plotConfigs: {
        positions: 20,
        padding: {top: 0, right: 0, bottom:0, left:0},
        type:"helixplot",
        grid: {
            rows:30,
            columns:2,
        },
        scroll: {
            prog: 0,
            counter: 0,
            speed: 0.2,
            dir: ""
        }
    },
    padding: padding
}

let cur = 0;

function init(config = helixConfig, data, language, verbose = testUtils.verbose){

    if (verbose){
        console.log("HelixPlot config", config)
    }
    Lattice.render(config, data, false); // change class for each call
    if (language == "espanol"){
        labels = ["unidades de información", "variantes genéticas"]
    } else if (language == "english"){
        labels = ["unit of information", "genetic variant"]
    }

    createHelixLabel("helixplot-plot-0-0", "row-0", "helix-label")

    scrollController(config, data)
}


function scrollController(config, data){


    var geneticCodeScene = scrollUtils.createScene("genetic-variation-genetic-code", "sectionScene")
    geneticCodeScene.on('enter', function(e){
        d3.selectAll(".helixplot-plot").transition().duration(500).style("opacity", 1)
    })
    .on('progress', function(e){
        d3.selectAll(".helix-label").style("opacity", scrollUtils.fadeIn(e.progress))
        highlightUnit(config, e)
    })
    .addTo(scrollUtils.controller);  


    var geneticVariant = scrollUtils.createScene("genetic-variation-variant", "subsectionScene")
    geneticVariant
    .on('enter', function(e){
  
            d3.selectAll(".helixplot-plot").transition().duration(500).style("opacity", 1)
        
    })
    .on('progress', function(e){
        config.plotConfigs.scroll.prog = scrollUtils.animationProg(e.progress)
        Lattice.render(config, data, false)
        animateUnit(config, e) 

    })
    .on('leave', function(e){
        if (e.scrollDirection == "FORWARD"){
            d3.selectAll(".helixplot-plot").transition().duration(500).style("opacity", 0)
        } 
    })
    .addTo(scrollUtils.controller);  


}



function animateUnit(config, scroll){

    if (scroll.scrollDirection == "FORWARD"){ 
        cur = cur+1;  
    } else { 
        cur = cur-1;   
    }

    if (cur >= 9){ 
        cur = 9
    }  else if (cur <= 0){ 
        cur = 0 
    }
    cur = Math.round(cur)


    const scale = d3.scaleLinear().domain(scrollUtils.animationDomain).range([0,9,9])
    const plots = d3.selectAll(`.${config.parentId}-plot`)
    const label = d3.selectAll(".helix-label") 

    let index = Math.round(scale(scroll.progress));
    let row = plots.selectAll(`.row-${index}`)
    let yposition = row.selectAll("line").attr("y1");

    plots.selectAll("circle").style("fill", function(d){ return d.fill})
    plots.selectAll("line").style("stroke", function(d){ return d.stroke})
    label.attr("transform", `translate(0,${yposition})`)

    if (index == 9){ 
        label.style("opacity", 1)
        row.selectAll("circle").style("fill", colorUtils.darkgrey)
        row.selectAll("line").style("stroke", colorUtils.darkgrey)

        let r = plots.select(`#column-0-row-9`)
        r.selectAll("circle")
            .style("fill", colorUtils.yellow)
            .style("stroke", colorUtils.yellow)
            .style("opacity", 1)
       
            r.selectAll("line").style("stroke", colorUtils.yellow)
        
        label.selectAll("text")
            .html(labels[1])
            .style("fill", colorUtils.yellow)
            // .html(function(){
            //     var x = d3.select(this).attr("x");
            //     var y = sizeUtils.dy;
            //     return `<tspan x=${+x} dy=${+0}>genetic</tspan>
            //     <tspan x=${+x} dy=${+y}>variant</tspan>`
            //     }) 

    } else if (index == 0){
        label.style("opacity", 1)
        label.selectAll("text")
        .html(labels[0])
        .style("fill", colorUtils.darkgrey)
        // .html(function(){
        //     var x = d3.select(this).attr("x");
        //     var y = sizeUtils.dy;
        //     return `<tspan x=${+x} dy=${+0}>unit of</tspan>
        //     <tspan x=${+x} dy=${+y}>information</tspan>`
        //     }) 

        row.selectAll("circle").style("fill", colorUtils.darkgrey)
        row.selectAll("line").style("stroke", colorUtils.darkgrey)
    } else {
        label.style("opacity", 0)
        row.selectAll("circle").style("fill", colorUtils.darkgrey)
        row.selectAll("line").style("stroke", colorUtils.darkgrey)
    }
}

function highlightUnit(config, scroll){

    const plots = d3.selectAll(`.${config.parentId}-plot`)
    let row = plots.selectAll(`.row-0`)
        row.selectAll("line").style("stroke", scrollUtils.lightToDarkGrey(scroll.progress))
        row.selectAll("circle").style("fill", scrollUtils.lightToDarkGrey(scroll.progress))
}

// on scroll helix redraws to untwist, but it doesn't know to retain the yellow color scale
// function highlightVariant(){
//     let row = d3.select(`#helixplot-plot-0-0-helixplot`).selectAll(".row-9")
//     row.selectAll("line").style("stroke", colorUtils.yellow)
//     row.selectAll("circle").style("fill", colorUtils.yellow)

//     let row2 = d3.select(`#helixplot-plot-0-1-helixplot`).selectAll(".row-9")
//     row2.selectAll("line").style("stroke", colorUtils.darkgrey)
//     row2.selectAll("circle").style("fill", colorUtils.darkgrey)    
// }

/**
 * 
 * @param {*} plot_ 
 * @param {*} row_ 
 * @param {*} class_ 
 * @param {*} text_ 
 * This function should be more generic for all plot labeling
 */
function createHelixLabel(plot_, row_, class_){
    let svg = d3.select(`#${plot_}`);
    let row = svg.selectAll(`.${row_}`);
    let y = parseInt(row.selectAll("line").attr("y1"));
    

    let height = row.selectAll("line").attr("stroke-width") / 2;
    y = y + height;

    let label = svg.append("g").attr("class", class_)
    .attr("transform", `translate(0,${y})` )
    .style("opacity", 0)

    label.append("text") 
        .attr("x", -50)     
        .attr("class", "plot-label")
        .attr("text-anchor", "end")
        .attr("dy", sizeUtils.plotLabelDy)
        .style("fill", colorUtils.darkgrey)
        .html(labels[0])

    label.append("line")
        .attr('class', `label-line`)
        .attr("x1", -10)
        .attr("x2",  -40)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke", "black")
}


export{
    init
}






