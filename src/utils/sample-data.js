import * as d3 from "d3";
import * as testUtils from "./test-utils";
/**
 * 
 * @param {*} config defines number of associated positions and non_associated positions.
 *                    From Promises.js and is only called once
 * @param {*} data percentile, risk -> determines ratio of pos/neg
 */


function createSampleData(config, data, verbose = testUtils.verbose){

    const gwas = generateGwas(config) // defines unique positions (copies are irrelevant. copies only apply to an individual, defining it based on ratio)

    // let riskDomain = [0.2, 1, 4.75]
    let riskDomain = [0, 1, 5]
    let riskScale = d3.scaleLinear().domain(riskDomain).range([2, config.associated/2, config.associated]) //two copies of position per person. from the perspective of positive associated

   let sample = data.map((d, i)=>{  // each person
        d.id = i
        // below is based on associated*2
        let pos = Math.round(riskScale(d.risk));
        let neg = Math.round(config.associated - pos);

        let associated1 = [];
        for (let ap = 0; ap < pos; ap++){  associated1.push({effect:"positive", type: "associated", copy:1, sort_order: 0})  } // do this after making two copies of each row, define relation by map, apply effect by count for a only
        for (let an = 0; an < neg; an++){  associated1.push({effect:"negative", type: "associated", copy:1, sort_order: 1})  }
        associated1.forEach((e, i) => {  e.position = gwas.associated[i] }) // assigns row to each  


        let associated2 = [];
        for (let ap = 0; ap < pos; ap++){  associated2.push({effect:"positive", type: "associated", copy:2, sort_order:0})  } // do this after making two copies of each row, define relation by map, apply effect by count for a only
        for (let an = 0; an < neg; an++){  associated2.push({effect:"negative", type: "associated", copy:2, sort_order:1})  }
      
        d3.shuffle(associated2)
        associated2.forEach((e, i) => {  e.position = gwas.associated[i] }) // assigns row to each  

        // check the use of multiplying asociated by 2. Eventually might want to make 2 separate copies with same ratios to avoid confision
        let non_associated1 = [];
        for (let nu = 0; nu < config.non_associated; nu++){ non_associated1.push({effect:"neutral", type: "non-associated", copy:1, sort_order:3}) }
        non_associated1.forEach((e, i) => {  e.position = gwas.non_associated[i] }) // assigns row to each  

        // check the use of multiplying asociated by 2. Eventually might want to make 2 separate copies with same ratios to avoid confision
        let non_associated2 = [];
        for (let nu = 0; nu < config.non_associated; nu++){ non_associated2.push({effect:"neutral", type: "non-associated", copy:2, sort_order:3}) }
        non_associated2.forEach((e, i) => {  e.position = gwas.non_associated[i] }) // assigns row to each  

        let values = associated1.concat(associated2, non_associated1, non_associated2)
       // values.sort(function(a, b){ return d3.descending(a.sort_order, b.sort_order)})
        values.forEach(function(e, j){ 
            e.effect_size = Math.random()
            // e.id = j 
        })

        return {
            // id: i,
            percentile: d.percentile,
            values: values,
            numpos: associated2.length
        }
    })

    if (verbose) {
        console.log("sample data", sample)
    }

    return sample
}

// function getRandomInt(max) {
//     return Math.floor(Math.random() * Math.floor(max));
//   }
  
function generateGwas(config){
    let ass = generateAssociatedPositions(config.positions, config.associated)
    let nonass = generateNonAssociatedPositions(config.positions, ass)
    return {associated: ass, non_associated: nonass}
}

function generateAssociatedPositions(t, n){
    var arr = [];
    while(arr.length < n){ // divide by 2 because we count rows here
        var r = Math.floor(Math.random() * t) + 1;
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    return arr
}

function generateNonAssociatedPositions(t, c){
    let arr = [...Array(t).keys()] // create array of numbers from 0 - n
    let result = arr.filter(i => !c.includes(i))
    return result
}



export{
    createSampleData
}