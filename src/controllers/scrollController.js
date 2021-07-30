import * as d3 from "d3"; 
import * as ScrollMagic from "scrollmagic";
import * as scrollUtils from "../utils/scrollUtils";
import * as helix from "./helixController";
import * as variant from "./variantController";
import * as riskVariant from "./riskVariantController";
import * as ps from "../plots/PsPlots";

// const lang;
// function getLanguage(language){
//     return language
// }

function init(data, language){

  //  lang = getLanguage(language);

    new ScrollMagic.Scene({
        triggerElement: `#variant-scroll-wrapper`,
        triggerHook: scrollUtils.topHook,
        duration: d3.select("#variant-scroll-wrapper").node().clientHeight - scrollUtils.stdDur
    })
    .setPin(`#variant-plot-wrapper`)
    .addTo(scrollUtils.controller);  


    new ScrollMagic.Scene({
        triggerElement: `#riskvariant-scroll-wrapper`,
        triggerHook: scrollUtils.topHook,
        duration: d3.select("#riskvariant-scroll-wrapper").node().clientHeight - scrollUtils.stdDur
    })
    .setPin(`#riskvariant-plot-wrapper`)
    .addTo(scrollUtils.controller);  


    new ScrollMagic.Scene({
        triggerElement: `#pscalc-scroll-wrapper`,
        triggerHook: scrollUtils.topHook,
        duration: d3.select("#pscalc-scroll-wrapper").node().clientHeight - scrollUtils.stdDur
    })
    .setPin(`#ps-plot-wrapper`)
    .addTo(scrollUtils.controller);  

    
    activateNavigation("intro-to-polygenic-scores")
    activateNavigation("genetic-variation")
    activateNavigation("riskvariant")
    activateNavigation("pscalc")
    activateNavigation("psinterp")
    activateNavigation("psapp")
    activateNavigation("dnadestiny")

    document.getElementById("intro-to-polygenic-scores-nav").onclick = function() {
        scrollTo("intro-to-polygenic-scores-section", 50)
    }
   document.getElementById(`genetic-variation-nav`).onclick = function(){
    scrollTo("variant-scroll-wrapper", 150)
   }

   document.getElementById(`riskvariant-nav`).onclick = function(){
      scrollTo("riskvariant-scroll-wrapper", 150)
    }

    document.getElementById(`pscalc-nav`).onclick = function(){
        scrollTo("pscalc-scroll-wrapper", 150)
      }
   
    document.getElementById("psinterp-nav").onclick = function() {
        scrollTo("psinterp-section", 150)
    }
    document.getElementById("psapp-nav").onclick = function() {
        scrollTo("psapp-section", 50)
    }
    document.getElementById("dnadestiny-nav").onclick = function() {
        scrollTo("dnadestiny-section", 50)
    }


    const helixData =  Array.from(data).filter((n, i) => n.percentile <= 1)
    helix.init(undefined, helixData, language)

    const variantvData = Array.from(data).filter((n, i) => n.percentile >=20 && n.percentile <= 22)
    variant.init(undefined, undefined, variantvData, language)

    var riskvariantvData;
    if (scrollUtils.windowWidth >= 800){
        riskvariantvData = Array.from(data).filter((n, i) => n.percentile <= 9 || n.percentile >= 89);
    } else {
        riskvariantvData = Array.from(data).filter((n, i) => n.percentile <= 5 || n.percentile >= 95);
    }
    riskVariant.init(undefined, undefined, riskvariantvData, language)
   
    const psData = Array.from(data)
    ps.render(undefined, psData, undefined, undefined, undefined, language)
   
}

function scrollTo(domId, yOffset) {
    var yOffset = -yOffset; 
    const element = document.getElementById(domId);
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
  }


function activateNavigation(domId){
    new ScrollMagic.Scene({
        triggerElement: `#${domId}-section`,
        triggerHook: scrollUtils.bottomHook,
        duration: d3.select(`#${domId}-section`).node().clientHeight
    })
    .on('progress', function(){
        d3.selectAll(".nav-option").classed("active-nav-option", false)
        d3.selectAll(".nav-home").classed("active-nav-option", false)
        d3.select(`#${domId}-nav`).classed("active-nav-option", true)
    })
    .addTo(scrollUtils.controller);  
}



export{
    init
}