/*
 * @Author: SND 
 * @Date: 2021-07-27 17:33:38 
 * @Last Modified by: SND
 * @Last Modified time: 2021-07-28 20:31:59
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
    data: null,
    d3r: null,
    cData: (data) => {},
    param: (param) => {},
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
    widthPercent: 1,
    heightPercent: 1,
    spacePerColumn: 0.1,
    topSpacePerHeight: 0.05,
    lineHeight: 20,
    xOffset: 0,
    yOffset: 0,
    enterDuration: 2000,
    changeDuration: 1000,
    transitionType :d3.easeQuad,
    rectReadyInit: {},
    rectAfterInit: {},
    nameReadyInit: {},
    nameAfterInit: {},
    valueReadyInit: {},
    valueAfterInit: {},
    sort: false,
    color (d, i, arr) {
        return `hsl(${i/arr.length * 360}, 100%, 80%)`;
    },
    cName (name) {
        return [name];
    },
    cValue (value) {
        return [value];
    },
    cData (data, root) {
        // todo: 实现默认的变化选项
        // 解析结构
        if (! data){
            console.error('数据为空, 如果希望清空版面请传入空数组');
            return;
        }

        if (this.sort > 0){
            // todo 升序处理数组
        } else if (this.sort < 0) {
            // todo 降序处理数组
        } else {
            // 不做变化
        }
        let names = data.map( (v)=>{return v.name;});
        let values = data.map( (v) =>{return v.value;});
        let rects = root.selectAll('g').select('rect');
        // 处理变化后的新数据
        // 绘制变化于应用过渡
        // 处理结构
    },
}

fastD3.column = (data, param = fastD3.columnmDefault) => {

    if (!fastD3.check()) {
        console.error(fastD3.error())
    }
    // 数据处理部分
    let width = fastD3.width * param.widthPercent;

    let height = fastD3.height * param.heightPercent;

    let values = data.map((item) => {
        return item.value
    });
    let min = Math.min(...values); // 考虑是否可以使用最小值以减少占用空间
    let max = Math.max(...values);

    let ySacan = d3.scaleLinear()
        .domain([0, max])
        .range([0, height * (1 - param.topSpacePerHeight)]);

    let spacePerColumn = param.spacePerColumn ? param.spacePerColumn : fastD3.columnmDefault.spacePerColumn;
    let columWidth = width / ((1 + spacePerColumn) * data.length + spacePerColumn);

    let formData = [];
    data.forEach((d, i) => {

        formData.push({
            name: param.cName(d.name),
            value: param.cValue(d.value),
            width: columWidth,
            height: ySacan(d.value),
            x: i * (spacePerColumn + 1) * columWidth + spacePerColumn * columWidth,
            y: height - ySacan(d.value)
        });
    });

    // 绘制部分
    let colRoot = d3.select(fastD3._svg).append('g');
    // todo: 添加css样式的钩子
    let allG = colRoot.selectAll('g')
        .data(formData)
        .enter()
        .append('g');

    let rects = allG.append('rect');

    rects
        .attr('width', d => {
            return d.width
        })
        .attr('height', 0)
        .attr('x', d => {
            return d.x
        })
        .attr('y', d => {
            return height
        })
        .attr('fill',(d, i, arr) =>{ return param.color(d, i, arr);})

    for (let key of Object.keys(param.rectReadyInit)) {
        rects.attr(key, param.rectReadyInit[key]);
    }

    let afterRects = rects
        .transition(param.enterDuration)
        .ease(d3.easeQuad)
        .attr('height', d => {
            return d.height;
        })
        .attr('y', d => {
            return d.y;
        });

    for (let key of Object.keys(param.rectAfterInit)) {
        afterRects.attr(key, param.rectAfterInit[key]);
    }

    // 结构处理
    let aColum = {...Chart};
    aColum.data = data;
    aColum.cData = (_data) =>{
        param.cData(_data, aColum.d3r);
    };
    aColum.param = param;
    aColum.d3r = colRoot;

    return aColum;
}