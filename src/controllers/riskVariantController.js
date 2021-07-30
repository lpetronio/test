import * as d3 from "d3"; 
import * as Configuration from "../models/Config";
import * as Lattice from "../Lattice";
import * as Grid from "../Grid";
import * as scrollUtils from "../utils/scrollUtils";
import * as colorUtils from "../utils/colors"


let columns;
let paddingbottom;
let paddingtop;
let labels; 
if (scrollUtils.windowWidth >=800){
    columns = 21;
    paddingbottom = 100;
    paddingtop = 20;
} else {
    columns = 11;
    paddingbottom = 80;
    paddingtop = 20;
}


const riskVariantConfig = {
    rootId: "riskvariant-plot-wrapper",
    parentId: "riskvariantplot",
    width: d3.selectAll(".plot-wrapper").node().clientWidth,
    height: d3.selectAll(".plot-wrapper").node().clientHeight,
    grid:{
        rows:1,
        columns: columns
    },
    type:"towerplot-pair",
    plotConfigs: {
        positions: 80,
        padding: {top: 0, right: 5, bottom:0, left:5},
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
    padding: {top: paddingtop, right: -5, bottom:paddingbottom, left:5}
};


const riskVariantFiguresConfig = {
    rootId: "riskvariant-plot-wrapper",
    parentId: "riskvariantplotfigures",
    elementId: "node",
    width: d3.selectAll(".plot-wrapper").node().clientWidth,
    height: d3.selectAll(".plot-wrapper").node().clientHeight,
    color: {
        type: "single",
        fill: true
    },
    plotConfigs: {
        src: "",
        padding: {top: 0, right: 5, bottom:0, left:5},
        type:"force",
        scroll: {
            prog: 0,
            counter: 0,
            speed: 0.2
        }
    },
    grid:{
        rows:8,
        columns: columns
    },
    padding: {top: 0, right: -10, bottom:paddingbottom - 20, left:10}
};


function init(tConfig = riskVariantConfig, configFigures = riskVariantFiguresConfig, data, language){
    if (language == "espanol"){
        labels = ["sin enfermedad", "con enfermedad"]
    } else if (language == "english"){
        labels = ["without disease", "with disease"]
    }

    var fConfig = configFigures
    Lattice.render(tConfig, data, undefined);

    d3.select(`#${tConfig.rootId}-${tConfig.parentId}`).attr("opacity", 0)     
   
    fConfig.color.type = "single";
    Grid.render(fConfig, undefined);

    createPopulationLabels(fConfig)

    scrollController(tConfig, fConfig, data)

}

function scrollController(config, configFigures, data){


    const group =  scrollUtils.createScene("riskvariant-group", "sectionScene")
    group.on('enter', function(e){
        d3.select(`#${config.rootId}-${config.parentId}`).attr("opacity", 0)     
    })
    .on('progress', function(e){
              
        if (e.progress <= scrollUtils.endAnimationTrigger){

            configFigures.color.type = "single"
            Grid.render(configFigures, undefined);
          
            d3.selectAll(`.${configFigures.parentId}-label`)
                .transition()
                .duration(scrollUtils.transitionDuration)
                .style("opacity", 0)   

        } else {

            configFigures.color.type = "binary"
            Grid.render(configFigures, undefined);
         
            d3.selectAll(`.${configFigures.parentId}-label`)
                .transition()
                .duration(scrollUtils.transitionDuration)
                .style("opacity", 1)   

            d3.select(`#${config.rootId}-${config.parentId}`)
                .transition()
                .duration(scrollUtils.transitionDuration)
                .style("opacity", 0)   
            
        } 
    })
    .addTo(scrollUtils.controller);  


    // ###################################### this will be a towerplot-pair
    var posVariant = scrollUtils.createScene("riskvariant-increase")
    posVariant.on('enter', function(){
        configFigures.color.type = "binary-row"
        Grid.render(configFigures, undefined);


        config.plotConfigs.colorType = "greyRed";
        config.plotConfigs.opacityType = "normal";
        Lattice.render(config, data, false)

        d3.select(`#${config.rootId}-${config.parentId}`)
            .transition()
            .duration(scrollUtils.transitionDuration)
            .style("opacity", 1)  

    })
    .addTo(scrollUtils.controller);  


    var negVariant = scrollUtils.createScene("riskvariant-decrease")
    negVariant.on('enter', function(){

        configFigures.color.type = "binary-row"
        Grid.render(configFigures, undefined);

        config.plotConfigs.colorType = "greyRedTeal";
        config.plotConfigs.opacityType = "normal";
        Lattice.render(config, data, false)
    })
    .addTo(scrollUtils.controller);  

    // ###################################### this will be a towerplot-pair
    var magnitude = scrollUtils.createScene("riskvariant-magnitude-1")
    magnitude
    .on('enter', function(e){
        config.plotConfigs.colorType = "greyRedTeal";
        config.plotConfigs.opacityType = "normal";
        Lattice.render(config, data, false);
    })
    .on('leave', function(e){
        if (e.scrollDirection == "FORWARD"){
            config.plotConfigs.colorType = "greyRedTeal";
            config.plotConfigs.opacityType = "effectSize";
            Lattice.render(config, data, false);
        }
    })
    .addTo(scrollUtils.controller);  

    var magnitude2 = scrollUtils.createScene("riskvariant-magnitude-2")
    .addTo(scrollUtils.controller);  

        // ###################################### leave
    scrollUtils.createScene("riskvariant-leave").addTo(scrollUtils.controller);  
    
}


// function defaultColor(config){
//     d3.selectAll(`.${config.parentId}-plot .towerplot-rect`).style("fill", colorUtils.lightgrey)
// }

// function highlightPosUnit(config, scrollProgress){
//     d3.selectAll(`.${config.parentId}-plot .towerplot-rect`)
//         .filter((d, i)=> {  return d.effect == "positive" })
//         .style("fill", scrollUtils.greyToRed(scrollProgress))
// }

// function highlightNegUnit(config, scrollProgress){
//     d3.selectAll(`.${config.parentId}-plot .towerplot-rect`)
//         .filter((d, i)=> {  return d.effect == "positive" })
//         .style("fill", scrollUtils.greyToRed(1))

//     d3.selectAll(`.${config.parentId}-plot .towerplot-rect`)
//         .filter((d, i)=> {  return d.effect == "negative" })
//         .style("fill", scrollUtils.greyToTeal(scrollProgress))    
// }

// function fadeNeutralUnit(config, scrollProgress){
//     if (!scrollProgress){
//         scrollProgress = 1
//     }
//     const plots = d3.selectAll(`.${config.parentId}-plot .towerplot-rect`)
//     plots
//         .filter((d)=> { return d.effect == "neutral"  })
//         .style("fill", scrollUtils.lightToFadeGrey(scrollProgress))  
// }

// function highlightMagnitude(config){
//     const plots = d3.selectAll(`.${config.parentId}-plot .towerplot-rect`)
//     let opacity = d3.scaleLinear().domain([0,1]).range([0.2, 1])
//     plots
//         .filter((d)=> { 
//             return d.effect != "neutral"  
//         })
//         .attr("opacity", function(d){ 
//             return opacity(d.effect_size) 
//         })
//     plots
//         .filter((d)=> { return d.effect == "neutral"  })
//         .attr("opacity", .2)   
//   }


function createPopulationLabels(config){
    const plot = d3.select(`#${config.rootId}-${config.parentId}`)
    plot.selectAll(`.${config.parentId}-label`).remove()
    plot.append("text").html(labels[0])
            .attr("class", `plot-title ${config.parentId}-label`)
            .attr("text-anchor", `middle`)
            .attr("transform", `translate(${(config.width / 4) }, 0)`)
            .style("opacity", 0)

            plot.append("text").html(labels[1])
            .attr("class", `plot-title ${config.parentId}-label`)
            .attr("text-anchor", `middle`)
            .attr("transform", `translate(${(config.width / 4) + ((config.width - config.padding.left - config.padding.right) / 2)}, 0)`)    
            .style("opacity", 0)
}





export {
    init
}