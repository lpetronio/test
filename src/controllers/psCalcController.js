import * as d3 from "d3"; 
import * as Configuration from "../models/Config";
import * as Lattice from "../Lattice";
import * as Grid from "../Grid";
import * as PsPlots from "../plots/PsPlots";
import * as scrollUtils from "../utils/scrollUtils";
import * as colorUtils from "../utils/colors";
import * as testUtils from "../utils/test-utils";
import * as sizeUtils from "../utils/sizeUtils";

const ConfigFiguresPop = {
    rootId: "ps-plot-wrapper",
    parentId: "pscalcpopplotfigures",
    type: "figureplot",
    elementId: "node", // path
    width: d3.selectAll(".plot-wrapper").node().clientWidth,
    height: d3.selectAll(".plot-wrapper").node().clientHeight * .5,
    color: {
        type: "single",
        fill: true
    },
    plotConfigs: {
        src: "",
        padding: {  
            top: 0, 
            right: 7, 
            bottom:0, 
            left: 7
        }, 
        grid:{ // will change depending on stack or pair
            rows: 1, 
            columns: undefined
        },
        scroll: {
            prog: 0,
            counter: 0,
            speed: 0.2
        }
    },
    grid:{
        rows:1,
        columns: 25
    },
    padding: {top:20, right: 0, bottom: 20, left:0}
};


const ConfigTowerPop = {
    rootId: "ps-plot-wrapper",
    parentId: "pscalcpopplot",
    type:"population",
    width: d3.selectAll(".plot-wrapper").node().clientWidth,
    height: d3.selectAll(".plot-wrapper").node().clientHeight  * .5,
    grid:{
        rows:1,
        columns: 25
    },
    plotConfigs: {
        positions: 80,
        padding: {  top: 0, 
                    right: 7, 
                    bottom:0, 
                    left: 7
                }, 
        type:"towerplot-pair",
        grid:{ // will change depending on stack or pair
            rows: undefined, 
            columns: 2
        },
        scale:{x: "", y:"", color:"" },
        colorType: "greyRedTeal",
        opacityType: "effectSize",
        scroll: {
            prog: 0,
            counter: 0,
            speed: 0.2
        }
    },
    padding: {top:0, right: 0, bottom: 20, left:0}

};

const ConfigTower = {
    rootId: "ps-plot-wrapper",
    parentId: "pscalcplot",
    type:"single",
    width: d3.selectAll(".plot-wrapper").node().clientWidth,
    height: d3.selectAll(".plot-wrapper").node().clientHeight  * .75,
    grid:{ 
        rows:1,
        columns: 7
    },
    plotConfigs: {
        positions: 80,
        padding: {  top: 0, 
                    right: 0, 
                    bottom:120, 
                    left: 0
                }, 
        type:"towerplot-pair",
        grid:{ 
            rows: undefined, 
            columns: 2
        },
        scale:{x: "", y:"", color:"" },
        colorType: "greyRedTeal",
        opacityType: "effectSize",
        scroll: {
            prog: 0,
            counter: 0,
            speed: 0.2
        }
    },
    padding: {top:0, right: 0, bottom: 20, left:0}

};

const ConfigFigures = {
    rootId: "ps-plot-wrapper",
    parentId: "pscalcplotfigures",
    type: "figureplot",
    elementId: "node", 
    width: d3.selectAll(".plot-wrapper").node().clientWidth,
    height: d3.selectAll(".plot-wrapper").node().clientHeight * .75,
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
        columns: 7
    },
   // padding: {top:0, right: 20, bottom:100, left: d3.select("#plot-wrapper").node().clientWidth*.4}
    padding: {top:0, 
        right: d3.selectAll(".plot-wrapper").node().clientWidth*.35, 
        bottom:120, 
        left: d3.selectAll(".plot-wrapper").node().clientWidth*.425}
    
};


const ConfigPsPlots = {
    rootId: "ps-plot-wrapper",
    parentId: "psplot",
    width: d3.selectAll(".plot-wrapper").node().clientWidth,
    height: d3.selectAll(".plot-wrapper").node().clientHeight,
    scroll: {
        prog: 0,
        counter: 0,
        speed: 0.2
    },
    padding: {
         top:50, 
         right: 0,
         bottom: 150, 
         left: 0
        }
    
};




