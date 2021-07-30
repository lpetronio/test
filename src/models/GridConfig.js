import * as d3 from "d3";
import * as colorUtils from "../utils/colors";
import * as scrollUtils from "../utils/scrollUtils";

// uses lattice xscale on scroll? or is it its own feature
class GridConfig {

    constructor(data, 
                elementId,
                parentId, 
                rootId, 
                type,
                grid, 
                color,
                width, 
                height, 
                plotConfigs, 
                padding={top: 50, right: 50, bottom:50, left:50}
                ) {
        
        this.elementId = elementId;
        this.parentId = parentId;
        this.rootId = rootId;
        this.type = type;
        this.grid = grid;
        this.width = width;
        this.height = height;
        this.plotConfigs = plotConfigs;
        this.padding = padding;      
        this.data = data;
        this.color = color;

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
                pathScale = d3.scaleLinear().domain([500, 800, 1200]).range([.75, 3, 6, 6])
            } else {
                pathScale = d3.scaleLinear().domain([500, 800, 1200]).range([.5, .5, 3, 3])
            }
            this.scale = {
                x: d3.scaleLinear().domain([0, this.grid.columns]).range([0, this.innerWidth]),
                y: d3.scaleLinear().domain([0, this.grid.rows]).range([this.innerHeight, 0]),
                pathScale: pathScale
            };

            
            let innerWidth = this.plotConfigs.innerWidth;
            let moveX;
            let elHeight, elWidth;


            if (scrollUtils.windowWidth >=800){
                moveX = innerWidth/4;
                elWidth = this.plotConfigs.innerWidth;;
                elHeight = this.padding.bottom * .8;
            } else {
                moveX = 0;
                elWidth = this.plotConfigs.innerWidth;
                elHeight = this.padding.bottom*.5;
            }
     
           
            let moveY = this.padding.top;

            let bottom = this.scale.y(0);
            var nodes = [];

            for (let x = 0; x < this.grid.columns; x++){
                for (let y = 0; y < this.grid.rows; y++){
                    
                    nodes.push({
                        color: colorUtils.lightgrey,
                         x: this.scale.x(x) + moveX, 
                         y:  this.scale.y(y) + moveY, 
                         column: x, 
                         row: y, 
                         size: this.scale.pathScale(this.innerWidth), 
                         width: elWidth,
                         height: elHeight
                        })
                }
            }
          //  nodes = nodes.filter(function(d){  return d.column != 20  })

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
                   // nodes = nodes.filter(function(d){ return d.column != 20})
               // nodes = nodes.filter(function(d){ return d.column != 10})
                let median = d3.median(nodes, function(d){ return d.column})
                nodes = nodes.filter(function(d){ return d.column != median})
                    nodes.forEach(function(node){
                        if (node.column > median-1){
                          //  node.x = node.x + innerWidth + moveX;
                            node.color = colorUtils.red;
                        } else  if (node.column <=median-1){
                            node.color = colorUtils.lightgrey;
                        }                  
                    })
                }

            } else if (this.color.type == "binary-row"){
                // nodes = nodes.filter(function(d){ return d.column != 20})
               // nodes = nodes.filter(function(d){ return d.column != 10})
               let median = d3.median(nodes, function(d){ return d.column})
               nodes = nodes.filter(function(d){ return d.column != median})
                nodes.forEach(function(node){
                    node.y = bottom;
                    if (node.column > median-1){
                       // node.x = node.x + innerWidth + moveX;
                        node.color = colorUtils.red;
                    }
                    else if (node.column <= median-1){
                        node.color = colorUtils.lightgrey;
                    }  
                })
            }  
            
            this.plotData = nodes;    
        }

}

export {
    GridConfig
}