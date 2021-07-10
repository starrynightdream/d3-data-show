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
const scane = 0.8;
const svg = d3.select('svg');

svg.attr('width', window.innerWidth * scane)
  .attr('height', window.innerHeight * scane)

let dataset = [1,2,2,2,-1,0,2,2,2];
let min = d3.min(dataset);
let max = d3.max(dataset);

let linear = d3.scaleLinear()
    .domain([min, max])
    .range([0, 300]);

console.log( linear(2));

// let from = [0,1,2,3,4,5];
let to = ['gray', 'yellow', 'green', 'blue', 'white', 'skyblue'];
let ordinal = d3.scaleOrdinal()
  // .domain(from)
  .range(to);

// console.log( ordinal(1));

// let axis = d3.axisBottom(linear);

// svg.append('g')
//   .attr('stroke', 'white')
//   .attr('fill', 'white')
//   .call(axis);

// let allCirsData = [[1,1], [1, 3], [1, 4], 
// [2, 2], [2, 3], 
// [3, 1], [3, 3], [3, 4],
// [4, 1], [4, 2], [4, 3], [4, 4]];

// let cirs1 = svg.append('g')
//   .selectAll('circle')
//   .data(allCirsData)
//   .enter()
//   .append('circle')
//   .attr('cx', (d)=>{return d[0]*100})
//   .attr('cy', (d)=>{return d[1]*100})
//   .attr('r', 20)
//   .attr('fill', "green")
//   .on('mouseover', function(d, i, n) {
//     d3.select(this)
//       .transition(100)
//       .ease(d3.easeExp)
//       .attr('r', 50);
//   })
//   .on('mouseout', function(d, i, n) {
//     d3.select(this)
//       .transition(100)
//       .ease(d3.easeExp)
//       .attr('r', 40);
//   })

// cirs1.transition()
//   .duration(1000)
//   .ease(d3.easeElastic)
//   .delay((d)=>{return d[0]*100 + 1000;})
//   .attr('fill', (d)=>{return ordinal(d[0])})
//   .attr('r', 40);
let outerRadius = 150;
let innerRadius = 10;

let pieData = [30, 10, 10, 20, 25, 5];
let pie = d3.pie()
let toPieData = pie(pieData);

let arc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(outerRadius);

let arcs = svg.selectAll('g')
  .data(toPieData)
  .enter()
  .append('g')
  .attr('transform', 
  `translate(${(window.innerWidth * scane /2)}, 
  ${(window.innerHeight* scane /2)})`)

let pathGroups = arcs
  .append('g');

pathGroups
  .attr('transform', `scale(0,0)`)
  .transition(3000)
  .ease(d3.easeCubic)
  .attr('transform', `scale(1.1,1.1)`)
  .transition(500)
  .ease(d3.easeExp)
  .attr('transform', `scale(1,1)`)

let paths = pathGroups
  .append('path')
  .attr('color', 'white')
  .attr('d', (d) =>{
    return arc(d);
  })

paths
  .attr('fill', (d,i) =>{return ordinal(i)})
  .attr('transform', `rotate(170)`)
  .transition(5000)
  .ease(d3.easeCubic)
  .attr('transform', `rotate(0)`)

paths
  .on('mouseover', function(d, i, n) {
    d3.select(this)
      .transition(300)
      .ease(d3.easeExp)
      .attr('transform', 'scale(1.1,1.1)')
  })
  .on('mouseout', function(d, i, n) {
    d3.select(this)
      .transition(300)
      .ease(d3.easeExp)
      .attr('transform', 'scale(1,1)')
  })