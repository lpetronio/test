import * as d3 from "d3";
import * as ScrollMagic from "scrollmagic";
import * as colorUtils from "./colors";
// import * as randomUtils from "./random"
import { scaleLinear } from "d3";

//const fullDur = d3.select(".scene").node().clientHeight;
//const halfDur = fullDur/2;
//const stdDur = d3.select(".scene").node().clientHeight;
const transitionDuration = 500;

//const stdDur = window.innerHeight*.8; // CHECK THE EFFECT OF THIS!!
const stdDur = d3.select(".scene").node().clientHeight // CHECK THE EFFECT OF THIS!!
const windowWidth = window.innerWidth; 
const windowHeight = window.innerHeight; 
const controller = new ScrollMagic.Controller();

const topHook = 0.15;
const bottomHook = .8; 

/**
 * normal trigger is for subsecton text
 */
const startTrigger = 0; 
const endTrigger = 0.1;
const holdTrigger = 1 - endTrigger;
const triggerDomain = [startTrigger, endTrigger, holdTrigger, 1]

/**
 * animation trigger is longer for animations
 */
const startAnimationTrigger = 0;
const endAnimationTrigger = 0.3;
const holdAnimationTrigger = 1 - endAnimationTrigger;
const animationDomain = [startTrigger, endAnimationTrigger, holdAnimationTrigger, 1];

const delayStartAnimationTrigger = 0.4;
const delayEndAnimationTrigger = 0.8;
//const delayHoldAnimationTrigger = 1 - delayEndAnimationTrigger;
const delayAnimationDomain = [0, delayStartAnimationTrigger, delayEndAnimationTrigger, 1];

/**
 * animation trigger is longer for animations
 */
const endSectionTrigger = 0.3;
const holdSectionTrigger = 1 - endSectionTrigger;
const sectionDomain = [startTrigger, endSectionTrigger, holdSectionTrigger, 1];

//const animationDomain = triggerDomain
const animationProg = scaleLinear() // for helix only
//    .domain(animationDomain)
//     .domain([startTrigger, holdAnimationTrigger, 1])
    .domain([0, .3, .6, 1]) // this seems to be referencing max z attribute
    .range([0, 0, 1, 1]) // this seems to be scroll


const animateIn =  d3.scaleLinear()
    .domain([startAnimationTrigger, endAnimationTrigger])
    .range([0, 1])

const delayAnimateIn =  d3.scaleLinear()
    .domain([delayStartAnimationTrigger, delayEndAnimationTrigger])
    .range([0, 1])

const fadeIn =  d3.scaleLinear()
    .domain([startTrigger, endTrigger])
    .range([0, 1])

    const fadeEnter = d3.scaleLinear()
    .domain([startTrigger, endTrigger])
    .range([1, 0])

const fadeOut = d3.scaleLinear()
    .domain([holdTrigger, 1])
    .range([1, 0])

const fadeInFadeOut = d3.scaleLinear()
    .domain(triggerDomain)
    .range([0, 1, 1, 0])

const sectionFadeInFadeOut = d3.scaleLinear()
    .domain(sectionDomain)
    .range([0, 1, 1, 0])

// const sectionFadeOut = d3.scaleLinear()
//     .domain([holdSectionTrigger, 1])
//     .range([1, 0])

const sectionFadeOut = d3.scaleLinear()
    .domain([endSectionTrigger, holdSectionTrigger])
    .range([1, 0])

const sectionFadeIn = d3.scaleLinear()
    .domain([startTrigger, endSectionTrigger])
    .range([0, 1])

const yellowToRed = d3.scaleLinear()
    .domain([startAnimationTrigger, endAnimationTrigger, 1])
    .range([colorUtils.yellow, colorUtils.red, colorUtils.red])

const yellowToGrey = d3.scaleLinear()
    .domain([startAnimationTrigger, endAnimationTrigger, 1])
    .range([colorUtils.yellow, colorUtils.lightgrey, colorUtils.lightgrey])

const greyToYellow = d3.scaleLinear()
    .domain([startAnimationTrigger, endAnimationTrigger, 1])
    .range([colorUtils.lightgrey, colorUtils.yellow, colorUtils.yellow])

const greyToRed = d3.scaleLinear()
    .domain([startAnimationTrigger, endAnimationTrigger, 1])
    .range([colorUtils.lightgrey, colorUtils.red, colorUtils.red])


const redToGrey = d3.scaleLinear()
    .domain([startAnimationTrigger, endAnimationTrigger, 1])
    .range([colorUtils.red, colorUtils.red, colorUtils.lightgrey])

    

