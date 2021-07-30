import * as d3 from "d3";

export const LATTICE_DEFAULT_PADDING = 20;
export const PLOT_DEFAULT_PADDING = 50;

// plot type enums
export const plots = {
    BARPLOT: "barplot",
    COLUMNPLOT: "columnplot",
    SCATTERPLOT: "scatterplot",
    STACKEDCOLUMN: "stackedcolumnplot"
};

// valid scale type enums
export const scales = {
    LINEAR: "linear",
    CATEGORICAL: "categorical",
    SQRT: "sqrt",
    TEMPORAL: "temporal"
};

// enum for default scales for each plot type
export const defaultScales = {
    [plots.BARPLOT]: {
        x: scales.LINEAR,
        y: scales.CATEGORICAL
    },
    [plots.COLUMNPLOT]: {
        x: scales.CATEGORICAL,
        y: scales.LINEAR
    },
    [plots.SCATTERPLOT]: {
        x: scales.LINEAR,
        y: scales. LINEAR
    },
    [plots.STACKEDCOLUMN]: {
        x: scales.CATEGORICAL,
        y: scales.LINEAR
    }
};

// export const plotScaleTypes = {
//     [plots.SCATTERPLOT]: {
//         x: ["categorical", "linear", "temporal"],
//         y: ["categorical", "linear", "temporal"]
//     },
//     stackedcolumnplot: {
//         x: ["categorical", "linear"],
//         y: ["linear"]
//     }

// };

/**
 * Creates an SVG element in the given rootId and returns it.
 * @param {PlotConfig} config - An instance of a subclass of PlotConfig class
 * @param {String} id  - id to be appended to end of the group name in the form of config.rootId-id
 */

export function createSvg(config, id) {
    // error check that rootId exists, meets padding requirements
    // create svg
    // const rootSvgId = `${config.rootId}-svg`;
  //  config.parentId = rootSvgId; // svg will not have a parentId set if we are creating the svg using the provided rootId
    const svg = d3.select(`#${config.rootId}`).append("svg").attr("id", `${config.rootId}-svg`)
        .attr("width", config.width)
        .attr("height", config.height)
        .append("g").attr("id", `${config.rootId}-${id}`)
        .attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);

    return svg;
}

/**
 * Creates a group in the given rootId and returns it.
 * @param {PlotConfig} config 
 * @param {String} id  - id to be appended to end of the group name in the form of config.rootId-id
 */

export function createGroup(config, id) {
    if (config.parentId === undefined) {
        console.error("parentId not provided for creating new group for plot");
    }
    const g = d3.select(`#${config.parentId}`).append("g").attr("id", `${config.parentId}-${id}`)
        .attr("transform", `translate(${config.padding.left}, ${config.padding.top})`);
    return g;
}

/**
 * Creates a d3 scale with a domain and range.
 * Defaults to a linear scale if none of the other cases are found.
 * @param {String} type - type of scale to create
 * @param {Array} domain - array for specifying the domain. Expected to be in format of [min, ..., max]
 * @param {Array} range - array for specifying the range. Expected to be in format of [min, ..., max]
 * @param {Float?} padding - amount of padding between each ordinal band scale. 0 <= padding <=1
 */
export function createScale(type, domain, range, padding=0) {
    let scale;
    switch(type) {
    case scales.CATEGORICAL:
        scale = d3.scaleBand().padding([padding]);
        break;
    case scales.LINEAR:
        scale = d3.scaleLinear();
        break;
    case scales.SQRT:
        scale = d3.scaleSqrt();
        break;
    case scales.TEMPORAL:
        scale = d3.scaleTime();
        break;
    default:
        console.error(`unrecognized scale type ${type}`);
    }
    return scale.range(range).domain(domain);
}
