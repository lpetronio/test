import * as d3 from "d3"; 
import * as Lattice from "../Lattice";
import * as TowerPlot from "../plots/TowerPlot";
// import * as ClusterPlot from "../plots/ClusterPlot";
import * as ClusterLattice from "../ClusterLattice";
import * as figures from "../utils/figures"

import * as scrollUtils from "../utils/scrollUtils";
import * as colorUtils from "../utils/colors"
// import * as randomUtils from "../utils/random"





const riskVariantConfig = {
    rootId: "plot-wrapper",
    parentId: "riskvariantplot",
    width: d3.select("#plot-wrapper").node().clientWidth,
    height: d3.select("#plot-wrapper").node().clientHeight,
    grid:{
        rows:1,
        columns: 21
    },
    type:"towerplot-pair",
    plotConfigs: {
        positions: 150,
        padding: {top: 0, right: 5, bottom:0, left:5},
        type:"towerplot-pair",
        scroll: {
            prog: 0,
            counter: 0,
            speed: 0.2
        }
    },
    padding: {top: 20, right: 0, bottom:100, left:0}
};


const riskVariantClusterConfig = {
    rootId: "plot-wrapper",
    parentId: "riskvariantclusterplot",
    width: d3.select("#plot-wrapper").node().clientWidth,
    height: d3.select("#plot-wrapper").node().clientHeight,
    grid:{
        rows:1,
        columns: 21
    },
    type:"clusterplot",
    plotConfigs: {
        positions: 150,
        padding: {top: 0, right: 5, bottom:0, left:5},
        type:"clusterplot",
        scroll: {
            prog: 0,
            counter: 0,
            speed: 0.2
        }
    },
    padding: {top: 20, right: 0, bottom:100, left:0}
};


function init(config = riskVariantConfig, clusterConfig = riskVariantClusterConfig, data){


    const clusterData = data.map(function(d){ return d  })
    clusterData.forEach(function(d){
        d.data = d.values
        d.plotConfig = clusterConfig.plotConfigs
        let group;
        let figure;
        if (d.percentile > 50){
            figure = "figure-cad-0"
            group = "cad"
        } else {
            figure = "figure-cad-1"
            group = "noncad"
        }
        d.figure = figure;
        d.group = group;
    })
    clusterConfig.plotConfigs = clusterData;

    const towerData = data.map(function(d){ return d  })
    const updateTowerPlotData = towerData.filter((n, i) => i % 5 === 0 || n.percentile == 99);
    updateTowerPlotData.forEach(function(d){
        d.data = d.values.filter(function(e){ return e.position <= config.plotConfigs.positions })
        d.plotConfig = config.plotConfigs
    })
    TowerPlot.updateData(config, updateTowerPlotData)
    config.plotConfigs = updateTowerPlotData;



    scrollController(config, clusterConfig)

}

function scrollController(config, clusterConfig){
    // ######################################
    var scene1 = scrollUtils.createScene("riskvariant-populations")
    scene1.on("enter", function(e){
       ClusterLattice.render(clusterConfig, false);
    })
    .on('progress', function(e){
       // d3.selectAll(".riskvariantplot-plot").attr("opacity", scrollUtils.fadeIn(e.progress))     
    })
    .addTo(scrollUtils.controller);  




    var scene2 = scrollUtils.createScene("riskvariant-genetic-code")
    scene2.on("enter", function(e){
            Lattice.render(config, false);
            figures.gwas(config)
        })
        .on('progress', function(e){
            d3.selectAll(".riskvariantplot-plot").attr("opacity", scrollUtils.fadeIn(e.progress))     
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

function highlightRiskVaiants(config, prog){
    
    let yellowToRed = d3.scaleLinear().domain([0, .5]).range([colorUtils.yellow, colorUtils.red])
    let yellowToGrey = d3.scaleLinear().domain([0, 1]).range([colorUtils.yellow, colorUtils.lightgrey])
  
    const plots = d3.selectAll(`.${config.parentId}`)
    const p1 = d3.select(`#${config.parentId}-plot-0-0`)

    plots.selectAll(".yellow").style("fill", yellowToGrey(prog))  
    p1.select(".variant-label-associated").remove()
 
    let row = p1.selectAll(".towerplot-rect")
        .filter((d, i)=> { return d.position == 10 && d.copy == 1 })
        .style("fill", yellowToRed(prog))  
    
    let x = row.attr("x")
    let y = row.attr("y")

    let g = p1.append("g")
        .attr("transform", `translate(${x},${y})`)
        .attr("class", "variant-label-associated")
    
    g.append("text")
        .attr('class', "variant-label-associated")
        .attr("text-anchor", "end")
        .attr("x", -25)
        .attr("y", 0)
        .html("risk variant")

    g.append("line")
        .attr("x1", -20)
        .attr("x2", 0)
        .attr("class", "label-line")
}






export {
    init
}