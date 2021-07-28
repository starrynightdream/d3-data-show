/**
 * 根据dataSet创建图表
 */
createPie = ({
    dataSet,
    outerRadius = (Math.min(window.innerHeight, window.innerWidth) /4),
    innerRadius = 0,
    margin = {
        left: 20,
        top: 20
    }
}) => {
    let svg = d3.select(`#${ID}`); 
    let pie = d3.pie()
    let formPieData = pie(dataSet);
    let per = 180/ dataSet.length;
    let colorOffset = 40;


    let arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    let arcs = svg.selectAll('g')
        .data(formPieData)
        .enter()
        .append('g')
        .attr('transform',
            `translate(${margin.left + outerRadius}, ${margin.top + outerRadius})`);

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
        .attr('d', (d) => {
            return arc(d);
        })

    paths
        .attr('fill', (d, i) => {
            return `hsl(${(i-1) * per + colorOffset}, 90%, 50%)`
        })
        .attr('transform', `rotate(170)`)
        .transition(5000)
        .ease(d3.easeCubic)
        .attr('transform', `rotate(0)`)

    paths
        .on('mouseover', function (d, i, n) {
            d3.select(this)
                .transition(300)
                .ease(d3.easeExp)
                .attr('transform', 'scale(1.1,1.1)')
        })
        .on('mouseout', function (d, i, n) {
            d3.select(this)
                .transition(300)
                .ease(d3.easeExp)
                .attr('transform', 'scale(1,1)')
        });
}