function init(  tConfig = ConfigTower, 
                tpConfig = ConfigTowerPop, 
                fConfig = ConfigFigures, 
                fpConfig = ConfigFiguresPop, 
                configPsPlots = ConfigPsPlots, 
                data, 
                verbose = testUtils.verbose){

  //  var tData = Array.from(data).filter((n, i) => n.percentile >= 47 && n.percentile <=53); // 7
   // var tpData = Array.from(data).filter((n, i) => i % 4 === 0);

 //   let percentiles = tpData.map(function(d){ return d.percentile})
  //  let percentiles = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96]; // 25
    // 8, 13, 18


    // tConfig.grid.columns = tData.length;
    // tpConfig.grid.columns = tpData.length;

    PsPlots.render(configPsPlots, data)

  //  Lattice.render(tConfig, tData, undefined);
   // Grid.render(fConfig, undefined);

   // Lattice.render(tpConfig, tpData, undefined);
  //  d3.select(`#${tpConfig.rootId}-${tpConfig.parentId}`).attr("opacity", 0)  

  //  Grid.render(fpConfig, undefined);
 //   d3.select(`#${fpConfig.rootId}-${fpConfig.parentId}`).attr("opacity",0)  
    

  //  scrollController(tConfig, fConfig, tpConfig, fpConfig, tData, tpData)

}

function scrollController(tConfig, fConfig, tpConfig, fpConfig, tData, tpData){


    // ###################################### this will be a grid-plot
    var enter = scrollUtils.createScene("pscalc-individual-pair", "sectionScene")
    
    enter.on('enter', function(e){

        // tConfig.plotConfigs.type = "towerplot-pair";
        // Lattice.render(tConfig, tData, undefined);

        // fConfig.grid.columns = 1;
        // Grid.render(fConfig, undefined);
    })
    .addTo(scrollUtils.controller);  


    var stack = scrollUtils.createScene("pscalc-individual-stack", "subsectionScene")
    stack.on('enter', function(e){
        // tConfig.plotConfigs.type = "towerplot-stack";
        // Lattice.render(tConfig, tData, undefined);
    })
    .on("progress", function(e){

        d3.select(`#ps-flag`).style("opacity", scrollUtils.fadeInFadeOut(e.progress))
        d3.select(`#gradientplot-triangle-50`).style("opacity", scrollUtils.fadeInFadeOut(e.progress))
        d3.selectAll(".gradientplot-tick").attr("opacity", scrollUtils.fadeInFadeOut(e.progress)) 
        d3.selectAll(".gradientplot-label-riskbin").attr("opacity", scrollUtils.fadeInFadeOut(e.progress)) 
        d3.select(`#psplot-gradientplot`).attr("opacity", scrollUtils.fadeInFadeOut(e.progress))  

        d3.select(`#${fConfig.rootId}-${fConfig.parentId}`).attr("opacity", scrollUtils.fadeOut(e.progress))  
        d3.select(`#${tConfig.rootId}-${tConfig.parentId}`).attr("opacity", scrollUtils.fadeOut(e.progress))  

    })
    .on('leave', function(e){
        d3.select(`#psplot-plot-0-3`).select("path").remove()
    })
    .addTo(scrollUtils.controller);  



    var population = scrollUtils.createScene("pscalc-population-pair")
    population
        .on('enter', function(e){
            tpConfig.plotConfigs.type = "towerplot-pair";
            Lattice.render(tpConfig, tpData, undefined);

            fpConfig.grid.columns = tpConfig.grid.columns;
            Grid.render(fpConfig, undefined);

        })
        .on("progress", function(e){
            d3.select(`#${fpConfig.rootId}-${fpConfig.parentId}`).attr("opacity", scrollUtils.fadeIn(e.progress)) 
            d3.select(`#${tpConfig.rootId}-${tpConfig.parentId}`).attr("opacity", scrollUtils.fadeIn(e.progress)) 

        })
        .addTo(scrollUtils.controller);  


    var populationStack = scrollUtils.createScene("pscalc-population-stack")
    populationStack
        .on('enter', function(e){
            tpConfig.plotConfigs.type = "towerplot-stack";
            Lattice.render(tpConfig, tpData, undefined);
        })
        .on('progress', function(e){
            // these labels should not be attached to fpConfig, but the rootSvg
            d3.selectAll(`.${fpConfig.parentId}-label`).attr("opacity", scrollUtils.animateIn(e.progress))  
        })
        .addTo(scrollUtils.controller);  


    var populationAverage = scrollUtils.createScene("pscalc-population-average")
    populationAverage
        .on('progress', function(e){

            d3.select(`#psplot-gradientplot`).attr("opacity", scrollUtils.animateIn(e.progress))  
            d3.select("#gradientplot-label-riskbin-average").attr("opacity", scrollUtils.delayAnimateIn(e.progress)) 

            animateAverage(fpConfig, e.progress)
        })
        .addTo(scrollUtils.controller);  


    var populationIncrease = scrollUtils.createScene("pscalc-population-increase")
    populationIncrease
        .on('enter', function(e){
            // animateAverage(fpConfig, 1) // incase it missed prev step
        })
        .on('progress', function(e){
            animateAverage(fpConfig, 1) // incase it missed prev step
            d3.select("#gradientplot-label-riskbin-increased").attr("opacity", scrollUtils.delayAnimateIn(e.progress)) 
            animateIncrease(fpConfig, e.progress)
        })
        .addTo(scrollUtils.controller);  


    var populationDecrease = scrollUtils.createScene("pscalc-population-decrease")
    populationDecrease
        .on('enter', function(e){
            // animateAverage(fpConfig, 1)
            // animateIncrease(fpConfig, 1) // incase it missed prev step
        })
        .on("progress", function(e){
            animateAverage(fpConfig, 1)
            animateIncrease(fpConfig, 1) // incase it missed prev step

            d3.select("#gradientplot-label-riskbin-decreased").attr("opacity", scrollUtils.animateIn(e.progress)) 
            animateDecrease(fpConfig, e.progress)
        
            d3.selectAll(`.${fpConfig.parentId}-label`).attr("opacity", scrollUtils.fadeOut(e.progress))  
            d3.select(`#${tpConfig.rootId}-${tpConfig.parentId}`).attr("opacity", scrollUtils.fadeOut(e.progress)) 
            d3.select(`#${fpConfig.rootId}-${fpConfig.parentId}`).attr("opacity", scrollUtils.fadeOut(e.progress)) 
        })
        .addTo(scrollUtils.controller);  

    // var leavePop = scrollUtils.createScene("leave-pscalc-population", "subsectionScene")
    // leavePop.on('enter', function(e){

    // }).on("progress", function(e){
    //     d3.selectAll(`.${fpConfig.parentId}-label`).attr("opacity", scrollUtils.fadeOut(e.progress))  
    //     d3.select(`#${tpConfig.rootId}-${tpConfig.parentId}`).attr("opacity", scrollUtils.fadeOut(e.progress)) 
    //     d3.select(`#${fpConfig.rootId}-${fpConfig.parentId}`).attr("opacity", scrollUtils.fadeOut(e.progress)) 
    // })
    // .addTo(scrollUtils.controller);  

    

}

