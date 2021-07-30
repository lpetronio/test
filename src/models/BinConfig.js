
import * as d3 from "d3";
import * as randomPts from "../utils/pt-random";
import * as colorUtils from "../utils/colors";
import * as sizeUtils from "../utils/sizeUtils";
import * as scrollUtils from "../utils/scrollUtils";



class BinPlotConfig{
    constructor(data,
        parentId, 
        rootId, 
        type, 
        color,
        bins,
        size,
        width, 
        height, 
        padding={top: 50, right: 50, bottom:50, left:50}
        ) {

this.data = data;
this.parentId = parentId;
this.rootId = rootId;
this.type = type;
this.bins = bins;
this.size = size;
this.width = width;
this.height = height;
this.padding = padding;
this.color = color;


this.innerWidth = this.width - this.padding.left - this.padding.right;
this.innerHeight = this.height - this.padding.bottom;
data = data.filter(function(d){ return d.q >=-2.4 && d.q <= 2.4})

let colorbins = [-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4];
this.scale = {
    q: d3.scaleLinear().range([0, this.innerWidth]).domain(d3.extent(data, function(d){ return d.q})),
    p: d3.scaleLinear().range([this.height - this.padding.bottom, this.padding.top]).domain(d3.extent(data, function(d) { return d.p; })),
    q_: d3.scaleLinear().range(d3.extent(data, function(d){ return d.q})).domain([0, this.innerWidth]),
    color: d3.scaleLinear().domain(colorbins).range([colorUtils.darkteal, colorUtils.teal, colorUtils.lightgrey, colorUtils.lightgrey, colorUtils.lightgrey, colorUtils.red, colorUtils.darkred]),
    red: d3.scaleLinear().domain(colorbins).range([colorUtils.lightgrey, colorUtils.lightgrey, colorUtils.lightgrey, colorUtils.lightgrey, colorUtils.lightgrey, colorUtils.red, colorUtils.darkred]),
 //   redteal: d3.scaleLinear().domain(colorbins).range([colorUtils.lightgrey, colorUtils.lightgrey, colorUtils.lightgrey, colorUtils.lightgrey, colorUtils.lightgrey, colorUtils.red, colorUtils.darkred]),
    bin: d3.scaleLinear().range([-10, this.innerWidth-10]).domain([0, this.bins]),
    stack: d3.scaleLinear().range([this.innerHeight, this.padding.top]).domain([1, this.innerHeight / this.size.height])
}

//this.scale = scale
// this._updateConfig();
this._createData();

}

_createData() {

    var flatPlotData = [];
    var plotData = [];
    let scale = this.scale;
    let config = this;
    let size = this.size;
    let bins = [...new Array(this.bins + 1)]

    if (scrollUtils.windowWidth >= 800){
        size.width = size.width 
    } else {
        size.width = size.width *.85
    }


    if (this.type == "distribution") {

        bins.forEach(function(d, i){
            let x = scale.bin(i) - size.width;;
            let q = scale.q_(x); 
            let p = randomPts.gaussian(q);
            let el = {
                bin: i,
               //  x: (scale.q(q)) - (size.width),
                x: (scale.q(q)),
                q: q,
                p: p,
                y: scale.p(p),
                r: size.height+5
            }
            plotData.push(el)
            plotData.sort(function(a, b){ return d3.ascending(a.bin, b.bin)})
            plotData = plotData.filter(function(a){ return a.bin != 0})
        })

        plotData.forEach(function(d){
            let color;
            if (config.color == "grey"){
                color = colorUtils.lightgrey
            } else if (config.color == "red"){
                color = scale.red(d.q)
            } else {
                color = scale.color(d.q)
            }
            let num = Math.ceil((config.innerHeight - d.y - (config.size.height/4)) / (size.height))
            if (num <=1){ num = 1}
            let values = [...new Array(num)]
            let stacks = []
            values.forEach(function(e, i){
              //  console.log(d)
                let stack = {
                    x0:d.x,
                    x:0,
                    y0: d.y,
                    y: i * (d.r),
                    r: d.r,
                    q: d.q,
                    p: d.p,
                    width: config.size.width,
                    height: config.size.height,
                    color: color
                }
                flatPlotData.push(stacks)
                stacks.push(stack)
            })
            d.values = stacks
        })

    } else if (this.type == "grid"){

        bins.forEach(function(d, i){
            let x = scale.bin(i) - size.width;
            let q = scale.q_(x); 
            let p = randomPts.gaussian(q);
            let el = {
                bin: i,
            //    x: (scale.q(q)) - (config.size.width),
                x: (scale.q(q)),
                q: q,
                p: p,
                // y: scale.p(p),
                y: d3.selectAll(".plot-wrapper").node().clientHeight  * .5,
                r: size.height + 5
            }
            plotData.push(el)
            plotData.sort(function(a, b){ return d3.ascending(a.bin, b.bin)})
            plotData = plotData.filter(function(a){ return a.bin != 0})
        })

        plotData.forEach(function(d){
            let color;
            if (config.color == "grey"){
                color = colorUtils.lightgrey
            } else if (config.color == "red"){
                color = scale.red(d.q)
            } else {
                color = scale.color(d.q)
            }
            
            let num = Math.ceil((config.height - d.y) / (size.height))
            if (num <=1){ num = 1}
            let values = [...new Array(num)]
            let stacks = []
            values.forEach(function(e, i){
                let stack = {
                    x0: d.x,
                    x:0,
                    y0:d.y,
                    // y: i * d.r,
                    y: 0,
                    r: d.r,
                    q: d.q,
                    p: d.p,
                    width: config.size.width,
                    height: config.size.height,
                    // color: scale.color(d.q)
                    color: color
                }
                flatPlotData.push(stacks)
                stacks.push(stack)
            })
            d.values = stacks
        })
        }
        this.flatData = flatPlotData.flat()
        this.plotData = plotData

    }


}




