/**
 *  ################################################################
 * works for circles  (change color on scroll via config)
 *  ################################################################
 */
    // let circle = svg.selectAll(`.${fConfig.elementId}`).data(fConfig.plotData)

    // circle.enter()
    // .append("circle")
    // .attr("class", function(d){
    //     return `${fConfig.elementId} ${fConfig.elementId}-row-${d.row} ${fConfig.elementId}-column-${d.column}`
    // })
    // .merge(circle)
    //     .transition().duration(300)
    //     .attr("class", function(d){
    //         return `${fConfig.elementId} ${fConfig.elementId}-row-${d.row} ${fConfig.elementId}-column-${d.column}`
    //     })
    //     .attr("r", d => d.r)
    //     .attr("fill", d => d.color)
    //     .attr("cx", d => d.x)
    //     .attr("cy", d => d.y)


    // circle.exit().remove()

/**
 * ################################################################
 * works for svg:image (doent's change src on scroll via config)
 * ################################################################
 */
    // let img = svg.selectAll(`.${fConfig.elementId}`).data(fConfig.plotData)

    // img.enter()
    // .append("svg:image")
    // .attr("xlink:href", function(e){
    //     return "images/figure.svg"
    // })
    // .attr("class", function(d){
    //     return `${fConfig.elementId} ${fConfig.elementId}-row-${d.row} ${fConfig.elementId}-column-${d.column}`
    // })
    // .merge(img)
    //     .transition().duration(300)
    //     .attr("class", function(d){
    //         return `${fConfig.elementId} ${fConfig.elementId}-row-${d.row} ${fConfig.elementId}-column-${d.column}`
    //     })
    //     .attr("xlink:href", function(e){
    //         return "images/figure.svg"
    //     })
    //     .attr("width", d => d.r)
    //     .attr("x", d => d.x)
    //     .attr("y", d => d.y)

    //     img.exit().remove()


/**
 * #########################################
 * works for circles  (change color on scroll via config)
 * works for svg:image
*/ 
    // let node = svg.selectAll(`.${fConfig.elementId}`).data(fConfig.plotData)

    // node.enter()
    // .append("g")
    // .attr("class", function(d){
    //     return `${fConfig.elementId} ${fConfig.elementId}-row-${d.row} ${fConfig.elementId}-column-${d.column}`
    // })
    // .merge(node)
    //     .transition().duration(300)
    //     .attr("class", function(d){
    //         return `${fConfig.elementId} ${fConfig.elementId}-row-${d.row} ${fConfig.elementId}-column-${d.column}`
    //     })
    //     .attr("x", d => d.x)
    //     .attr("y", d => d.y)
    //     .each(function(each){
    //         let this_ = d3.select(this)
    //         this_.selectAll('circle').remove();
    //         this_.append("circle")
    //             .attr("r", d => d.r)
    //             .attr("fill", d => d.color)
    //             .attr("cx", d => d.x)
    //             .attr("cy", d => d.y)

    //             this_.selectAll('image').remove();
    //             this_.append("svg")

    //                 .attr("xlink:href", function(e){
    //                     return "images/figure-test.svg"
    //                 })
    //                 .attr("width", d => d.r)
    //                 .style("fill", d => d.color)
    //                 .attr("x", d => d.x)
    //                 .attr("y", d => d.y)

    //     })

    //     node.exit().remove()