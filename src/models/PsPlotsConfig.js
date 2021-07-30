import * as d3 from "d3";
import * as colorUtils from "../utils/colors";

class PsPlotsConfig {

    constructor(data, 
                parentId, 
                rootId, 
                width, 
                height, 
                padding={top: 50, right: 50, bottom:50, left:50}
                ) {
        
        this.parentId = parentId;
        this.rootId = rootId;
        this.type = type;
        this.grid = grid;
        this.width = width;
        this.height = height;
        this.plotConfigs = plotConfigs;
        this.padding = padding;      
        this.data = data;

        this._updateConfig();
        this._updateData();
    }

    _updateConfig() {
        this.innerWidth = this.width - this.padding.left - this.padding.right;
        this.innerHeight = this.height - this.padding.top - this.padding.bottom;

        if (this.grid === undefined) {
            this.grid = {};
            this.grid.rows = 1;
            this.grid.columns = this.plotConfigs.length;
        }

        this.plotConfigs.height = this.innerHeight / this.grid.rows;
        this.plotConfigs.width = this.innerWidth / this.grid.columns;

        this.plotConfigs.innerHeight = this.plotConfigs.height - this.plotConfigs.padding.top - this.plotConfigs.padding.bottom;
        this.plotConfigs.innerWidth = this.plotConfigs.width - this.plotConfigs.padding.left - this.plotConfigs.padding.right;

    }

        _updateData(){
            let pathScale;

           if (this.parentId == "variantplotfigures" || this.parentId == "pscalcplotfigures"){
                pathScale = d3.scaleLinear().domain([400, 500, 800, 1200]).range([.75, 3, 10, 10])
            } else {
                pathScale = d3.scaleLinear().domain([400, 500, 800, 1200]).range([.5, .5, 3, 3])
            }
            this.scale = {
                x: d3.scaleLinear().domain([0, this.grid.columns]).range([0, this.innerWidth]),
                y: d3.scaleLinear().domain([0, this.grid.rows]).range([this.innerHeight, 0]),
                pathScale: pathScale
            };

            let innerWidth = this.plotConfigs.innerWidth / 2;

            let offsetX = this.plotConfigs.padding.left;
            let offsetY = this.padding.top;

            let offsetYShift = this.scale.y(0) + offsetY;
            var nodes = [];

            for (let x = 0; x < this.grid.columns; x++){
                for (let y = 0; y < this.grid.rows; y++){
                    nodes.push({color: colorUtils.lightgrey, x: this.scale.x(x) + offsetX, y:  this.scale.y(y) + offsetY, column: x, row: y, size: this.scale.pathScale(this.innerWidth), width: innerWidth })
                }
            }
            nodes = nodes.filter(function(d){  return d.column != 20  })

            if (this.color.type == "single"){
                nodes.forEach(function(node){
                    node.color = colorUtils.lightgrey;
                })
            } else if (this.color.type == "binary"){
                
                if (this.parentId == "variantplotfigures"){ // important for riskvariant individual
                    nodes.forEach(function(node){
                        if (node.column == 0){
                            node.color = colorUtils.red;
                        } else {
                            node.color = colorUtils.lightgrey;
                        }
                    })
                } 
                else {
                    nodes.forEach(function(node){
                        if (node.column > 9){
                            node.color = colorUtils.red;
                        } else  if (node.column <=9){
                            node.color = colorUtils.lightgrey;
                        }                  
                    })
                }

            } else if (this.color.type == "binary-row"){
                nodes.forEach(function(node){
                    node.y = offsetYShift
                    if (node.column > 9){
                       // node.x = node.x + offsetXShift;
                        node.color = colorUtils.red;
                    }
                    else if (node.column <= 9){
                        node.color = colorUtils.teal;
                    }  
                })
            }  
            
            this.plotData = nodes;    
        }

}

export function makeFigureData(config = variantFiguresConfig, data){
    config.data = data
    return config;
 }