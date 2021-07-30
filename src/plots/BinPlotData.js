
import * as d3 from "d3";
import * as randomPts from "../utils/pt-random";
import * as testUtils from "../utils/test-utils";
import * as AreaPlot from "./AreaPlot"
import * as Flag from "./psFlag"
import * as GradientPlot from "./GradientPlot"
// import { stack, stackOrderNone } from "d3";
import * as scrollUtils from "../utils/scrollUtils";
import * as colorUtils from "../utils/colors";
import * as sizeUtils from "../utils/sizeUtils";


function makeData(config, data){
    let bins = []
    let radius = config.size.height;
    let nbins = [...new Array(config.bins + 1)]
    let colorbins = [-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4];
    let scale = {
        q: d3.scaleLinear().range([0, config.innerWidth]).domain(d3.extent(data, function(d){ return d.q})),
        p: d3.scaleLinear().range([config.height - config.padding.bottom, config.padding.top]).domain(d3.extent(data, function(d) { return d.p; })),
        q_: d3.scaleLinear().range(d3.extent(data, function(d){ return d.q})).domain([0, config.innerWidth]),
        color: d3.scaleLinear().domain(colorbins).range([colorUtils.darkteal, colorUtils.teal, colorUtils.lightgrey, colorUtils.lightgrey, colorUtils.lightgrey, colorUtils.red, colorUtils.darkred]),

        bin: d3.scaleLinear().range([0, config.innerWidth]).domain([0, config.bins]),
        stack: d3.scaleLinear().range([config.height - config.padding.bottom, config.padding.top]).domain([1, config.innerHeight/ radius]),
    
    }

    config.scale = scale;

    // let scale = config.scale;

    nbins.forEach(function(d, i){
        let x = scale.bin(i);
        let q = scale.q_(x);
        let p = randomPts.gaussian(q);
        let y;
        if (config.type == "distribution"){
            y = scale.p(p)
        } else {
            y = config.height
        }

        let el = {
            bin: i,
            // x: scale.q(q),
            x: scale.bin(i),
            q: q,
            p: p,
            // y: scale.p(p),
            y: y,
            r:radius
        }
        bins.push(el)

        bins.sort(function(a, b){ return d3.ascending(a.bin, b.bin)})
        let a = bins[0]
        a.x = 0;
        a.bin = -1;

        let b = bins[bins.length -1]
        b.x = config.innerWidth;
        b.bin = b.bin + 2;
        bins.push(a)


    })
 //   let flatbins = []
    bins.forEach(function(d){
        let num = Math.ceil((config.height - d.y) / (radius))
        if (num <=1){ num = 1}
        let values = [...new Array(num)]
        let stacks = []
        values.forEach(function(e, i){
            let stack = {
                x:0,
                y: i * d.r,
                r: d.r,
                q: d.q,
                p: d.p
            }
            stacks.push(stack)

        })
     //   flatbins.push(stacks)
        d.values = stacks
    })

return bins

}


export {
    makeData
}