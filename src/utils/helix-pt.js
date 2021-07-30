import * as d3 from "d3";
import * as colorUtils from "./colors"


//var counter;

function createHelixPt(config){

    config.scale = {
        torsion: d3.scaleLinear().domain([0, 1]).range([.4, 0]), // e.progress in domain
    }
    
    if (config.scroll.rotate == true){
        if(config.scroll.dir == "FORWARD"){
            config.scroll.counter = config.scroll.counter+1
        } else {
            config.scroll.counter = config.scroll.counter-1
        }
    } else {
        config.scroll.counter = config.scroll.counter
    }

    var data = d3.range(config.grid.rows).map(function (d, i) {
         var t = d * config.scale.torsion(config.scroll.prog) - config.scroll.speed * config.scroll.counter;
        
        return [
            {
                row: i, 
                y: d,
                // x: Math.cos(t - Math.PI),
                // z: Math.sin(t - Math.PI),
                x: Math.cos(t - Math.PI),
                z: Math.sin(t),
                fill: colorUtils.helix.fill,
                stroke: colorUtils.helix.stroke,
                column:0
            },
            {
                row: i, 
                y: d,
                x: Math.cos(t),
                z: Math.sin(t - Math.PI),
                // z: Math.cos(t - Math.PI),
                fill: colorUtils.helix.fill,
                stroke: colorUtils.helix.stroke,
                column:1
            }


        ]
    });

    return data

}


export{
    createHelixPt
}