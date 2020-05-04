/**
 * Isaac Cho
 * This code based on the Scatterplot of Iris data sexample from https://bl.ocks.org/Jverma/076377dd0125b1a508621441752735fc
 *
 * */

var margin = {top: 30, right: 50, bottom: 40, left:40};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svg = d3.select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var xLabel = "Potassium";
var yLabel = "Sugars";

// The API for scales have changed in v4. There is a separate module d3-scale which can be used instead. The main change here is instead of d3.scale.linear, we have d3.scaleLinear.
var xScale = d3.scaleLinear()
    .range([0, width]);

var yScale = d3.scaleLinear()
    .range([height, 0]);

// square root scale.
var radius = d3.scaleSqrt()
    .range([2,5]);

// the axes are much cleaner and easier now. No need to rotate and orient the axis, just call axisBottom, axisLeft etc.
var xAxis = d3.axisBottom()
    .scale(xScale);

var yAxis = d3.axisLeft()
    .scale(yScale);

var xValue = function(d) { return +d[xLabel];};
var yValue = function(d) { return +d[yLabel];};
var xMap = function(d) { return xScale(xValue(d));};
var yMap = function(d) { return yScale(yValue(d));};
var cValue = function(d) { return d.Manufacturer;};

var color = d3.scaleOrdinal(d3.schemeCategory20);

var tooltip = d3.select("#plot").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var cerealData = [];

d3.csv('data/a1-cereals.csv', function(error, data){
    xScale.domain(d3.extent(data, xValue)).nice();
    yScale.domain(d3.extent(data, yValue)).nice();
    cerealData = data;
    //[IC] if you want to change a radius based on attribute values, please use this.
    // radius.domain(d3.extent(data, function(d){
    //     return d.PetalLength;
    // })).nice();

    // adding axes is also simpler now, just translate x-axis to (0,height) and it's alread defined to be a bottom axis.
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'x axis')
        .call(xAxis);

    // y-axis is translated to (0,0)
    svg.append('g')
        .attr('transform', 'translate(0,0)')
        .attr('class', 'y axis')
        .call(yAxis);


    var bubble = svg.selectAll('.bubble')
        .data(data)
        .enter().append('circle')
        .attr('class', function(d){
            return 'bubble' + " circle_" + cValue(d);
        })
        .attr('cx', xMap)
        .attr('cy', yMap)
        // .attr('r', function(d){ return radius(d.PetalLength); })
        .attr('r', 5)
        .style('fill', function(d){
            return color(cValue(d));
        })
    .on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(d["Cereal"] + "<br/> (" + xValue(d)
            + ", " + yValue(d) + ")")
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // draw legend

    // adding label. For x-axis, it's at (10, 10), and for y-axis at (width, height-10).
    svg.append('text')
        .attr('x', 10)
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr('class', 'label')
        .attr('id', 'y_label')
        .text(yLabel);


    svg.append('text')
        .attr('x', width)
        .attr('y', height - 10)
        .attr('text-anchor', 'end')
        .attr('class', 'label')
        .attr('id', 'x_label')
        .text(xLabel);

    // I feel I understand legends much better now.
    // define a group element for each color i, and translate it to (0, i * 20).
    var legend = svg.selectAll('legend')
        .data(color.domain())
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', function(d,i){ return 'translate(0,' + i * 20 + ')'; });

    // give x value equal to the legend elements.
    // no need to define a function for fill, this is automatically fill by color.
    legend.append('rect')
        .attr('x', width)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', color)
        .on("mouseover", function(d){
            var class_name = ".circle_"+ d;
            d3.selectAll("circle").transition().duration(500).style("opacity", 0);
            d3.selectAll(class_name).transition().duration(500).style("opacity", 1);
        })
            .on("mouseout",function(d){
                d3.selectAll("circle").transition().duration(500).style("opacity", 1);
            });
    // add text to the legend elements.
    // rects are defined at x value equal to width, we define text at width - 6, this will print name of the legends before the rects.
    legend.append('text')
        .attr('x', width - 6)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(function(d){ return d; });


    // d3 has a filter fnction similar to filter function in JS. Here it is used to filter d3 components.
    legend.on('click', function(type){

    })
})
