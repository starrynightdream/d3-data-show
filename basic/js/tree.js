let svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    g = svg.append("g").attr("transform", "translate(40,0)");

let tree = d3.tree()
    .size([height, width - 160]);

let stratify = d3.stratify()
    .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

d3.csv("/basic/data/flare.csv", function(error, data) {
  if (error) throw error;
    formData(data);
    // setTimeout(() => {
    //   data.push({
    //     id: 'flare.analytics.cluster.keyvalwebsite',
    //     value: 3
    //   });
    // }, 2000);
});

const formData = (data) =>{

  let root = stratify(data)
      .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });

  // 变化曲线
  let t = d3.transition()
    .duration(750)
    .ease(d3.easeLinear);

  let link = g.selectAll(".link")
    .data(tree(root).links())
    .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal()
          .x(function(d) { return d.y; })
          .y(function(d) { return height/2; }))
      .transition(t)
      .attr("d", d3.linkHorizontal()
          .x(function(d) { return d.y; })
          .y(function(d) { return d.x; }));

  let node = g.selectAll(".node")
    .data(root.descendants())
    .enter().append("g");

  node.transition(t)
      .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

  node.append("circle")
      .attr("r", 2.5);

  node.append("text")
      .attr("dy", 3)
      .attr("x", function(d) { return d.children ? -8 : 8; })
      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });
}