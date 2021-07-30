
function createPairPt(config, data){

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
