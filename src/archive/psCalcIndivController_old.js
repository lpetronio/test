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

const ConfigTower = {
    rootId: "plot-wrapper",
    parentId: "pscalcplot",
    width: d3.select("#plot-wrapper").node().clientWidth,
    height: d3.select("#plot-wrapper").node().clientHeight,
    grid:{ // i dont want this. handle length of data separately from layout so you can make grid based on total
        rows:1,
        columns: 1
    },
    type:"towerplot-pair",
    plotConfigs: {
        positions: 100,
        padding: {  top: 0, 
                    right: 0, 
                    bottom:0, 
                    left: 100
                }, 
        type:"towerplot-pair", // change to "pairplot" for simplicity. again, make columns based on that
        scroll: {
            prog: 0,
            counter: 0,
            speed: 0.2
        }
    },
    padding: {top:20, right: 20, bottom:300, left:20}

};
const ConfigFigures = {
    rootId: "plot-wrapper",
    parentId: "pscalcplotfigures",
    elementId: "node",
    width: d3.select("#plot-wrapper").node().clientWidth,
    height: d3.select("#plot-wrapper").node().clientHeight,
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
    padding: {top:20, right: 20, bottom:300, left:20}
};
const ConfigGradient = {
    rootId: "plot-wrapper",
    parentId: "pscalcplotgradient",
    elementId: "node",
    width: d3.select("#plot-wrapper").node().clientWidth,
    height: d3.select("#plot-wrapper").node().clientHeight,
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
    padding: {top:20, right: 20, bottom:300, left:20}
};

function init(configTower = ConfigTower, configFigures = ConfigFigures, configGradient = ConfigGradient, data, gradientData, verbose = testUtils.verbose){

    const tConfig = Configuration.makeTowerData(configTower, data)
    const fConfig = Configuration.makeFigureData(configFigures, data)

console.log(configGradient)

    scrollController(tConfig, fConfig)

}

function scrollController(config, fConfig){

    // ###################################### this will be a grid-plot
    var enter = scrollUtils.createScene("pscalc-individual-pair", "sectionScene")
    
    enter.on('enter', function(e){
        config.type = "towerplot-pair";
        // let tpData = TowerPlot.updateData(config, config.data.map(function(d){ return d})) 
        config.plotConfigs = Configuration.updateTowerData(config, config.data);
        Lattice.render(config, undefined);

    })
    .on("progress", function(e){
        d3.selectAll(".pscalcplot-plot").attr("opacity", scrollUtils.fadeIn(e.progress))  
    })
    .addTo(scrollUtils.controller);  


    var scene2 = scrollUtils.createScene("pscalc-individual-stack", "subsectionScene")
    scene2.on('enter', function(e){
        config.type = "towerplot-stack";
       // let tpData = TowerPlot.updateData(config, config.data.map(function(d){ return d})) 
       config.plotConfigs = Configuration.updateTowerData(config, config.data);
       // config.plotConfigs = tpData;
        Lattice.render(config, undefined);
    })
    .on("progress", function(e){
        // d3.select(`#${config.domId}-gradientplot`).style("opacity", scrollUtils.opacityScrollScaleEnd(e.progress))
        // d3.select(`#ps-flag-individual`).style("opacity", scrollUtils.opacityScrollScaleEnd(e.progress))
        // d3.select(`#riskgradient-triangle-50`).style("opacity", scrollUtils.opacityScrollScaleEnd(e.progress))
    })
    .addTo(scrollUtils.controller);  


    // var scene3 = scrollUtils.createScene("pscalc-pop-pair")
    // scene3.on('enter', function(e){
    //     config.type = "towerplot-pair";
    //     let tpData = TowerPlot.updateData(config, config.data.map(function(d){ return d})) 
    //     config.plotConfigs = tpData;
    //     Lattice.render(config, undefined);
    // })
    // .on("progress", function(e){

    // })
    // .addTo(scrollUtils.controller);  


    

}





export {
    init
}