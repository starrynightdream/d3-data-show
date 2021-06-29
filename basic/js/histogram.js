let data = [1,2,3,2];
let histogram = d3.histogram()
    .value(data);

// var histogram = d3.histogram()
//     .domain(x.domain())
//     .thresholds(x.ticks(20));