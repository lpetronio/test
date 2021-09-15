
import * as d3 from "d3";
import * as randomPts from "../utils/pt-random";
import * as testUtils from "../utils/test-utils";
import * as AreaPlot from "./AreaPlot"
import * as SuperLattice from "../SuperLattice";
import * as Flag from "./psFlag"
import * as GradientPlot from "./GradientPlot"
import * as BinPlot from "./BinPlot"
import * as scrollUtils from "../utils/scrollUtils";
import * as colorUtils from "../utils/colors";
import * as sizeUtils from "../utils/sizeUtils";



let lgpaddingtop, smpaddingtop, gradientheight, gradientTop, gradientBottom, labels, flagLabel5, flagLabel95, flagLabel50;

if (scrollUtils.windowWidth >=800){
    gradientheight = 150;
    gradientTop = 0;
    gradientBottom = 40;

    lgpaddingtop = gradientheight * 2.5;
    smpaddingtop = gradientheight * 1.5;
} else {
    gradientheight = 120;
    gradientTop = 0;
    gradientBottom = 30;

    lgpaddingtop = gradientheight * 1;
    smpaddingtop = gradientheight * .9;
}


var ConfigPsPlots = {
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
         top:0, 
         right: 0,
        //  bottom: gradientheight, 
        bottom:0,
         left: 0
        }
    
};

var ConfigGradient = {
    rootId: "psplot-wrapper",
    parentId: "psplot",
    type: "gradientplot",
    width: d3.selectAll(".plot-wrapper").node().clientWidth,
    height: gradientheight,
    padding: {
        top:gradientTop, 
        right: 0, 
        bottom: gradientBottom, 
        left: 0
    }
};

var ConfigDistribution = {
    rootId: "psplot-wrapper", 
    parentId: "psplot",
    type: "grid",
    color: "grey",
    width: d3.selectAll(".plot-wrapper").node().clientWidth,
    height: d3.selectAll(".plot-wrapper").node().clientHeight - (ConfigGradient.height/2),
    padding: {
         top:smpaddingtop,
         right: 0,
         bottom: gradientBottom + 40, 
         left: 0
        },
        bins: 25,
        size:{
            width: 20,
            height:40
        } 
};

