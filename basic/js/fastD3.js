/*
 * @Author: SND 
 * @Date: 2021-07-27 17:33:38 
 * @Last Modified by: SND
 * @Last Modified time: 2021-07-28 11:19:00
 */
// 前置依赖是d3.js 请在使用前导入。
const fastD3 = {
    _svg: null,
    _errStack: [],
    error: () => {},
    width: 0,
    height: 0,
    SVG: (svg) => {},
    check: () => {},
    pieDefault: {},
    pie: (data, param) => {},
    histogramDefault: {},
    histogram: (data, param) => {},
    columnmDefault: {},
    column: (data, param) => {},
};

// 图表类模板
const Chart = {
    data: (data) => {},
    param: (param) => {},
    d3r: null
}

fastD3.error = () => {
    let ers = '';

    fastD3._errStack.forEach((val) => {
        ers = val + '\n' + ers;
    });
    _errStack.splice(0, ers.length);
    return ers;
}

/**
 * 设定操作的面板
 * @param {node} svg svg面板节点
 * @returns 设置后的面板节点
 */
fastD3.SVG = (svg) => {

    if (svg == undefined) {
        return fastD3._svg;
    } else {
        fastD3.width = svg.width.baseVal.value;
        fastD3.height = svg.height.baseVal.value;
        return fastD3._svg = svg;
    }
};

/**
 * 确认fastD3 设定正确
 * @returns 是否成功
 */
fastD3.check = () => {
    let hasSvg = fastD3._svg != null && fastD3._svg != undefined;
    if (!hasSvg) {
        fastD3._errStack.push('未完成svg面板设置');
    }

    return hasSvg;
}

fastD3.pie = (data, param = fastD3.pieDefault) => {

    if (!fastD3.check()) {
        console.error(fastD3.error())
    }
    // 数据处理部分
    // 绘制部分
    // 结构处理
};

fastD3.histogramDefault = {

}

/**
 * 添加直方图至svg面板
 * @param {Array} data 数据源
 * @param {Array} param 配置参数
 */
fastD3.histogram = (data, param = fastD3.histogramDefault) => {

    if (!fastD3.check()) {
        console.error(fastD3.error())
    }
    // 数据处理部分
    const histogram = d3.histogram().domain([0, 100]).value(d => {
        return d.value;
    });
    const histogramTransformData = histogram(data);
    console.log(histogramTransformData);
    // 绘制部分
    // 结构处理
};

fastD3.columnmDefault = {
    width : null,
    height : null,
    spacePerColumn : 0.1,
}

fastD3.column = (data, param = fastD3.columnmDefault) => {

    if (!fastD3.check()) {
        console.error(fastD3.error())
    }
    // 数据处理部分
    let width = 0;
    if ( !(param && param.width)) {
        width = fastD3.width;
    } else {
        width = param.width;
    }

    let height= 0;
    if ( !(param && param.height)) {
        height = fastD3.height;
    } else {
        height = param.height;
    }

    let min = 0;
    let max = 0;

    let ySacan = d3.scaleLinear()
        .domain([min, max])
        .range([0, height]);

    let spacePerColumn = param.spacePerColumn ? param.spacePerColumn : fastD3.columnmDefault.spacePerColumn;
    let columWidth = width / ((1 + spacePerColumn) * data.length + spacePerColumn);

    let formData = [];
    data.forEach( (data) =>{

    });
    // 绘制部分
    // 结构处理
}