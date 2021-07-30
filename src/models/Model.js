import * as d3 from "d3";


 function latticeModel(config, data){
    config.scale = {
        x: d3.scaleLinear().domain([0, config.plotData.length]).range([0, config.innerWidth])
    }
    data.forEach(function(d){
        d.x = config.scale.x(d.id)
        d.y = 0
    })

    return data;
}

function pairModel(config, data){

    let width = config.plotConfig.grid.width / 1.5; // wouldnt inner width fix this?
    if (width > 70){ width = 70 }
    let height = width/3;

    let x = d3.scaleLinear().domain([0, 1]).range([0, width])
    let y = d3.scaleLinear().domain([0, data.length]).range([0, height*data.length]) // 

    data.forEach(function(d, i){
        d.y = y(d.row);
        d.x = 0;
        d.column = d.column.map(function(e){
            return {
                row: d.row,
                x: x(e),
                y: d.y,
                width: width-width*.1,
                height: height
            }
        })
    })
    return data;
}



function TowerModel(config, data){

    let width = config.plotConfig.width;
    if (width > 150){ width = 150 }
//    let height = width/7;
    let height = config.plotConfig.height - config.plotConfig.padding.top  - config.plotConfig.padding.bottom;

    config.plotConfig.scale = {
        x: d3.scaleLinear().domain([0, config.plotConfig.grid.columns]).range([0, width]),
        // y: d3.scaleLinear().domain([0, config.plotConfig.grid.rows]).range([0, height*config.plotConfig.grid.rows])
        y: d3.scaleLinear().domain([0, config.plotConfig.grid.rows]).range([0, height])
    }
    data.forEach(function(d){
        d.x = config.plotConfig.scale.x(d.column)
        d.y = config.plotConfig.scale.y(d.row) 
        d.width = (width / config.plotConfig.grid.columns) *.9 
        d.height = (height / config.plotConfig.grid.rows) *.9 
    })

     return data

}



export{
    latticeModel,
    pairModel
}