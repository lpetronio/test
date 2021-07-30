import * as d3 from "d3";
import * as sampleUtils from "./utils/sample-data";
import * as randomPt from "./utils/pt-random";
import * as scrollController from "./controllers/scrollController";


function createDataPromises(promises) {

    Promise.all([

        d3.csv(promises.risk, function(d){
          return {
            risk: +d["RelativeRisk"],
            percentile: +d["Percentile"]
          }
        })        
      ]).then((resp) => {
            const promiseData = {
                risk: resp[0]
            };

        const sampleConfig = {
            associated: 20,
            non_associated: 60,
            positions:80
        } 
        const SampleData = sampleUtils.createSampleData(sampleConfig, promiseData.risk, undefined)
        // const masterData = {
        //   sampleData: SampleData
        // }
        const language =  promises.language
        scrollController.init(SampleData, language)

        
    });
}





export{
    createDataPromises
}




