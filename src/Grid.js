import { GridConfig } from "./models/GridConfig";
import * as testUtils from "./utils/test-utils";
import * as scrollUtils from "./utils/scrollUtils";
import * as sizeUtils from "./utils/sizeUtils";
import * as d3 from "d3";





function render(config, verbose = testUtils.verbose) {


    const rootIdentifier = "svg";
    const parentIdentifier = config.parentId;
    const rootId = document.getElementById(`${config.rootId}-${rootIdentifier}`);
    const parentId = document.getElementById(`${config.rootId}-${parentIdentifier}`); // this is confusing!

    let svg;

    if (!rootId){
        createSvg(config)
        if (!parentId) {  
            svg =  createGroup(config, parentIdentifier);  
        } 
        else { 
            svg = d3.select(`#${config.parentId}-${parentIdentifier}`)
                .attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);   
        }
    } 
    else {
        if (!parentId) {  
            svg = createGroup(config, parentIdentifier);  
        } 
        else { 
            svg = d3.select(`#${config.rootId}-${parentIdentifier}`).attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);   
        }
    }


    const fConfig = new GridConfig(  
                    config.data,
                    config.elementId, 
                    config.parentId, 
                    config.rootId, 
                    config.type,
                    config.grid, 
                    config.color,
                    config.width, 
                    config.height, 
                    config.plotConfigs, // weird to have this
                    config.padding); 

    if (verbose){
        console.log("FigurePlot: render()", fConfig)      
    }
        

    let node = svg.selectAll(`.${fConfig.parentId}-${fConfig.elementId}`).data(fConfig.plotData)

    node.enter()
    .append("g")
    .attr("class", function(d){
        return `${fConfig.parentId}-${fConfig.elementId} ${fConfig.elementId}-row-${d.row} ${fConfig.elementId}-column-${d.column} `
    })
    .attr(`transform`, function(d){
        return `translate(${d.x},${d.y})`
    })
    .merge(node)
        .transition().duration(scrollUtils.transitionDuration)
        .attr("class", function(d){
            return `${fConfig.parentId}-${fConfig.elementId} ${fConfig.elementId}-row-${d.row} ${fConfig.elementId}-column-${d.column} ${fConfig.parentId}-${d.column}`
        })
        .attr(`transform`, function(d){
            return `translate(${d.x},${d.y})`
        })
        .each(function(each, i){
            let scale;
            if (scrollUtils.windowWidth >= 800){
                scale = .3
            } else {
                scale = .5
            }

            let this_ = d3.select(this)
            if (fConfig.parentId == "variantplotfigures"){
                this_.selectAll('.figure-svg').remove();
                this_.append("svg:image")
                    .attr("class", "figure-svg")
                    .attr("xlink:href", `images/figure-${config.src}-${i}.svg`)
                    .attr("width", each.width*scale)
                    .attr("x", 0)
                    .attr("y", 8)

            }   else {
                this_.selectAll('path').remove();
                this_.append("path")
                .attr("d", "M16.9,10.3l-0.5,11.4c-0.1,1.3-1,2.3-2.3,2.4l0,0l-1.1,12.7c0,1.5-0.8,2.7-1.7,2.7H6.8c-0.9,0-1.7-1.2-1.7-2.7L4,24.1l0,0C2.7,24,1.7,23,1.7,21.7L1.1,10.3c0-1.3,1.2-2.1,2.7-2.1h2.7C5.4,7.5,4.7,6.2,4.8,4.8c0-2.4,1.9-4.3,4.3-4.3c2.4,0,4.3,1.9,4.3,4.3c0,1.4-0.7,2.7-1.8,3.5h2.6C15.6,8.2,16.9,9,16.9,10.3z")
                .attr("fill", each.color)
                .attr("x", 0)
                .attr("y", 0)
            }

        })

        node.exit().remove()



 }



function createGroup(config, id) {
    const g = d3.select(`#${config.rootId}-svg`).append("g").attr("id", `${config.rootId}-${id}`)
        .attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);
    return g;
}


function createSvg(config) {
    const svg = d3.select(`#${config.rootId}`).append("svg").attr("id", `${config.rootId}-svg`) 
        .attr("width", config.width)
        .attr("height", config.height)
    return svg;
}


export{
    render
};