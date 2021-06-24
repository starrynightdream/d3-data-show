// let svg = d3.selectAll('svg');
// let data = [1, 2, 3, 4];

// let circle = svg.selectAll("circle").data(data) // UPDATE
//     .attr("r", 25)
//     .style("fill", "blue")
//     .lower('g')

// circle.exit().remove(); // EXIT

// data.push(3)

// circle = circle.enter().append("circle") // ENTER
//     .attr("r", 25)
//     .style("fill", "green")
//   .merge(circle) // ENTER + UPDATE
//     .attr("r", 25)
//     .style("stroke", "black");

var data = [
  {name: "Locke", number: 4},
  {name: "Reyes", number: 8},
  {name: "Ford", number: 15},
  {name: "Jarrah", number: 16},
  {name: "Shephard", number: 31},
  {name: "Kwon", number: 34}
];

d3.selectAll("div")
  .data(data, function(d) { return d ? d.name : this.id; })
    .text(function(d) { return d.number; });