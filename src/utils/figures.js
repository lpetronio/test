import * as d3 from "d3";

function getInnerHeight(config){
    let innerHeight = config.plotConfigs[0].height - config.plotConfigs[0].padding.top - config.plotConfigs[0].padding.bottom;
    return innerHeight
}

function getInnerWidth(config){
    let innerWidth = config.plotConfigs[0].width - config.plotConfigs[0].padding.left - config.plotConfigs[0].padding.right;
    return innerWidth
}

function helix(config){

    let innerHeight = getInnerHeight(config)
    let innerWidth = getInnerWidth(config)

    d3.select("#helixplot-plot-0-0")
        .append("svg:image")
        .attr('x', -100)
        .attr('y',  innerHeight - innerHeight/2 )
        .attr('height',  innerHeight/2)
        .attr("class", "figure")
        .attr("xlink:href","images/figure.png")
}


function variant(config, type){

    let innerHeight = getInnerHeight(config)
    let innerWidth = getInnerWidth(config)
    let paddingBottom = config.padding.bottom - 20;
    let paddingLeft = config.plotConfigs[0].padding.left;

    d3.selectAll(`.${config.parentId}-plot`).each(function(d, i){
        d3.select(this).selectAll(".figure").remove()
        d3.select(this).append("svg:image")
        .attr('x', paddingLeft)
        .attr('y',  innerHeight + 20)
        .attr('height',  paddingBottom)
        // .attr('x', innerWidth/4)
        // .attr('y',  innerHeight + 10)
        // .attr('width',  innerWidth/2)
        .attr("class", "figure")
        .attr("xlink:href",function(e){
            if (type == "trait"){
               return `images/figure-trait-${i}.png`
            } else {
                return `images/figure-cad-${i}.png`
            }
        })
 
        // .attr("xlink:href",`images/figure-trait-${i}.png`)
    })
}


function gwas(config){

    let innerHeight = getInnerHeight(config)
    let innerWidth = getInnerWidth(config)
    let paddingBottom = config.padding.bottom - 20;
    let paddingLeft = config.plotConfigs[0].padding.left;

    d3.selectAll(`.${config.parentId}-plot`).each(function(d, i){
        d3.select(this).append("svg:image")
        .attr('x', paddingLeft)
        .attr('y',  innerHeight + 10)
        .attr('width',  innerWidth)
        .attr("class", "figure")
        .attr("xlink:href", function(){
            if (i >=10){
                return   "images/figure-cad-0.png"
            } else {
                return "images/figure-cad-1.png"
            }
        })

    })

}


function psCalcPop(config){

    let innerWidth = (config.plotConfigs[0].width) - (config.plotConfigs[0].padding.left) - (config.plotConfigs[0].padding.right)
    let innerHeight = (config.plotConfigs[0].height) - (config.plotConfigs[0].padding.top) - (config.plotConfigs[0].padding.bottom)
    let svg = d3.select(`#${config.domId}-lattice`)
    
    svg.selectAll(".plot").each(function(d, i){
        d3.select(this).append("svg:image")
        .attr('x', innerWidth/3)
        .attr('y',  innerHeight + 20)
        .attr('height',  50)
        .attr("class", "figure")
        .attr("xlink:href","images/figure.png")

    })


}

function psCalcIndv(config){

    let innerWidth = (config.plotConfigs[0].width) - (config.plotConfigs[0].padding.left) - (config.plotConfigs[0].padding.right)
    let innerHeight = (config.plotConfigs[0].height) - (config.plotConfigs[0].padding.top) - (config.plotConfigs[0].padding.bottom)
    let svg = d3.select(`#${config.domId}-lattice`)
    
    // d3.select("#ps-calc-plot-wrapper-plot-0-0-towerplot")
    //     .append("svg:image")
    //     .attr('x', -50)
    //     .attr('y',  innerHeight - 50)
    //     .attr('height',  50)
    //     .attr("class", "sillhouet")
    //     .attr("xlink:href","images/isotype.png")


    d3.select("#ps-calc-plot-wrapper-plot-0-0-towerplot")
    .append("svg:image")
    .attr('x', -100)
    .attr('y',  innerHeight - 150)
    .attr('height',  150)
    .attr("class", "figure")
    .attr("xlink:href","images/figure.png")
    
}






export {
    helix,
    variant,
    gwas,
    psCalcPop,
    psCalcIndv
}