const greyToTeal = d3.scaleLinear()
    .domain([startAnimationTrigger, endAnimationTrigger, 1])
    .range([colorUtils.lightgrey, colorUtils.teal, colorUtils.teal])

const lightToDarkGrey = d3.scaleLinear()
    .domain([startAnimationTrigger, endAnimationTrigger, 1])
    .range([colorUtils.lightgrey, colorUtils.darkgrey, colorUtils.darkgrey])


var lightToFadeGrey = d3.scaleLinear()
.domain([startAnimationTrigger, endAnimationTrigger, 1])
.range([colorUtils.lightgrey, colorUtils.fadegrey, colorUtils.fadegrey])   

const fadeHalfOut = d3.scaleLinear() // what is this???
    .domain([startAnimationTrigger, endTrigger, 1])
    .range([1, 0.3, 0.3])

export function highlightMagnitude(config){

    const plots = d3.selectAll(`.${config.parentId}-plot .towerplot-rect`)
    let opacity = d3.scaleLinear().domain([0,1]).range([0.2, 1])

    plots
        .filter((d)=> { 
            return d.effect != "neutral"  
        })
        .attr("opacity", function(d){ 
            return opacity(d.effect_size) 
        })

    plots
        .filter((d)=> { return d.effect == "neutral"  })
        .attr("opacity", .2)   

    }
    

/**
 * 
 * @param {*} sceneId divId of 
 */
function createScene(sceneId){
 
    let scale = fadeInFadeOut;

    var scene = new ScrollMagic.Scene({
        triggerElement: `#${sceneId}`,
        triggerHook: bottomHook,
        duration:d3.select(`#${sceneId}`).node().clientHeight
    })
    // .on('enter', function(e){
    //         d3.select(`#${sceneId}`).transition().duration(transitionDuration).style("opacity", 1)
    // })
    // .on('leave', e => { 
    //     d3.select(`#${sceneId}`)
    //     .transition().duration(transitionDuration).style("opacity", 0)

    // })
    return scene
}

function createAnimation(domId){
var scene = new ScrollMagic.Scene({
        triggerElement: `#${domId}`,
        triggerHook: bottomHook,
        duration: d3.select(`#${domId}`).node().clientHeight
    })
    return scene
    
}


// /**
//  * 
//  * @param {*} sceneId divId of 
//  */
// function createSectionScene(sceneId){
//     var scene = new ScrollMagic.Scene({
//         triggerElement: `#${sceneId}`,
//         triggerHook: bottomHook,
//         duration:stdDur
//     })
//     .on('progress', e => { 
//         d3.select(`#${sceneId}`).style("opacity", sectionFadeInFadeOut(e.progress)) 
//     })
//     return scene
// }

// function animateRemoveClass(dom, selectClass, removeClass){
//     d3.select(`.${dom}`).selectAll(`.${selectClass}`).classed(removeClass, false)
//   }

// function animateAddClass(dom, selectClass, addClass){
//   d3.select(`.${dom}`).selectAll(`.${selectClass}`).classed(addClass, true)
// }

// function animateAppendLabel(dom, selectClass, text, addClass){

//   let x =  d3.select(`.${selectClass}`).attr("x")
//   let width = d3.select(`.${selectClass}`).attr("width")
//   let y =  d3.select(`.${selectClass}`).attr("y")
//   let height = d3.select(`.${selectClass}`).attr("height")

//   d3.select(`.${dom}`).selectAll('.label').remove()
//   d3.select(`.${dom}`).append("text")
//     .attr("class", `${addClass} label-md`)
//     .attr("x", d3.sum([x, width, 5]) )
//     .attr("y", d3.sum([y, height/2])).html(text)
// }

export {
    controller,
    stdDur,
    topHook,
    bottomHook,
    startTrigger,
    endTrigger,
    fadeIn,
    fadeOut,
    fadeInFadeOut,
    sectionFadeInFadeOut,
    sectionFadeIn,
    sectionFadeOut,
    greyToRed,
    greyToTeal,
    yellowToRed,
    yellowToGrey,
    greyToYellow,
    lightToDarkGrey,
    lightToFadeGrey,
    redToGrey,
    // appendRectLabel,
    createScene,
    createAnimation,
    animateIn,
    animationDomain,
    delayAnimateIn,
    delayAnimationDomain,
    startAnimationTrigger,
    endAnimationTrigger,
    holdAnimationTrigger,
    animationProg,
    fadeHalfOut,
    windowHeight,
    windowWidth,
    transitionDuration,
    fadeEnter

}