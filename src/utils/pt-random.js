import {randomNormal} from "d3-random"; // https://observablehq.com/@d3/d3-random
import {range, extent, mean} from "d3-array";


function createNormalDistPoints(n) {
    let data = [];
    // loop to populate data array with 
    // probabily - quantile pairs
    for (let i = 0; i < n; i++) {
        let q = normal() // calc random draw from normal dist
        let p = gaussian(q) // calc prob of rand draw
        let el = {
            "q": q,
            "p": p
        }
        data.push(el)
    };
    
    data.sort(function(x, y) {
        return x.q - y.q;
    });	
    return data
    }
    
    // from http://bl.ocks.org/mbostock/4349187
    // Sample from a normal distribution with mean 0, stddev 1.
  export  function normal() {
        var x = 0,
            y = 0,
            rds, c;
        do {
            x = Math.random() * 2 - 1;
            y = Math.random() * 2 - 1;
            rds = x * x + y * y;
        } while (rds == 0 || rds > 1);
        c = Math.sqrt(-2 * Math.log(rds) / rds); // Box-Muller transform
        return x * c; // throw away extra sample y * c
    }
    
    //taken from Jason Davies science library
    // https://github.com/jasondavies/science.js/
  export  function gaussian(x) {
        var gaussianConstant = 1 / Math.sqrt(2 * Math.PI),
            mean = 0,
            sigma = 1;
    
        x = (x - mean) / sigma;
        return gaussianConstant * Math.exp(-.5 * x * x) / sigma;
    };

    /**
 * Generate a list of Point objects with values based on a normal distribution of specified mu and sigma. 
 * @param {Number} n: number of points to generate
 * @param {Boolean} verbose: to print more information
 * @param {Object?} x: describe the distribution for x {mu: mean value, sigma: sd}, 
 * @param {Object?} y: describe the distribution for y {mu: mean value, sigma: sd}
 * @returns Points[] a list of Point objects {x: a random number, y: a random number}
 */
function createRandomPointsV2(n, verbose=false, x={mu:0, sigma:2.4}, y={mu:0, sigma:2.4}){
    let points = range(0, n).map(()=>{
        let pX = randomNormal(x.mu, x.sigma)();
        let pY = randomNormal(y.mu, y.sigma)();
        return {x: pX, y:pY}
      //  return new Point(pX, pY);
    });
    if (verbose){
        let allX = points.map((d)=>d.x);
        let allY = points.map((d)=>d.y);
        console.info("V2");
        console.info(points);
        console.info(mean(allX), extent(allX));
        console.info(mean(allY), extent(allY));
    }
    return points;
}



export {
    // createRandomPoints,
    createRandomPointsV2,
    createNormalDistPoints
};
