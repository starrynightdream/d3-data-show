/*
 * @Author: SND 
 * @Date: 2021-07-27 17:33:38 
 * @Last Modified by: SND
 * @Last Modified time: 2021-07-29 20:52:23
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
    param: null,
    cData: (data) => {},
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
    enterType: d3.easeQuad,
    changeType: d3.easeQuad,
    rectReadyInit: {},
    rectAfterInit: {},
    nameReadyInit: {},
    nameAfterInit: {},
    valueReadyInit: {},
    valueAfterInit: {},
    sort: false,
    color(d, i, arr) {
        return `hsl(${i/arr.length * 360}, 100%, 80%)`;
    },
    cName(name) {
        return name;
    },
    cValue(value) {
        return value;
    },
    formData(data) {
        let width = fastD3.width * this.widthPercent;

        let height = fastD3.height * this.heightPercent;

        let values = data.map((item) => {
            return item.value
        });
        let min = Math.min(...values); // 考虑是否可以使用最小值以减少占用空间
        let max = Math.max(...values);

        let ySacan = d3.scaleLinear()
            .domain([0, max])
            .range([0, height * (1 - this.topSpacePerHeight)]);

        let spacePerColumn = this.spacePerColumn ? this.spacePerColumn : fastD3.columnmDefault.spacePerColumn;
        let columWidth = width / ((1 + spacePerColumn) * data.length + spacePerColumn);

        let formData = [];
        data.forEach((d, i) => {

            formData.push({
                name: this.cName(d.name),
                value: this.cValue(d.value),
                width: columWidth,
                height: ySacan(d.value),
                x: i * (spacePerColumn + 1) * columWidth + spacePerColumn * columWidth,
                y: height - ySacan(d.value)
            });
        });
        return [width, height, formData];
    },
    cData(data, chart) {
        // todo: 实现默认的变化选项
        // 解析结构
        if (!data) {
            console.error('数据为空, 如果希望清空版面请传入空数组');
            return;
        }

        if (this.sort > 0) {
            // todo 升序处理数组
        } else if (this.sort < 0) {
            // todo 降序处理数组
        } else {
            // 不做变化
        }
        let that = this;
        let names = data.map((v) => {
            return v.name;
        });
        let values = data.map((v) => {
            return v.value;
        });
        let groups = chart.d3r.selectAll('g');
        // let rects = root.selectAll('g').select('rect');
        // 处理变化后的新数据
        let [width, height, formData] = this.formData(data);
        let nameToData = new Map();
        formData.forEach((d) => {

            if (d.name in nameToData) {
                nameToData[d.name].data.push(d);
            } else {
                nameToData[d.name] = {
                    index: 0,
                    data: [d],
                    getData: function () {
                        return [this.data[this.index++]];
                    }
                };
            }
        });

        let addG = groups.data(formData, (d) =>{return d.name})
            .enter()
            .append('g');

        let rects = addG.append('rect')
            .attr('width', d => {
                return d.width;
            })
            .attr('height', 0)
            .attr('x', d => {
                return d.x;
            })
            .attr('y', d => {
                return height;
            })
            .attr('fill', (d, i, arr) => {
                return this.color(d, i, arr);
            })

        for (let key of Object.keys(this.rectReadyInit)) {
            rects.attr(key, this.rectReadyInit[key]);
        }

        let afterRects = rects
            .transition(this.enterDuration)
            .ease(this.enterType)
            .attr('height', d => {
                return d.height;
            })
            .attr('y', d => {
                return d.y;
            });

        for (let key of Object.keys(this.rectAfterInit)) {
            afterRects.attr(key, this.rectAfterInit[key]);
        }

        groups.each(function (d, i, arr) {
            let idx = names.indexOf(d.name)
            if (idx != -1) {
                // 依旧存在的
                names.splice(idx, 1);
                let _d = nameToData[d.name];
                d3.select(this).data(_d);
                d3.select(this).select('rect')
                    .transition(that.changeDuration)
                    .ease(that.changeType)
                    .attr('width', (d) =>{return d.width;})
                    .attr('height', (d) =>{return d.height;})
                    .attr('x', (d) =>{return d.x;})
                    .attr('y', (d) =>{return d.y;})

            } else {
                // 不再存在的
                d3.select(this).select('rect')
                    .transition(that.changeDuration)
                    .ease(that.changeType)
                    .attr('width', 0);
                d3.select(this)
                    .transition(that.changeDuration)
                    .ease(that.changeType)
                    .remove();
            }
        });

        console.log(names)
        // chart.d3r
        //     .data(names)
        //     .enter()
        //     .append('g')
        //     .append('rect');

        // 绘制变化同时应用过渡
        // 处理结构
        chart.data = data;
        chart.param = this;
        return chart;
    },
}

fastD3.column = (data, param = fastD3.columnmDefault) => {

    if (!fastD3.check()) {
        console.error(fastD3.error());
    }
    // 数据处理部分
    let [width, height, formData] = param.formData(data);
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
            return d.width;
        })
        .attr('height', 0)
        .attr('x', d => {
            return d.x;
        })
        .attr('y', d => {
            return height;
        })
        .attr('fill', (d, i, arr) => {
            return param.color(d, i, arr);
        })

    for (let key of Object.keys(param.rectReadyInit)) {
        rects.attr(key, param.rectReadyInit[key]);
    }

    let afterRects = rects
        .transition(param.enterDuration)
        .ease(param.enterType)
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
    let aColum = {
        ...Chart
    };
    aColum.data = data;
    aColum.cData = function (_data) {
        param.cData(_data, this);
    };
    aColum.param = param;
    aColum.d3r = colRoot;

    return aColum;
}