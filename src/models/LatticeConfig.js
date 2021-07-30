import * as d3 from "d3";
import * as colorUtils from "../utils/colors";

import * as sizeUtils from "../utils/sizeUtils";


export class LatticeConfig {
    /**
     * Constructor for creating a LatticeConfig instance
     * @param {String} parentId - id of the  group parent
     * @param {String} rootId - id of the dom for svg element
     * @param {Object(String: Number)} grid - object to specify number of rows and columns.
     *                                        expected attributes: rows, columns
     * @param {Number} width - outer width of the plot (including padding)
     * @param {Number} height - outer height of the plot (including padding)
     * @param {Object} plotConfigs - configuration object for the individual plots.
     *                               in addition to including attributes specified by plot type,
     *                               this should also include the row, column, and type attribute
     * @param {Object(String: Number)?} padding - object to specify amount of padding
     *                                            expected attributes: top, right, bottom, left
     */
    constructor(data,
                parentId, 
                rootId, 
                sceneId,
                type,
                grid, 
                width, 
                height, 
                plotConfigs, 
                padding={top: 50, right: 50, bottom:50, left:50}, 
                label={x:"", y:"", plot: ""}, 
                scale={x: "", y: "", color:""}) {

        this.rootId = rootId;
        this.parentId = parentId;
        this.type = type;
        this.grid = grid;
        this.width = width;
        this.height = height;
        this.padding = padding;   
        this.label = label; 
        this.scale = scale;    
        this.plotConfigs = plotConfigs;
        this.sceneId = sceneId;
       // let positions = this.plotConfigs.positions;
        this.data = data;

        // this.data = data.filter(function(d){
        //     d.data = d.values.filter(function(e){
        //         return e.position <= positions;
        //     })
        // }).sort(function(a, b){ return d3.ascending(a.numpos, b.numpos)});


        this._updateConfig();
    }

    _updateConfig() {
        this.innerWidth = this.width - this.padding.left - this.padding.right;
        this.innerHeight = this.height - this.padding.top - this.padding.bottom;

        if (this.grid === undefined) {
            this.grid = {};
            this.grid.rows = d3.max(this.plotConfigs.map((x) => x.row)) + 1;
            this.grid.rows = 1
            this.grid.columns = this.data.length;
          //  this.grid.columns = d3.max(this.plotConfigs.map((x) => x.column)) + 1;
        }

        this.plotConfigs.height = this.innerHeight / this.grid.rows;
        // this.plotConfigs.width = this.innerWidth / this.grid.columns;

        let plotWidth = (this.innerWidth / this.grid.columns);
        this.plotConfigs.width = plotWidth - (plotWidth*.2)

        this.scale = {
            x: d3.scaleLinear().domain([0, this.grid.columns]).range([0, this.innerWidth]), // change to igv data range
            y: d3.scaleLinear().domain([0, this.grid.rows]).range([0, this.innerHeight]) // change to posterior probability
        };

        this.plotConfigs.rootId = `${this.rootId}`;
        this.plotConfigs.parentId = `${this.parentId}-plot}`;


        let positions = this.plotConfigs.positions;
        this.data.forEach((x, i) => {
            x.sceneId = this.sceneId;
            x.height = this.innerHeight / this.grid.rows;
            x.width =  this.plotConfigs.width;
            x.x = this.scale.x(i);
            x.y = this.scale.y(0);

            x.row = 0;
            x.column = i;

            x.rootId = `${this.rootId}`;
            x.parentId = `${this.parentId}-plot-${x.row}-${x.column}`;
            x.padding = this.plotConfigs.padding;
            x.scale = this.plotConfigs.scale;

            x.data = x.values.filter(function(rect){
                return rect.position <= positions;
            })
            x.grid = this.plotConfigs.grid;
            x.type = this.plotConfigs.type;

            x.scroll= this.plotConfigs.scroll;
            x.colorType = this.plotConfigs.colorType;
            x.opacityType = this.plotConfigs.opacityType;
        });

        let plotData = this.data.map(function(d){ return d})

        // this creates the offset for Lattice Non-disease and Disease pops
        if (this.parentId == "riskvariantplot"){
            let median = d3.median(plotData, function(d){ return d.column})
            plotData = plotData.filter(function(d){ return d.column != median})

          //  plotData = plotData.filter(function(d){ return d.column != 10})

        } 
        // else if (this.parentId == "pscalcplot"){
        //     let median = d3.median(plotData, function(d){ return d.column})
        //     plotData = plotData.filter(function(d){ return d.column == median})
        // } 
        // else if (this.parentId == "psplot"){
        //     let median = d3.median(plotData, function(d){ return d.column})
        //     plotData = plotData.filter(function(d){ return d.column == median})
        // }
        this.plotData = plotData;



    }
}








