function makeSet(data, field){
    var set = [...new Set(data.map(d => d[field] ))];
    return set
  }

function ConvertToDecimal(num) {
    num = num.toString(); //If it's not already a String
    num = num.slice(0, (num.indexOf(".")) + 3); //With 3 exposing the hundredths place
    return  Number(num); //If you need it back as a Number    
}

// d3.select(this.parentNode) t

const obj = {};
for (const key of array) {
    obj[key] = "";
    obj["effect"] = "positive";
    obj["relation"] = "associated";
}



function initPair(config){
    const sampleData = createSampleData(config, config.promise); // all percentiles
    const plotData = createPlotData(config, sampleData)
    updatePairData(config, plotData)
    config.plotConfigs = plotData;
}

function initStack(config){
    const sampleData = createSampleData(config, config.promise); // all percentiles
    const plotData = createPlotData(config, sampleData);
    const stackData = createStackData(config, plotData);
    updateStackData(config, stackData)
    config.plotConfigs = plotData;
}

function createSampleData(config, data){

    let riskDomain = [0.2, 1, 4.75]
    let riskScale = d3.scaleLinear().domain(riskDomain).range([0, config.plotConfigs.grid.associated_rows, config.plotConfigs.grid.associated_rows*2])

    data.forEach((d, i)=>{  // each person
        d.id = i;
        d.name = `percentile ${d.percentile}`;
        d.pos = Math.round(riskScale(d.risk));
        d.neg = Math.round(config.plotConfigs.grid.associated_rows*2 - d.pos);
        d.values = updateDataValues(d.pos, d.neg)
    })
    return data
}
function updateDataValues(pos, neg){
    let values = [];
    for (let p = 0; p < pos; p++){
        values.push({effect:"pos"})
    }
    for (let n = 0; n < neg; n++){
        values.push({effect:"neg"})
    }
    return d3.shuffle(values)
}


/**
 * 
 * pairData is based on gwas
 * pairs get 'row': N by iterating through 'pos':[ a list of random numbers between 0 - 499 ] and assigning the value in 'pos' to row: i
 * For 'neg' rows, createPair? Can I make a function create 1 pair at a time, and put it into array with for loop in main function?
 */
function createPlotData(config, data){
    let mockData = createDiseaseData(config.plotConfigs.grid.rows, config.plotConfigs.grid.associated_rows) // associated should be rows. for num varaitns, muyltiply by 2
    data.forEach( (d) => { // each individual
        let rows = d.values.map((n, i, arr) => ( {columns: [n, arr[i + 1]] } ) )
            .filter((n, i) => i % 2 === 0);
        rows.forEach( (e, i) => {

            e.relation = "associated",
            e.row = mockData.associated[i]
            e.columns.forEach( (f, j) => {
                f.row = e.row
                f.column = j
                f.relation = "associated"
            })
        })
        // move the stuff below into the "update" funciton
         d.data = rows.concat(mockData.non_associated).sort((a, b)=> d3.ascending(a.row, b.row));
         delete d.values
    })
    return data;
}

function createStackData(config, data){
    data.forEach((plot)=> {
        let stack = []
        plot.data.forEach((row)=>{
            row.columns.forEach((column)=>{
                stack.push({effect: column.effect, columns: [column]})
            })
        })
        plot.stack = stack
    })
    data.forEach((plot)=>{
        let s = plot.stack.filter(function(a){ return a.effect != "neu"}).sort(function(a, b){
            return d3.descending(a.effect, b.effect)
        })
        s.forEach(function(d, i){
            d.row = i;
            d.relation = "associated";
        })
        plot.stack = s;
    // delete plot.data;
      //  plot.data = plot.stack;
        // config.plotConfigs.grid.rows = config.grid.plotConfigs.grid.associated_rows*2
        // config.plotConfigs.grid.columns = 1
    })
    return data
}


function updatePlotData(config, data){ // add xy values
    data.forEach((d, i)=>{
        d.type = config.plotConfigs.type,
        d.padding = config.plotConfigs.padding;
        d.grid = {
            rows: config.plotConfigs.grid.rows,
            columns:2
        }
        d.row = 0;
        d.column = i;
        d.label = {plot: `${d.percentile}`};
    })
}

function updatePairData(config, data){
    data.forEach((d, i)=>{

        d.type = config.plotConfigs.type,
        d.padding = config.plotConfigs.padding;
        d.grid = {
            rows: config.plotConfigs.grid.rows,
            columns:2
        }
        d.row = 0;
        d.column = i;
        d.label = {plot: `${d.percentile}`};
    })
}

function updateStackData(config, data){ // add xy values
    data.forEach((d, i)=>{
        d.type = config.plotConfigs.type,
        d.padding = config.plotConfigs.padding;
        d.grid = {
            rows: config.grid.plotConfigs.grid.rows, // change
            columns:1
        }
        d.row = 0;
        d.column = i;
        d.label = {plot: `${d.percentile}`};
    })
}


function createDiseaseData(n, associated){
    let array = [...Array(n).keys()] // create array of numbers from 0 - n
    let obj = {}
    d3.shuffle(array)

    obj["associated"] = array.filter((d, i)=> i <= associated - 1 )
    obj["non_associated"] = array.filter((d, i)=> i > associated - 1 )
    let parse = obj["non_associated"].map((d)=> {
        return {
            relation: "non_associated",
            row: d,
            columns: [
                {row:d, column:0, relation: "non_associated", effect:"neu"}, 
                {row:d, column:1, relation: "non_associated", effect:"neu" }]
        }
    }).sort((a, b)=> d3.ascending(a.row, b.row))
    obj["non_associated"] = parse
    return obj
 }


 // function initData(config){
//     const sampleData = createSampleData(config, config.promise); // all percentiles
//     return sampleData
// }
// function initPairLayout(config, data){
//     const plotData = createPlotData(config, data)
//     return plotData
// }
// function initStackLayout(config, data){
//     const stackData = createStackData(config, data);
//     updateStackData(config, stackData)
//     config.plotConfigs = stackData;
// }

// .attr("dy", sm_lineHeight)
// .html(function(){
//   var x = d3.select(this).attr("x");
//   var y = d3.select(this).attr("dy");
//   return  "<tspan class='san-md-black teel' x="+x+" dy="+(+y+3)+">" + percent_above_100 + "%</tspan>"
//   +"<tspan class='san-sm-light' x="+x+" dy="+(+y+3)+">from</tspan>"
//   +"<tspan class='san-sm-light' x="+x+" dy="+(+y+3)+">0-100</tspan>"
//   +"<tspan class='san-sm-light' x="+x+" dy="+(+y+3)+">meters</tspan>"
// })    
















//   export{
//       makeSet,
//       ConvertToDecimal
//   }