var ConfigTower = {
    rootId: "psplot-wrapper",
    parentId: "psplot",
    type:"lattice",
    sceneId: "psplot-individual",
    width: d3.selectAll(".plot-wrapper").node().clientWidth,
    height: d3.selectAll(".plot-wrapper").node().clientHeight  * .5,
    grid:{
        rows:1,
        columns: 7
    },
    plotConfigs: {
        positions: 80,
        padding: {  top: 0, 
                    right: 0, 
                    bottom:10, 
                    left: 0
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
    padding: {top:0, right: 0, bottom: 0, left:0} // bottom is height of path figure

};


function render(config = ConfigPsPlots, tdata, tconfig = ConfigTower, dconfig = ConfigDistribution, gconfig = ConfigGradient, language, verbose = testUtils.verbose){

    if (language == "espanol"){
        flagLabel5 = ["menor riesgo", "Usted está en el", "percentil 5", "de la puntuación poligénica con", "menor riesgo", "genético"];
        flagLabel50 = ["promedio", "Usted está en el", "percentil 50", "de la puntuación poligénica con", "promedio riesgo", "genético"];
        flagLabel95 = ["mayor riesgo", "Usted está en el", "percentil 95", "de la puntuación poligénica con", "mayor riesgo", "genético"];

        labels = ["&#8592; puntuación más baja", "puntuación más alta &#8594;", "riesgo promedio", "menor riesgo", "mayor riesgo",  "percentil", "La mayoría de las personas", "promedio"];
    } else if (language == "english"){
        labels = ["&#8592; lower score", "higher score &#8594;", "average risk", "decreased risk", "increased risk", "percentile", "Most people", "Average"];

        flagLabel5 = ["significantly decreased", "You are in the", "5th percentile", "of the polygenic score with", "significantly decreased", "genetic risk"];
        flagLabel50 = ["average", "You are in the", "50th percentile", "of the polygenic score with", "average", "genetic risk"];
        flagLabel95 = ["significantly increased", "You are in the", "95th percentile", "of the polygenic score with", "significantly increased", "genetic risk"];
    }

    updateConfig(config)
    updateConfig(gconfig)
    updateConfig(dconfig)


    const rootIdentifier = "svg";
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

    var distData = randomPts.createNormalDistPoints(2000).filter(function(d){ return d.q <=2.4 && d.q >=-2.4})
    let qscale = d3.scaleLinear().range([0, config.innerWidth]).domain(d3.extent(distData, function(d){ return d.q}))

    let towerSvg = svg.append("g")
        .attr("id", `${tconfig.parentId}-towerplot`)
        .attr("transform", `translate(${0},${0})`)

    let areaSvg = svg.append("g")
        .attr("id", `${dconfig.parentId}-areaplot`)
        .attr("transform", `translate(${0},${0})`)

    let binSvg = svg.append("g")
        .attr("id", `${dconfig.parentId}-binplot`)
        .attr("transform", `translate(${0},${0})`)

    let gradientSvg = svg.append("g")
        .attr("id", `${gconfig.parentId}-gradientplot`)
        // .attr("transform", `translate(${0},${dconfig.height})`)
        .attr("transform", `translate(${0},${(config.height - (gconfig.height))})`)
    
    // labels    
    svg.append("text")
        .html(labels[0])
        .attr("class", `plot-label ${config.parentId}-label`)
        .attr("text-anchor", `start`)
        .attr("x", 0)
         .attr("y", 0 - sizeUtils.dyLg)
        .attr("opacity", 0)

    svg.append("text")
        .html(labels[1])
        .attr("class", `plot-label ${config.parentId}-label`)
        .attr("text-anchor", `end`)
        .attr("x", config.innerWidth)
        .attr("y", 0 - sizeUtils.dyLg)
        .attr("opacity", 0)


    AreaPlot.render(dconfig, areaSvg, distData, [labels[7]])
    console.log(labels)
    GradientPlot.render(gconfig, gradientSvg, distData, [labels[2], labels[3], labels[4], labels[5]])


    d3.select(`#${gconfig.parentId}-gradientplot`).attr("opacity", 0) 
    d3.select(`#${dconfig.parentId}-areaplot`).attr("opacity", 0) 
    
   

   Flag.render(config, svg, qscale(0) + 100, 0, flagLabel50) // takes place on a scene irrelevant to here

    scrollController(config, tconfig, gconfig, dconfig, svg, towerSvg, gradientSvg, binSvg, qscale, tdata, distData)

}


function scrollController(config, tconfig, gconfig, dconfig, svg, towerSvg, gradientSvg, binSvg, qscale, tdata, distData){

    // ###################################### this will be a grid-plot
    var enter = scrollUtils.createScene("pscalc-individual-pair", "sectionScene")
    
    enter.on('enter', function(e){

        d3.select(`#psplot-plot-0-3`).select("path").remove()

        tconfig.grid.columns = 7;
        tconfig.sceneId =  "psplot-individual";
        tconfig.plotConfigs.type = "towerplot-pair";
        SuperLattice.render(tconfig, towerSvg, tdata, undefined);

    })
    .addTo(scrollUtils.controller);  


    var stack = scrollUtils.createScene("pscalc-individual-stack", "subsectionScene")
    stack.on('enter', function(e){
        
        d3.select(`#psplot-plot-0-3`).select("path").remove()
        tconfig.grid.columns = 7;
        tconfig.sceneId =  "psplot-individual";
        tconfig.plotConfigs.type = "towerplot-stack";
        SuperLattice.render(tconfig, towerSvg, tdata, undefined);
    })
    .on("progress", function(e){

        d3.select(`#ps-flag`).style("opacity", scrollUtils.fadeInFadeOut(e.progress))
        d3.select(`#gradientplot-triangle-50`).style("opacity", scrollUtils.fadeInFadeOut(e.progress))
        d3.selectAll(".gradientplot-tick").attr("opacity", scrollUtils.fadeInFadeOut(e.progress)) 
        d3.selectAll(".gradientplot-label-riskbin").attr("opacity", scrollUtils.fadeInFadeOut(e.progress)) 
        d3.select(`#psplot-gradientplot`).attr("opacity", scrollUtils.fadeInFadeOut(e.progress))  

    })
    .addTo(scrollUtils.controller);  



    var population = scrollUtils.createScene("pscalc-population-pair")
    population
        .on('enter', function(e){
            d3.select(`#psplot-plot-0-3`).select("path").remove()
        //    tconfig.height = d3.selectAll(".plot-wrapper").node().clientHeight  * .5;
            tconfig.grid.columns = 25;
            tconfig.sceneId =  "psplot-population";
            tconfig.plotConfigs.type = "towerplot-pair";
            SuperLattice.render(tconfig,towerSvg, tdata, undefined);

            dconfig.color = "grey";
            BinPlot.render(dconfig, binSvg, distData, labels[6])

        })
        .on("progress", function(e){
            d3.select(`#${dconfig.parentId}-binplot`).attr("opacity", scrollUtils.animateIn(e.progress)) 
        })
        .addTo(scrollUtils.controller);  


    var populationStack = scrollUtils.createScene("pscalc-population-stack")
    populationStack
        .on('enter', function(e){
            tconfig.grid.columns = 25;
            tconfig.sceneId =  "psplot-population";
            tconfig.plotConfigs.type = "towerplot-stack";
            SuperLattice.render(tconfig, towerSvg, tdata, undefined);

            dconfig.padding.top =  lgpaddingtop;
            //= 200; 

            dconfig.type = "grid";
            dconfig.color = "grey";
            dconfig.bins = 25;
            BinPlot.render(dconfig, binSvg, distData, [labels[6]])

        })
        .on('progress', function(e){
            // these labels should not be attached to fpConfig, but the rootSvg
            d3.selectAll(`.${config.parentId}-label`).attr("opacity", scrollUtils.animateIn(e.progress))  
        })
        .addTo(scrollUtils.controller);  


        var populationAverage = scrollUtils.createScene("pscalc-population-average")
        populationAverage
            .on('enter', function(e){
                dconfig.padding.top = lgpaddingtop; 
                dconfig.type = "distribution"
                dconfig.color = "grey"
                BinPlot.render(dconfig, binSvg, distData, [labels[7]])
            })
            .on('progress', function(e){
             //   d3.select(`#${dconfig.parentId}-binplot`).attr("opacity", scrollUtils.fadeIn(e.progress)) 
               
                d3.select(`#psplot-gradientplot`).attr("opacity", scrollUtils.animateIn(e.progress))  
                d3.select("#gradientplot-label-riskbin-average").attr("opacity", scrollUtils.delayAnimateIn(e.progress)) 

             //   animateAverage(fpConfig, e.progress)
            })
            .addTo(scrollUtils.controller);  
    
    
        var populationIncrease = scrollUtils.createScene("pscalc-population-increase")
        populationIncrease
            .on('enter', function(e){
                dconfig.padding.top = lgpaddingtop; 
                dconfig.type = "distribution"
                dconfig.color = "red"
                BinPlot.render(dconfig, binSvg, distData, [labels[6]])
                // animateAverage(fpConfig, 1) // incase it missed prev step
            })
            .on('progress', function(e){
              //  animateAverage(fpConfig, 1) // incase it missed prev step
                d3.select("#gradientplot-label-riskbin-increased").attr("opacity", scrollUtils.delayAnimateIn(e.progress)) 
             //   animateIncrease(fpConfig, e.progress)
            })
            .addTo(scrollUtils.controller);  
    
    
        var populationDecrease = scrollUtils.createScene("pscalc-population-decrease")
        populationDecrease
            .on('enter', function(e){
                dconfig.padding.top = lgpaddingtop; 
                 dconfig.bins = 25;
                dconfig.type = "distribution"
                dconfig.color = "redteal"
                BinPlot.render(dconfig, binSvg, distData,[labels[6]])
                // animateAverage(fpConfig, 1)
                // animateIncrease(fpConfig, 1) // incase it missed prev step
            })
            .on("progress", function(e){
               // animateAverage(fpConfig, 1)
               // animateIncrease(fpConfig, 1) // incase it missed prev step
    
                svg.select("#gradientplot-label-riskbin-decreased").attr("opacity", scrollUtils.animateIn(e.progress)) 
             //   animateDecrease(fpConfig, e.progress)
            
                svg.selectAll(`.${config.parentId}-label`).attr("opacity", scrollUtils.fadeOut(e.progress))  
                d3.select(`#${tconfig.parentId}-towerplot`).attr("opacity", scrollUtils.fadeOut(e.progress)) 
                // d3.select(`#${tpConfig.rootId}-${tpConfig.parentId}`).attr("opacity", scrollUtils.fadeOut(e.progress)) 
                // d3.select(`#${fpConfig.rootId}-${fpConfig.parentId}`).attr("opacity", scrollUtils.fadeOut(e.progress)) 
            })

            .addTo(scrollUtils.controller);  







    var enterInterp = scrollUtils.createScene("psinterp-distribution-average", "subsectionScene")
    enterInterp
    .on('enter', function(e){
    // d3.select(`#${tconfig.parentId}-towerplot`).attr("opacity", scrollUtils.fadeOut(e.progress)) 

        dconfig.padding.top = smpaddingtop; 
        dconfig.bins = 40;
        dconfig.type = "distribution"
        dconfig.color = "redteal"
        BinPlot.render(dconfig, binSvg, distData, [labels[6]])
       
    //    Flag.render(config, svg, qscale(0) + 100, 0, "50th", "average")
        Flag.render(config, svg, qscale(0) + 100, 0, flagLabel50)
        

    })
    .on('progress', function(e){
    //    d3.select(`#${dconfig.parentId}-binplot`).attr("opacity", scrollUtils.fadeOut(e.progress)) 
    //    d3.select(`#distribution-path-label-mostppl`).attr("opacity", scrollUtils.fadeInFadeOut(e.progress))  
    d3.select(`#distribution-path-label-mostppl`).attr("opacity", scrollUtils.fadeIn(e.progress))  
   //     d3.selectAll(".gradientplot-tick").attr("opacity", scrollUtils.fadeIn(e.progress)) 
       // d3.select(`#${dconfig.parentId}-binplot`).attr("opacity", scrollUtils.fadeIn(e.progress)) 
    })
    .addTo(scrollUtils.controller);  

    var interpIncreased = scrollUtils.createScene("psinterp-distribution-increased", "subsectionScene")
    interpIncreased.on('enter', function(e){
    //    Flag.render(config, svg, qscale(1.6), 150, "95nd", "increased")
    // Flag.render(config, svg,  qscale(1.6), config.innerWidth - qscale(1.6), "95nd", "increased")
  //  Flag.render(config, svg,  qscale(1.6), 300, "95nd", "increased")
    Flag.render(config, svg, qscale(1.6), 300, flagLabel95) 
    })
    .on('progress', function(e){
   //     d3.select(`#distribution-path-label-average`).attr("opacity", scrollUtils.fadeIn(e.progress))  

        d3.select(`#${dconfig.parentId}-binplot`).attr("opacity", scrollUtils.fadeEnter(e.progress))  
        d3.selectAll(".gradientplot-tick").attr("opacity", scrollUtils.fadeIn(e.progress)) 
        d3.select(`#ps-flag`).style("opacity", scrollUtils.fadeIn(e.progress))
        d3.select(`#flag-line`).style("opacity", scrollUtils.fadeIn(e.progress))
        d3.select(`#${dconfig.parentId}-areaplot`).attr("opacity", scrollUtils.fadeIn(e.progress))       
    //    d3.select(`#distribution-path-label-increased`).attr("opacity", scrollUtils.fadeInFadeOut(e.progress))  

    })
    .addTo(scrollUtils.controller);  


    var interpDecreased = scrollUtils.createScene("psinterp-distribution-decreased", "subsectionScene")
    interpDecreased.on('enter', function(e){
     //   Flag.render(config, svg, qscale(-1.6), 0, "5th", "decreased")
        Flag.render(config, svg, qscale(-1.6), 0, flagLabel5) 
    })
    .on('progress', function(e){
        d3.select(`#ps-flag`).style("opacity", scrollUtils.fadeIn(e.progress))
        d3.select(`#flag-line`).style("opacity", scrollUtils.fadeIn(e.progress))
        d3.select(`#distribution-path-label-decreased`).attr("opacity", scrollUtils.fadeInFadeOut(e.progress))  
    })
    .addTo(scrollUtils.controller);  



}

function createSvg(config) {
    const svg = d3.select(`#${config.rootId}`).append("svg").attr("id", `${config.rootId}-svg`) 
        .attr("width", config.width)
        .attr("height", config.height)
    return svg;
}

function updateConfig(config){

    config.innerHeight = config.height - config.padding.top - config.padding.bottom;
    config.innerWidth = config.width - config.padding.left - config.padding.right;

    return config
    
}

function createGroup(config, id) {
    const g = d3.select(`#${config.rootId}-svg`).append("g").attr("id", `${config.rootId}-${id}`)
        .attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);
    return g;
}



export {
    render
}