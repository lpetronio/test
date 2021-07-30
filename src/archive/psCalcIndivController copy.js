import * as d3 from "d3"; 
import * as Configuration from "../models/Config";
import * as Lattice from "../Lattice";
import * as Grid from "../Figures";
import * as TowerPlot from "../plots/TowerPlot";
import * as GradientPlot from "../plots/GradientPlot";
import * as figures from "../utils/figures"
import * as scrollUtils from "../utils/scrollUtils";
import * as colorUtils from "../utils/colors"
import * as testUtils from "../utils/test-utils";

const ConfigFiguresPop = {
    rootId: "plot-wrapper",
    parentId: "pscalcpopplotfigures",
    type: "figureplot",
    elementId: "node", // path
    width: d3.select("#plot-wrapper").node().clientWidth,
    height: d3.select("#plot-wrapper").node().clientHeight * .7,
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
        columns: undefined
    },
    padding: {top:0, right: 60, bottom:100, left: 0}
};


const ConfigTowerPop = {
    rootId: "plot-wrapper",
    parentId: "pscalcpopplot",
    type:"towerplot-pair",
    width: d3.select("#plot-wrapper").node().clientWidth,
   // height: d3.select("#plot-wrapper").node().clientHeight, 
    height: d3.select("#plot-wrapper").node().clientHeight  * .7,
    grid:{ // i dont want this. handle length of data separately from layout so you can make grid based on total
        rows:1,
        columns: undefined
    },
    plotConfigs: {
        positions: 100,
        padding: {  top: 0, 
                    right: 0, 
                    bottom:0, 
                    left: 0
                }, 
        type:"towerplot-pair", // change to "pairplot" for simplicity. again, make columns based on that
        scroll: {
            prog: 0,
            counter: 0,
            speed: 0.2
        }
    },
    padding: {top:10, right: 20, bottom: 20, left:40}

};

const ConfigTower = {
    rootId: "plot-wrapper",
    parentId: "pscalcplot",
    type:"towerplot-pair",
    width: d3.select("#plot-wrapper").node().clientWidth,
   // height: d3.select("#plot-wrapper").node().clientHeight, 
    height: d3.select("#plot-wrapper").node().clientHeight  * .7,
    grid:{ // i dont want this. handle length of data separately from layout so you can make grid based on total
        rows:1,
        columns: 1
    },
    plotConfigs: {
        positions: 60,
        padding: {  top: 0, 
                    right: 0, 
                    bottom:0, 
                    left: 0
                }, 
        type:"towerplot-pair", // change to "pairplot" for simplicity. again, make columns based on that
        scroll: {
            prog: 0,
            counter: 0,
            speed: 0.2
        }
    },
    padding: {top:0, right: d3.select("#plot-wrapper").node().clientWidth*.3, bottom:20, left: d3.select("#plot-wrapper").node().clientWidth*.4}

};
const ConfigFigures = {
    rootId: "plot-wrapper",
    parentId: "pscalcplotfigures",
    type: "figureplot",
    elementId: "node", // path
    width: d3.select("#plot-wrapper").node().clientWidth,
    height: d3.select("#plot-wrapper").node().clientHeight * .7,
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
        columns: 1
    },
    padding: {top:0, right: 20, bottom:100, left: d3.select("#plot-wrapper").node().clientWidth*.4}
};


const ConfigGradient = {
    rootId: "plot-wrapper",
    parentId: "pscalcplotgradient",
    type: "gradientplot",
    width: d3.select("#plot-wrapper").node().clientWidth,
    // height: 200,
    height: d3.select("#plot-wrapper").node().clientHeight * .25,
    // height: d3.select("#plot-wrapper").node().clientHeight,
    scroll: {
        prog: 0,
        counter: 0,
        speed: 0.2
    },
    padding: {top:100, right: 60, bottom: 20, left:0}
};




