

import * as d3 from "d3";
import * as colorUtils from "../utils/colors";

export class HelixPlotConfig {
    /**
     * Constructor for creating a ScatterPlotConfig instance
     * @param {String} rootId - id of the SVG parent
     * @param {Number} width - outer width of plot (including padding)
     * @param {Number} height - outer height of plot (including padding)
     * @param {Object(String: Number)?} padding - object to specify amount of padding
     *                                            expected attributes: top, right, bottom, left
     * @param {Object(String: String)?} label - labels for the axes
     *                                          expected attributes: x, y
     * @param {Object(String: String)?} scale - scale to use for each axis
     *                                          expected attributes: x, y
     */
    constructor(parentId, 
                rootId, 
                width, 
                height, 
                padding={top: 50, right: 50, bottom:50, left:50}, 
                label={x:"", y:"", plot: ""}, 
                scale={x: "", y: ""}, 
                ticks={x: undefined, y: undefined}, 
                grid, 
                scroll) {

        this.rootId = rootId;
        this.parentId = parentId;
        this.width = width;
        this.height = height;
        this.padding = padding;
        this.label = label;
        this.scale = scale;
        this.ticks = ticks;
        this.grid = grid;
        this.scroll = scroll;

        this._updateConfig();
    }
    /**
     * TODO: add additions checks to see if config meets requirements
     * Intended as a private function
     * Computes plot inner height and inner width (i.e. without padding)
     * Ensures that there is an X and Y scale attribute,
     *                          X, Y, and plot label attribute, and
     *                          X and Y ticks attribute
     */
    _updateConfig() {
        this.innerWidth = this.width - this.padding.left - this.padding.right;
        this.innerHeight = this.height - this.padding.top - this.padding.bottom;
        
        this.scale.x = this.scale.x ? this.scale.x : "";
        this.scale.y = this.scale.y ? this.scale.y : "";
        this.label.x = this.label.x ? this.label.x : "";
        this.label.y = this.label.y ? this.label.y : "";
        this.label.plot = this.label.plot ? this.label.plot : "";
        this.ticks.x = this.ticks.x ? this.ticks.x : undefined;
        this.ticks.y = this.ticks.y ? this.ticks.y : undefined;
        this.ticks.height = (this.innerHeight / this.grid.rows) * 0.95;
        this.ticks.width = (this.innerWidth / this.grid.columns) * 0.9;
        
    }
}