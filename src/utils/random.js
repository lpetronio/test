
import * as d3 from "d3";
const transition = 100;
const dy = 14;
const dyMd = 20;
const dyLg = 34;

function makeSet(data, field){
    var set = [...new Set(data.map(d => d[field] ))];
    return set
  }

function ConvertToDecimal(num) {
    num = num.toString(); //If it's not already a String
    num = num.slice(0, (num.indexOf(".")) + 3); //With 3 exposing the hundredths place
    return  Number(num); //If you need it back as a Number    
}

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
    this.parentNode.appendChild(this);
    });
};
d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

export {
    transition,
    dy,
    dyMd,
    dyLg,
    ConvertToDecimal

}