function init(configTower = ConfigTower, configTowerPop = ConfigTowerPop, configFigures = ConfigFigures, configFiguresPop = ConfigFiguresPop, configGradient = ConfigGradient, data, gradientData, verbose = testUtils.verbose){

    var tData = Array.from(data).filter((n, i) => n.percentile == 51);
    var tpData = Array.from(data).filter(function(n, i){ 
        return n.percentile != 51 && (n.percentile > 23 && n.percentile < 90) || (n.percentile > 9 && n.percentile < 20) 
    })
    tpData = tpData.filter((n, i) => i % 5 === 0);

    configTowerPop.grid.columns = tpData.length;
    configFiguresPop.grid.columns = tpData.length;

    // var configFiguresDist = configFiguresPop;
    // configFiguresDist.rows = 10;

    const tConfig = Configuration.makeTowerData(configTower, tData)
    const fConfig = Configuration.makeFigureData(configFigures, gradientData)


    const tpConfig = Configuration.makeTowerData(configTowerPop, tpData)
    const fpConfig = Configuration.makeFigureData(configFiguresPop, gradientData)

  //  const fdConfig = Configuration.makeFigureData(configFiguresDist, gradientData)


    configGradient.data = gradientData;
    configGradient.top = tConfig.height + configGradient.padding.top;
    const gConfig = configGradient;


    Lattice.render(tConfig, undefined);
    d3.selectAll(`.${tConfig.parentId}-plot`).attr("opacity", 0)  
    scrollUtils.highlightMagnitude(tConfig)

    Lattice.render(tpConfig, undefined);
    d3.selectAll(`.${tpConfig.parentId}-plot`).attr("opacity", 0)  
    scrollUtils.highlightMagnitude(tpConfig)



    Grid.render(fConfig, undefined);
    d3.select(`#${fConfig.rootId}-${fConfig.parentId}`).attr("opacity",0)  


    Grid.render(fpConfig, undefined);
    d3.select(`#${fpConfig.rootId}-${fpConfig.parentId}`).attr("opacity",0)  
    
   GradientPlot.render(gConfig, true)
   d3.select(`#${gConfig.rootId}-${gConfig.parentId}`).attr("opacity",0)  
  // d3.selectAll(`.${gConfig.parentId}-plot`).attr("opacity", 0)  

    scrollController(tConfig, fConfig, gConfig, tpConfig, fpConfig)

}

