const n = 100;
const duration = 1000;
const id = '#targetSVG';
let time = new Date(Date.now() - duration);
   
const random = d3.randomNormal(0, .2);
const data = d3.range(n).map(random);
    
const margin = {top: 20, right: 10, bottom: 20, left: 40};
const width = 960 - margin.right - margin.left;
const height = 150 - margin.top - margin.bottom;

const xScale = d3.scaleTime()
    .range([0, width])
    .domain([time - (n - 2) * duration, time - duration]);

const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([-1, 1]);

const line = d3.line()
    .x((d, i) => xScale(time - (n - 1 - i) * duration))
    .y((d, i) => yScale(d))
    .curve(d3.curveBasis);

const svg = d3.select(id)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

svg.append('defs')
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', width)
    .attr('height', height);

const xAxis = d3.axisBottom(xScale).ticks(15);
const yAxis = d3.axisLeft(yScale).ticks(5);

g.append('g')
    .attr('class', 'axis--x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

g.append('g')
    .attr('class', 'axis--y')
    .call(yAxis);

const transition = d3
    .transition()
    .duration(duration)
    .ease(d3.easeLinear);

   
const path = g.append('g')
    .attr('clip-path', 'url(#clip)')
    .append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .transition(transition)
    .on('start', tick);
      
let flag = true;


function tick() {
    time = new Date();
    xScale.domain([time - (n - 2) * duration, time - duration]);

    // push the accumulated count onto the back, and reset the count
    data.push(random());

    // slide the x-axis left
    d3.select('.axis--x')
    .transition(transition)
    .call(xAxis);

    // Redraw the line.
    const pa = d3.select(this)
    .attr('d', line)
    .attr('transform', null);

    const totalLength = path.node().getTotalLength();

    if (flag) {
    //判断是否是第一次渲染，是的话添加一个动画
    // Set Properties of Dash Array and Dash Offset and initiate Transition
        pa
    .attr('stroke-dasharray', totalLength + ' ' + totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition(transition) // Call Transition Method
    .attr('stroke-dashoffset', 0); // Set final value of dash-offset for transition
       
        flag = false;
    }

    // Slide it to the left.
    d3.active(this)
    .attr('transform', `translate(${xScale(time - (n - 1) * duration)})`)
    .transition(transition)
    .on('start', tick);

    // pop the old data point off the front
    data.shift();
}
