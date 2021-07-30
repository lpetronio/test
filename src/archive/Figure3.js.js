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




//     const radius = 10;
//     const simulation = d3.forceSimulation()
//         .force('charge', d3.forceManyBody().strength(.5))
//         .force('x', d3.forceX().x(function(d){ return d.x} ))
//         .force('y', d3.forceY().y(function(d){ return d.y} ))
//         .force('collision', d3.forceCollide().radius(d => radius + 1));

//    simulation.stop();

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

         var node = svg.selectAll(`.${fConfig.parentId}-${fConfig.elementId}`)
        //     .data(fConfig.plotData)
        //     .enter()
        //     .append("circle")
        //     .attr("class",`${fConfig.parentId}-${fConfig.elementId}`)
        // .merge(node) 
        //     .transition()
        //     .duration(50)

        // node.exit().remove()

        const nodeData = fConfig.plotData.map(function(d){ return d });

        const radius = 10;
        const simulation = d3.forceSimulation(nodeData)
            .force('charge', d3.forceManyBody().strength(-100))
            .force('x', d3.forceX().x(function(d){ return d.x} ))
            .force('y', d3.forceY().y(function(d){ return d.y} ))
            .force('collision', d3.forceCollide().radius(d => radius + 1))
            .alphaTarget(1)
            .on("tick", ticked);
    

            restart(nodeData)


            function restart(nodes) {

                // transition
                var t = d3.transition()
                    .duration(750);
          
                // Apply the general update pattern to the nodes.
                node = node.data(nodes, function(d) { return d.id;});
          
                node.exit()
                    .style("fill", "#b26745")
                  .transition(t)
                    .attr("r", 1e-6)
                    .remove();
          
                node
                    .transition(t)
                      .style("fill", "#3a403d")
                      .attr("r", function(d){ return d.size; });
          
                node = node.enter().append("circle")
                    .style("fill", "#45b29d")
                    .attr("r", function(d){ return d.size })
                    .merge(node);
          
                // Update and restart the simulation.
                simulation.nodes(nodes)
                  .force("collide", d3.forceCollide().strength(1).radius(function(d){ return radius + 1; }).iterations(1));
          
              }
          
              function ticked() {
                node.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; })
          
              }





}






export function createGroup(config, id) {
    const g = d3.select(`#${config.rootId}-svg`).append("g").attr("id", `${config.rootId}-${id}`)
        .attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);
    return g;
}


export{
    render
};