function scrollController(tConfig, fConfig, gConfig, tpConfig, fpConfig){


    // ###################################### this will be a grid-plot
    var enter = scrollUtils.createScene("pscalc-individual-pair", "sectionScene")
    
    enter.on('enter', function(e){
        fConfig.grid.columns = 1;
        Grid.render(fConfig, undefined);
    })
    .on("progress", function(e){

        if (e.scrollDirection == "FORWARD"){
            if (e.progress >= 0.8){
                tConfig.type = "towerplot-stack";
                tConfig.plotConfigs = Configuration.updateTowerData(tConfig, tConfig.data);
                Lattice.render(tConfig, undefined);
            } else {
                tConfig.type = "towerplot-pair";
                tConfig.plotConfigs = Configuration.updateTowerData(tConfig, tConfig.data);
                Lattice.render(tConfig, undefined);
            }
       } else if (e.scrollDirection == "REVERSE") {
           if (e.progress <= 0.8){
            tConfig.type = "towerplot-pair";
            tConfig.plotConfigs = Configuration.updateTowerData(tConfig, tConfig.data);
            Lattice.render(tConfig, undefined);
           }
       }

        scrollUtils.highlightMagnitude(tConfig)

        d3.select(`#${fConfig.rootId}-${fConfig.parentId}`).attr("opacity", scrollUtils.fadeIn(e.progress))  
        d3.selectAll(`.${tConfig.parentId}-plot`).attr("opacity", scrollUtils.fadeIn(e.progress))  
    })
    .addTo(scrollUtils.controller);  


    var progress = scrollUtils.createScene("pscalc-individual-stack", "subsectionScene")
    progress.on('enter', function(e){

        // fConfig.padding.left = marginLeft;
        // fConfig.grid.columns = 1;
        // Grid.render(fConfig, undefined);

        // tConfig.type = "towerplot-stack";
        // tConfig.plotConfigs = Configuration.updateTowerData(tConfig, tConfig.data);
        // Lattice.render(tConfig, undefined);

    })
    .on("progress", function(e){
        d3.select(`#${gConfig.rootId}-${gConfig.parentId}`).attr("opacity", scrollUtils.fadeIn(e.progress))  
        d3.select(`#ps-flag-individual`).style("opacity", scrollUtils.fadeIn(e.progress))
        d3.select(`#riskgradient-triangle-50`).style("opacity", scrollUtils.fadeIn(e.progress))
    })
    .addTo(scrollUtils.controller);  


    var leaveIndv = scrollUtils.createScene("leave-pscalc-individual", "subsectionScene")
    leaveIndv.on("progress", function(e){
        d3.select(`#${fConfig.rootId}-${fConfig.parentId}`).attr("opacity", scrollUtils.fadeOut(e.progress))  
        d3.selectAll(`.${tConfig.parentId}-plot`).attr("opacity", scrollUtils.fadeOut(e.progress))  
        d3.select(`#${gConfig.rootId}-${gConfig.parentId}`).attr("opacity", scrollUtils.fadeOut(e.progress))  
        d3.select(`#ps-flag-individual`).style("opacity", scrollUtils.fadeOut(e.progress))
        d3.select(`#riskgradient-triangle-50`).style("opacity", scrollUtils.fadeOut(e.progress))
    })
    .addTo(scrollUtils.controller);  


    var population = scrollUtils.createScene("pscalc-population-pair")
    population.on('enter', function(e){
        // tpConfig.type = "towerplot-pair";
        // tpConfig.plotConfigs = Configuration.updateTowerData(tpConfig, tpConfig.data);
        // Lattice.render(tpConfig, undefined);
        // scrollUtils.highlightMagnitude(tpConfig)

        fpConfig.grid.columns = tpConfig.grid.columns;
        Grid.render(fConfig, undefined);
    })
    .on("progress", function(e){

        if (e.scrollDirection == "FORWARD"){
            if (e.progress >= 0.8){
                tpConfig.type = "towerplot-stack";
                tpConfig.plotConfigs = Configuration.updateTowerData(tpConfig, tpConfig.data);
                Lattice.render(tpConfig, undefined);
            } else {
                tpConfig.type = "towerplot-pair";
                tpConfig.plotConfigs = Configuration.updateTowerData(tpConfig, tpConfig.data);
                Lattice.render(tpConfig, undefined);
            }
       } else if (e.scrollDirection == "REVERSE") {
           if (e.progress <= 0.6){
            tpConfig.type = "towerplot-pair";
            tpConfig.plotConfigs = Configuration.updateTowerData(tpConfig, tpConfig.data);
            Lattice.render(tpConfig, undefined);
           }
       }

        scrollUtils.highlightMagnitude(tpConfig)

        d3.select(`#${fpConfig.rootId}-${fpConfig.parentId}`).attr("opacity", scrollUtils.fadeIn(e.progress)) 
        d3.selectAll(`.${tpConfig.parentId}-plot`).attr("opacity", scrollUtils.fadeIn(e.progress))
    })
    // .on("progress", function(e){
    //     d3.select(`#${fpConfig.rootId}-${fpConfig.parentId}`).attr("opacity", scrollUtils.fadeIn(e.progress)) 
    //     d3.selectAll(`.${tpConfig.parentId}-plot`).attr("opacity", scrollUtils.fadeIn(e.progress))
    // })
    .addTo(scrollUtils.controller);  



    var populationStack = scrollUtils.createScene("pscalc-population-stack")
    populationStack.on('enter', function(e){

        // tpConfig.type = "towerplot-stack";
        // tpConfig.plotConfigs = Configuration.updateTowerData(tpConfig, tpConfig.data);
        // Lattice.render(tpConfig, undefined);
        // scrollUtils.highlightMagnitude(tpConfig)

    })
    // .on("progress", function(e){
    //      d3.select(`#${gConfig.rootId}-${gConfig.parentId}`).attr("opacity", scrollUtils.fadeIn(e.progress))  
    // })
    .addTo(scrollUtils.controller);  



    var populationFall = scrollUtils.createScene("pscalc-population-fall")
    populationFall.on('enter', function(){
        // fpConfig.grid.rows = 1;
        // Grid.render(fpConfig, undefined);
    })
    .on('progress', function(e){


        d3.select(`#${gConfig.rootId}-${gConfig.parentId}`).attr("opacity", scrollUtils.delayAnimateIn(e.progress))  
        d3.select(`#${tpConfig.rootId}-${tpConfig.parentId}`).attr("opacity", scrollUtils.fadeOut(e.progress))  

        let height = gConfig.top - gConfig.height + gConfig.padding.top;
        const scaleY = d3.scaleLinear()
            .domain(scrollUtils.animationDomain)

        d3.selectAll(`.${fpConfig.parentId}-${fpConfig.elementId}`)
            .attr(`transform`, function(d){
                scaleY.range([d.y, d.y, height, height])
                return `translate(${d.x}, ${scaleY(e.progress)}) scale(${d.size})`
            })

    })
    .addTo(scrollUtils.controller);  


    var populationIncrease = scrollUtils.createScene("pscalc-population-increase")
    populationIncrease.on('progress', function(e){

        let scaleColor = scrollUtils.greyToRed;
        scaleColor.domain(scrollUtils.delayAnimationDomain)

        d3.selectAll(`.${fpConfig.parentId}-${fpConfig.elementId}`)
        .filter(function(figure){
           return figure.column >=10
        })
        .select("path")
        .style("fill", scaleColor(e.progress))

    })
    .addTo(scrollUtils.controller);  


    var populationDecrease = scrollUtils.createScene("pscalc-population-decrease")
    populationDecrease.on('enter', function(e){

    })
    .on("progress", function(e){
        let scaleColor = scrollUtils.greyToTeal;
        scaleColor.domain(scrollUtils.delayAnimationDomain)

    d3.selectAll(`.${fpConfig.parentId}-${fpConfig.elementId}`)
        .filter(function(figure){
           return figure.column <=4
        })
        .select("path")
        .style("fill", scaleColor(e.progress))


        let scaleColorRed = scrollUtils.redToGrey;
      //  scaleColorRed.domain(scrollUtils.delayAnimationDomain)

    d3.selectAll(`.${fpConfig.parentId}-${fpConfig.elementId}`)
        .filter(function(figure){
           return figure.column >= 10
        })
        .select("path")
        .style("fill", scaleColorRed(e.progress))


    })
    .addTo(scrollUtils.controller);  

    var leavePop = scrollUtils.createScene("leave-pscalc-population", "subsectionScene")
    leavePop.on("progress", function(e){
        d3.selectAll(`.${fpConfig.parentId}-${fpConfig.elementId}`).style("opacity", scrollUtils.fadeOut(e.progress))
    })
    .addTo(scrollUtils.controller);  


    var enterInterp = scrollUtils.createScene("psinterp-distribution-average", "subsectionScene")
    enterInterp.addTo(scrollUtils.controller);  

    var interpIncreased = scrollUtils.createScene("psinterp-distribution-increased", "subsectionScene")
    interpIncreased.addTo(scrollUtils.controller);  
    var interpDecreased = scrollUtils.createScene("psinterp-distribution-decreased", "subsectionScene")
    interpDecreased.addTo(scrollUtils.controller);  

    var interpEx = scrollUtils.createScene("psinterp-distribution-example", "subsectionScene")
    interpEx.addTo(scrollUtils.controller);  
    

}





export {
    init
}