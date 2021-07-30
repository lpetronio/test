import { FigureConfig } from "./models/Config";
import { LatticeConfig } from "./models/Config";
import * as testUtils from "./utils/test-utils";
import * as plotUtils from "./utils/plot-utils";
import * as d3 from "d3";



function render(config, verbose = testUtils.verbose) {

    if (verbose){
        console.log("FigurePlot : render() fConfig");
    }
    
    // const parentIdentifier = config.parentId;
    // const parentId = document.getElementById(`${config.rootId}-${parentIdentifier}`); 
    // let svg;
    // if (!parentId) {  svg = createGroup(config, parentIdentifier);  } 
    // else { svg = d3.select(`#${config.rootId}-${parentIdentifier}`).attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);   }


    const rootIdentifier = "svg";
    // const parentIdentifier = "g";
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



    const forceStrength = 0.01;
    const radius = 10;

    // create a force simulation and add forces to it
    const simulation = d3.forceSimulation()
        .force('charge', d3.forceManyBody().strength(5))
        .force('x', d3.forceX().x(function(d){ return d.x} ))
        .force('y', d3.forceY().y(function(d){ return d.y} ))
        .force('collision', d3.forceCollide().radius(d => radius + 1));

    // force simulation starts up automatically, which we don't want as there aren't any nodes yet
   simulation.stop();



    const fConfig = new FigureConfig(  
                    config.data,
                    config.elementId, 
                    config.parentId, 
                    config.rootId, 
                    config.type,
                    config.grid, 
                    config.width, 
                    config.height, 
                    config.plotConfigs, // weird to have this
                    config.padding); 
        


   var plot = svg.selectAll(`.${fConfig.parentId}-${fConfig.groupId}`).data(fConfig.plotConfigs);
    var node = svg.selectAll(`.${fConfig.parentId}-${fConfig.elementId}`)
        .data(fConfig.plotData);

    node.enter()
        .append("circle")
        .attr("class",`${fConfig.parentId}-${fConfig.elementId}`)
    .merge(node) 
        .transition()
        .duration(50)

        if (config.type == "force"){
            simulation.nodes(fConfig.plotData)
                .on('tick', ticked)
                .restart();
        } else {
          lattice()
        }


        function ticked(){
            let n = svg.selectAll(`.${fConfig.parentId}-${fConfig.elementId}`)
                .data(fConfig.forceData);
                n.exit().remove();

            n.enter()
                .append("circle")
                .attr("class",`${fConfig.parentId}-${fConfig.elementId}`)
            .merge(n) 
                .transition()
                .duration(0)
                .attr("cx", function(d){ return d.x})
                .attr("cy", function(d){ return d.y})
                .attr("r", 10)   

          
        }


        function lattice(){
     
            let n = svg.selectAll(`.${fConfig.parentId}-${fConfig.elementId}`)
                .data(fConfig.plotData);
                n.exit().remove();
            n.enter()
                .append("circle")
                .attr("class",`${fConfig.parentId}-${fConfig.elementId}`)
            .merge(n) 
                .transition()
                .duration(50)
                .attr("cx", function(d){ return d.x2})
                .attr("cy", function(d){ return d.y2})
                .attr("r", 10)
            
          
        }

}




    function updateLattice(fConfig){
        node
            .attr("cx", function(d){ return d.x})
            .attr("cy", function(d){ return d.y})
            .attr("r", 10)
    }

    function updateForce(fConfig){
        node
            .attr("cx", function(d){ return d.x})
            .attr("cy", function(d){ return d.y})
             .attr("r", 10)
    }






    // function updateLayout(node){
    //     node
    //         .attr("cx", function(d){ return d.x})
    //         .attr("cy", function(d){ return d.y})
    //         .attr("r", 10)
    // }

    // function updateForce(fConfig, node){

    //     node.merge(node) 
    //         .transition()
    //         .duration(800)
    //         .attr("class",`${fConfig.parentId}-${fConfig.elementId}`)
    //         .attr("cx", function(d){ return d.x})
    //         .attr("cy", function(d){ return d.y})
    //          .attr("r", 10)
    //     node.exit().remove();
    // }



export function createGroup(config, id) {
    const g = d3.select(`#${config.rootId}-svg`).append("g").attr("id", `${config.rootId}-${id}`)
        .attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);
    return g;
}


export{
    render
};