// function makeData(config, data){
//     let bins = []
//     let radius = config.size.height;
//     let nbins = [...new Array(config.bins)]
//     let colorbins = [-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4];
//     let scale = {
//         q: d3.scaleLinear().range([0, config.innerWidth]).domain(d3.extent(data, function(d){ return d.q})),
//         p: d3.scaleLinear().range([config.height - config.padding.bottom, config.padding.top]).domain(d3.extent(data, function(d) { return d.p; })),
//         q_: d3.scaleLinear().range(d3.extent(data, function(d){ return d.q})).domain([0, config.innerWidth]),
//         color: d3.scaleLinear().domain(colorbins).range([colorUtils.darkteal, colorUtils.teal, colorUtils.lightgrey, colorUtils.lightgrey, colorUtils.lightgrey, colorUtils.red, colorUtils.darkred]),

//         bin: d3.scaleLinear().range([0, config.innerWidth]).domain([0, config.bins]),
//         stack: d3.scaleLinear().range([config.height - config.padding.bottom, config.padding.top]).domain([1, config.innerHeight/ radius]),
//     }

//     config.scale = scale;



//     nbins.forEach(function(d, i){
//         let x = scale.bin(i);
//         let q = scale.q_(x);
//         let p = randomPts.gaussian(q);
//         let y;
//         if (config.type == "distribution"){
//             y = scale.p(p)
//         } else {
//             y = config.height
//         }

//         let el = {
//             bin: i,
//             x: scale.q(q),
//             q: q,
//             p: p,
//             // y: scale.p(p),
//             y: y,
//             r:radius
//         }
//         bins.push(el)
//         bins.sort(function(a, b){ return d3.ascending(a.bin, b.bin)})
//     })

//     bins.forEach(function(d){
//         let num = Math.ceil((config.height - d.y) / (radius))
//         if (num <=1){ num = 1}
//         let values = [...new Array(num)]
//         let stacks = []
//         values.forEach(function(e, i){
//             let stack = {
//                 x:0,
//                 y: i * d.r,
//                 r: d.r,
//                 q: d.q,
//                 p: d.p
//             }
//             stacks.push(stack)
//         })
//         d.values = stacks
//     })
//     return bins
// }


export {
    BinPlotConfig
}