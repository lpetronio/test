
import * as d3 from "d3";
import * as colorUtils from "../utils/colors";
import * as sizeUtils from "../utils/sizeUtils";
import { plotLabelDy } from "../utils/sizeUtils";


export class TowerPlotConfig {

    constructor(data,
                parentId, 
                rootId, 
                type, 
                grid,
                width, 
                height, 
                padding={top: 50, right: 50, bottom:50, left:50}, 
                scale={x: "", y: "", color:""},
                colorType,
                opacityType
                ) {

        this.data = data;
        this.parentId = parentId;
        this.rootId = rootId;
        this.type = type;
        this.grid = grid;
        this.width = width;
        this.height = height;
        this.padding = padding;
        // this.label = label;
        this.scale = scale;
        this.colorType = colorType;
        this.opacityType = opacityType;
        // this.ticks = ticks;



        this._createData();
        this._updateConfig();
    }


    _createData() {


        var plotData;
        if (this.type == "towerplot-stack"){

        plotData = this.data.map(function(d){ return d}).filter(function(d){ return d.effect != "neutral" })

          let neg = plotData.filter(function(a){ return a.effect == "negative"})
                .sort(function(a, b){ return d3.ascending(a.effect_size, b.effect_size)})

            let pos = plotData.filter(function(a){ return a.effect == "positive"})
                .sort(function(a, b){ return d3.descending(a.effect_size, b.effect_size)})

            plotData = pos.concat(neg)
            plotData.forEach(function(rect, i){
                rect.x = 1;
                rect.y = i;
                // add function getColor(tower, config) so you don't have to re-iterate
            })

        } else {
            plotData = this.data.map(function(d){ return d})
            plotData.forEach(function(rect){
            // add function getColor(tower, config) so you don't have to re-iterate
                rect.x = rect.copy;
                rect.y = rect.position;
            })
        }

        this.plotData = plotData;
        // this.grid.rows = d3.max(plotData.map(d => d.x))
        // this.grid.columns = d3.max(plotData.map(d => d.y))

    }

    _updateConfig() {

        this.innerHeight = this.height - this.padding.top - this.padding.bottom;

        let colorScale = makeColorScale(this)
        let opacityScale = makeOpacityScale(this)
        let bandWidth, domainX, rangeX;
        if (this.type == "towerplot-stack"){

            bandWidth = this.width;
            domainX = [1, 2] 
            rangeX = [0, bandWidth]

        } else if (this.type == "towerplot-pair"){
            bandWidth = this.width/2
            domainX = [1, 2] 
            rangeX = [0, bandWidth]
        }
        
        if (bandWidth >= sizeUtils.maxBinX){
            bandWidth = sizeUtils.maxBinX
        }

     let scales = {
        x: d3.scaleLinear().domain(domainX).range(rangeX),
        y: d3.scaleLinear().domain( d3.extent(this.plotData.map(d => d.y))).range([this.innerHeight, 0]),
        color: colorScale,
        height: (this.innerHeight / d3.max(this.plotData.map(d => d.y)) ),
        opacity: opacityScale.opacity
     }


        this.plotData.forEach(function(rect){            

            rect.x = scales.x(rect.x);
            rect.y = scales.y(rect.y);
            rect.color = scales.color(rect.effect);

            rect.height = scales.height  * 0.96;
            rect.width = bandWidth - (bandWidth*.1);
            

            if (rect.effect == "neutral"){
                rect.opacity = opacityScale.neutral;
            } else {
                rect.opacity = scales.opacity(rect.effect_size);
            }
        })
        this.scale = scales;


    }




}

function makeOpacityScale(config){
    let neutral;
    let opacity =  d3.scaleLinear().domain([0,1])
    if (config.opacityType == "normal"){
        opacity.range([1, 1])
        neutral = 1;
    } else {
        opacity.range([0.2, 1])
        neutral = .3;
    }

    let obj = {
        opacity: opacity,
        neutral: neutral
    }
    return obj

}

function makeColorScale(config){

    let colorScale = d3.scaleOrdinal()
        .domain(["neutral", "positive", "negative"])


    if (config.colorType == "grey"){
        colorScale.range([colorUtils.lightgrey, colorUtils.lightgrey, colorUtils.lightgrey])
            
    } else if (config.colorType == "greyRed"){

        colorScale =  d3.scaleOrdinal()
            .domain(["neutral", "positive", "negative"])
            .range([colorUtils.lightgrey, colorUtils.red, colorUtils.lightgrey])

    } else if (config.colorType == "greyRedTeal"){
        colorScale = d3.scaleOrdinal()
            .domain(["neutral", "positive", "negative"])
            .range([colorUtils.lightgrey, colorUtils.red, colorUtils.teal])
    }
    return colorScale

}

