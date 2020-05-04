// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.count); });


// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#line_chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    //adding lable for x-axis
     svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text(" Year (interval of a decade) ");
    //adding lable for y-axis
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Popularity");

var dataYear = function (d) {
    return +d.Year;
};
var new_data = [[], []];

var focus = svg.append("g")
    .style("display", "none");

    

// Get the data
d3.csv("data/a1-film.csv", function(error, data) {
    if (error) throw error;

    var filmdata = [];
    data.forEach(function (d) {
        if (filmdata[d.Year] != undefined) {
            filmdata[d.Year].count++;
            filmdata[d.Year].pop += +d.Popularity;
        }
        else {
            filmdata[d.Year] = [];
            filmdata[d.Year].year = d.Year;
            filmdata[d.Year].count = 1;
            filmdata[d.Year].pop = +d.Popularity;
        }
    });
    var max_year = d3.max(data, dataYear);
    var min_year = d3.min(data, dataYear) - 1;
    for (var i = min_year; i < max_year + 1; i++) {
        var tmp1 = [];
        var tmp2 = [];
        tmp1.date = parseTime(i + "");
        tmp2.date = parseTime(i + "");

        if (filmdata[i] != undefined) {
            tmp1.count = filmdata[i].count;
            tmp2.count = filmdata[i].pop / filmdata[i].count;
        }
        else {
            tmp1.count = 0;
            tmp2.count = 0;
        }
        new_data[0].push(tmp1);
        new_data[1].push(tmp2);
    }
    var max1 = d3.max(new_data[0], function (d) {
        return d.count;
    });
    var max2 = d3.max(new_data[1], function (d) {
        return d.count;
    });

    var axis_data = [];
    if (max1 > max2) {
        axis_data = new_data[0];
    }
    else {
        axis_data = new_data[1];
    }
    // Scale the range of the data
    x.domain(d3.extent(new_data[0], function(d) { return d.date; }));
    y.domain([0, d3.max(axis_data, function(d) { return d.count; })]);

    // Add the valueline path.
    var color = ["steelblue", "red"];
    var name = ["movies", "average popularity"];
    

    for (var i = 0; i < 2; i++) {
        svg.append("path")
            .data([new_data[i]])
            .attr("class", "line")
            .attr("stroke", color[i])
            .attr("fill", "none")
            .attr("d", valueline);
        svg.append("text")
            .datum(new_data[i][new_data[1].length - 1])
            .attr("class", "title")
            .attr("transform", function (d) {
                return "translate(" + x(d.date) + "," + y(d.count) + ")";
            })
            .attr("x", 3)
            .attr("dy", ".15em")
            .style("text-anchor", "end")
            .text(name[i]);
    }
    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
// add the Y gridlines
        svg.append("g")			
        .attr("class", "grid")
        .call(d3.axisLeft(y)
        	.tickSize(-width)
          .tickFormat("")
          .ticks(6)
        );
});