function animateAverage(fpConfig, progress){

    let padding = d3.select("#psplot-gradientplot").node().clientHeight;
    let height = fpConfig.height - padding;
    let scaleY = d3.scaleLinear().domain(scrollUtils.animationDomain)

    d3.selectAll(`.${fpConfig.parentId}-${fpConfig.elementId}`)
    .filter(function(figure){
        return figure.column >=5 && figure.column < 10
     })
    .attr(`transform`, function(d){
        scaleY.range([d.y, d.y, height, height])
        // return `translate(${d.x}, ${scaleY(progress)}) scale(${d.size})`
        return `translate(${d.x}, ${scaleY(progress)})`
    })
}

function animateDecrease(fpConfig, progress){

    let padding = d3.select("#psplot-gradientplot").node().clientHeight;
    let scaleColor = scrollUtils.greyToTeal;
    scaleColor.domain(scrollUtils.delayAnimationDomain)

    let height = fpConfig.height - padding;
    let scaleY = d3.scaleLinear().domain(scrollUtils.animationDomain)

    d3.selectAll(`.${fpConfig.parentId}-${fpConfig.elementId}`)
    .filter(function(figure){
       return figure.column <=4
    })
    .attr(`transform`, function(d){
        scaleY.range([d.y, d.y, height, height])
        // return `translate(${d.x}, ${scaleY(progress)}) scale(${d.size})`
        return `translate(${d.x}, ${scaleY(progress)})`
    })
    .select("path")
    .style("fill", scaleColor(progress))
}


function animateIncrease(fpConfig, progress){

    let padding = d3.select("#psplot-gradientplot").node().clientHeight;

    let scaleColor = scrollUtils.greyToRed;
    scaleColor.domain(scrollUtils.delayAnimationDomain)

    let height = fpConfig.height - padding;
    const scaleY = d3.scaleLinear().domain(scrollUtils.animationDomain)

    d3.selectAll(`.${fpConfig.parentId}-${fpConfig.elementId}`)
    .filter(function(figure){
        return figure.column >=10
     })
    .attr(`transform`, function(d){
        scaleY.range([d.y, d.y, height, height])
        // return `translate(${d.x}, ${scaleY(progress)}) scale(${d.size})`
        return `translate(${d.x}, ${scaleY(progress)})`
    })
    .select("path")
    .style("fill", scaleColor(progress))


}


export {
    init
}