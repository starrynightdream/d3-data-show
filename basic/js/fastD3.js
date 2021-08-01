/*
 * @Author: SND 
 * @Date: 2021-07-27 17:33:38 
 * @Last Modified by: SND
 * @Last Modified time: 2021-08-01 10:45:35
 */
// 前置依赖是d3.js 请在使用前导入。
// 在其它地方更新了但未推送的变更有
/** 
 * 添加字体颜色函数的设定
 * 使用es6实现的导入d3与导出fastD3
 */

const fastD3 = {
    _svg: null,
    _errStack: [],
    error() {},
    width: 0,
    height: 0,
    SVG(svg) {},
    check() {},
    id: 1,
    onlyId() {},
};

// 图表类模板
const Chart = {
    _id: '',
    data: null,
    d3r: null,
    param: null,
    cData: (data) => {},
}

fastD3.error = function () {
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
fastD3.SVG = function (svg, width, height) {

    if (svg == undefined) {
        return fastD3._svg;
    } else {
        fastD3.width = width || svg.width.baseVal.value;
        fastD3.height = height || svg.height.baseVal.value;
        return fastD3._svg = svg;
    }
};

/**
 * 确认fastD3 设定正确
 * @returns 是否成功
 */
fastD3.check = function () {
    let hasSvg = fastD3._svg != null && fastD3._svg != undefined;
    if (!hasSvg) {
        fastD3._errStack.push('未完成svg面板设置');
    }

    return hasSvg;
}

fastD3.onlyId = function () {
    return `chart${this.id++}`;
}

fastD3.pieDefault = {
    widthPercent: 1,
    heightPercent: 1,
    topSpacePerHeight: 0.07,
    bottomSpacePerHeight: 0.05,
    lineHeight: 20,
    fontSize: 20,
    xOffset: 0,
    yOffset: 0,
    outerRadiusPerSize: 1,
    innerRadiusPerOuter: 0, 
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
    sort: null,
    fontColor() {
        return 'black';
    },
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
        let that = this;
        let width = fastD3.width * this.widthPercent;
        let height = fastD3.height * this.heightPercent;

        let xoff = fastD3.width * this.xOffset;
        let yoff = fastD3.height * this.yOffset;

        let values = data.map((item) => {
            return item.value
        });
        let min = Math.min(...values); // 考虑是否可以使用最小值以减少占用空间
        let max = Math.max(...values);
        let chartHeight = height * (1 - this.topSpacePerHeight - this.bottomSpacePerHeight);
        let chartBottom = height * (1 - this.bottomSpacePerHeight - this.yOffset);

        let pie = d3.pie();
        let tdata = pie(values);
        console.log(tdata);
        let outer = Math.min(width, chartHeight) * this.outerRadiusPerSize;
        let inner = outer * this.innerRadiusPerOuter;
        let arc = d3.arc()
            .innerRadius(inner)
            .outerRadius(outer);

        let formData = [];
        data.forEach((d, i) => {

            formData.push({
                name: this.cName(d.name),
                value: this.cValue(d.value),
                d: arc(tdata[i]), 
                x:0,
                y:0,
            });
        });
        return [width, height, formData, chartBottom, xoff, yoff];
    },
    cData(data, chart) {
        // 解析结构
        if (!data) {
            console.error('数据为空, 如果希望清空版面请传入空数组');
            return;
        }

        if (this.sort) {
            data.sort(this.sort);
        }
        let that = this;
        let names = data.map((v) => {
            return v.name;
        });
        let groups = chart.d3r.selectAll('.fastD3ColumItem');
        // let groups = d3.selectAll(`#${chart._id}>g`);
        // 处理变化后的新数据
        let [width, height, formData, chartBottom, xoff, yoff] = this.formData(data);
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

        // 绘制变化同时应用过渡
        let addG = groups.data(formData, (d) => {
                return d.name
            })
            .enter()
            .append('g')
            .attr('class', 'fastD3PieItem');
        
        let delG = groups.data(formData, (d) =>{
            return d.name;
        })
        .exit();

        delG
            .select('path')
            .transition(this.changeDuration)
            .ease(this.changeType)
            .attr('d', `M${width/2 + this.xoff} ${height/2 + this.yoff}`)

        addG.append('path')
            .attr('d', d=>{return d.d;})
            .attr('fill', 'white');

        // todo；未正确显示扇形图

        groups.each(function (d, i, arr) {
            let idx = names.indexOf(d.name)
            let selfSelector = d3.select(this);
            if (idx != -1) {
                // 依旧存在的
                names.splice(idx, 1);
                let _d = nameToData[d.name];

                selfSelector.select('path')
                    .transition(that.changeDuration)
                    .ease(that.changeType)
                    .attr('d', d=>{return d.d;})
                    .attr('x', (d) => {
                        return d.x;
                    })
                    .attr('y', (d) => {
                        return d.y;
                    });

            } else {
                // 不再存在的
                // selfSelector.select('g').select('text')
                //     .remove();
                // selfSelector.select('text')
                //     .remove();
                // selfSelector.select('rect')
                //     .transition(that.changeDuration)
                //     .ease(that.changeType)
                //     .attr('width', 0);
                // selfSelector
                //     .transition(that.changeDuration)
                //     .ease(that.changeType)
                //     .remove();
            }
        });

        // 处理结构
        chart.data = data;
        chart.param = this;
        return chart;
    },
}

fastD3.pie = (data, param = fastD3.pieDefault) => {

    if (!fastD3.check()) {
        console.error(fastD3.error());
    }
    // 数据处理部分
    let [width, height, formData] = param.formData(data);
    // 绘制部分, 绘制空表
    let colRoot = d3.select(fastD3._svg).append('g');
    let oid = fastD3.onlyId();
    colRoot.attr('id', oid);
    // 结构处理
    let aPie = {
        ...Chart
    };
    aPie._id = oid;
    aPie.data = data;
    aPie.cData = function (_data) {
        param.cData(_data, this);
    };
    aPie.param = param;
    aPie.d3r = colRoot;

    param.cData(data, aPie); // 延后绘制

    return aPie;
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

fastD3.columnDefault = {
    widthPercent: 1,
    heightPercent: 1,
    spacePerColumn: 0.1,
    topSpacePerHeight: 0.07,
    bottomSpacePerHeight: 0.05,
    lineHeight: 20,
    fontSize: 20,
    xOffset: 0,
    yOffset: 0,
    enterDuration: 2000,
    changeDuration: 1000,
    needLine : false,
    enterType: d3.easeQuad,
    changeType: d3.easeQuad,
    rectReadyInit: {},
    rectAfterInit: {},
    nameReadyInit: {},
    nameAfterInit: {},
    valueReadyInit: {},
    valueAfterInit: {},
    sort: null,
    fontColor() {
        return 'black';
    },
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
        let that = this;
        let width = fastD3.width * this.widthPercent;
        let height = fastD3.height * this.heightPercent;

        let xoff = fastD3.width * this.xOffset;
        let yoff = fastD3.height * this.yOffset;

        let values = data.map((item) => {
            return item.value
        });
        let min = Math.min(...values); // 考虑是否可以使用最小值以减少占用空间
        let max = Math.max(...values);
        let chartHeight = height * (1 - this.topSpacePerHeight - this.bottomSpacePerHeight);
        let chartBottom = height * (1 - this.bottomSpacePerHeight - this.yOffset);

        let ySacan = d3.scaleLinear()
            .domain([0, max])
            .range([0, chartHeight]);

        let spacePerColumn = this.spacePerColumn ? this.spacePerColumn : fastD3.columnmDefault.spacePerColumn;
        let columWidth = width / ((1 + spacePerColumn) * data.length + spacePerColumn);

        let formData = [];
        data.forEach((d, i) => {

            formData.push({
                name: this.cName(d.name),
                value: this.cValue(d.value),
                width: columWidth,
                height: ySacan(d.value),
                x: i * (spacePerColumn + 1) *
                    columWidth + spacePerColumn * columWidth +
                    xoff,
                y: (height - ySacan(d.value) -
                    that.topSpacePerHeight * height +
                    yoff)
            });
        });
        return [width, height, formData, chartBottom, xoff, yoff];
    },
    cData(data, chart) {
        // 解析结构
        if (!data) {
            console.error('数据为空, 如果希望清空版面请传入空数组');
            return;
        }

        if (this.sort) {
            data.sort(this.sort);
        }
        let that = this;
        let names = data.map((v) => {
            return v.name;
        });
        let groups = chart.d3r.selectAll('.fastD3ColumItem');
        // let groups = d3.selectAll(`#${chart._id}>g`);
        // 处理变化后的新数据
        let [width, height, formData, chartBottom, xoff, yoff] = this.formData(data);
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

        // 绘制变化同时应用过渡
        let addG = groups.data(formData, (d) => {
                return d.name
            })
            .enter()
            .append('g')
            .attr('class', 'fastD3ColumItem');

        let nameG = addG.append('text')
            .attr('', function (d) {
                let selfSelector = d3.select(this);
                if (typeof d.name === 'object') {
                    // 添加文字换行
                } else {
                    // 正经文字展示
                    selfSelector.text(d.name);
                }
            })
            .attr('x', d => {
                return d.x + d.width / 2;
            })
            .attr('y', d => {
                return d.y + d.height + this.lineHeight;
            })
            .attr('font-size', this.fontSize)
            .attr('fill', (d, i, arr) => {
                return this.fontColor(d, i, arr);
            })
            .attr('style', 'dominant-baseline:middle;text-anchor:middle;');

        let valueG = addG.append('g').append('text')
            .attr('', function (d) {
                let selfSelector = d3.select(this);
                if (typeof d.value === 'object') {
                    // 添加文字换行
                } else {
                    // 正经文字展示
                    selfSelector.text(d.value);
                }
            })
            .attr('font-size', this.fontSize)
            .attr('x', d => {
                return d.x + d.width / 2;
            })
            .attr('y', d => {
                return d.y - that.lineHeight;
            })
            .attr('fill', (d, i, arr) => {
                return this.fontColor(d, i, arr);
            })
            .attr('style', 'dominant-baseline:middle;text-anchor:middle;');

        let rects = addG.append('rect')
            .attr('width', d => {
                return d.width;
            })
            .attr('height', 0)
            .attr('x', d => {
                return d.x;
            })
            .attr('y', d => {
                return d.height + d.y;
            })
            .attr('fill', (d, i, arr) => {
                return this.color(d, i, arr);
            });

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
            let selfSelector = d3.select(this);
            if (idx != -1) {
                // 依旧存在的
                names.splice(idx, 1);
                let _d = nameToData[d.name];
                selfSelector.select('text')
                    .transition(that.changeDuration)
                    .ease(that.changeType)
                    .text(d => d.name)
                    .attr('x', d => {
                        return d.x + d.width / 2;
                    })
                    .attr('y', d => {
                        return d.y + d.height + that.lineHeight;
                    });

                selfSelector.select('g').select('text')
                    .transition(that.changeDuration)
                    .ease(that.changeType)
                    .text(d => d.value)
                    .attr('x', d => {
                        return d.x + d.width / 2;
                    })
                    .attr('y', d => {
                        return d.y - that.lineHeight;
                    });

                selfSelector.select('rect')
                    .transition(that.changeDuration)
                    .ease(that.changeType)
                    .attr('width', (d) => {
                        return d.width;
                    })
                    .attr('height', (d) => {
                        return d.height;
                    })
                    .attr('x', (d) => {
                        return d.x;
                    })
                    .attr('y', (d) => {
                        return d.y;
                    });

            } else {
                // 不再存在的
                selfSelector.select('g').select('text')
                    .remove();
                selfSelector.select('text')
                    .remove();
                selfSelector.select('rect')
                    .transition(that.changeDuration)
                    .ease(that.changeType)
                    .attr('width', 0);
                selfSelector
                    .transition(that.changeDuration)
                    .ease(that.changeType)
                    .remove();
            }
        });

        let nPath = '';
        formData.forEach( (d)=>{
            nPath += `L${d.x + d.width/2} ${d.y} `;
        });

        nPath = nPath.replace('L', 'M');
        let line = chart.d3r.select('path');
        let _d = line.attr('d');
        line.remove();
        line = chart.d3r.append('path');

        line
            .attr('d', _d)
            .transition(this.changeDuration + 10)
            .ease(this.changeType)
            .attr('d', nPath)
            .attr('fill', 'rgba(0,0,0,0)')
            .attr('stroke-width', 2)
            .attr('stroke', 'white');

        line.text('reflesh');

        // 处理结构
        chart.data = data;
        chart.param = this;
        return chart;
    },
}

fastD3.column = (data, param = fastD3.columnDefault) => {

    if (!fastD3.check()) {
        console.error(fastD3.error());
    }
    // 数据处理部分
    let [width, height, formData] = param.formData(data);
    // 绘制部分, 绘制空表
    let colRoot = d3.select(fastD3._svg).append('g');
    let oid = fastD3.onlyId();
    colRoot.attr('id', oid);
    colRoot.append('path')
        .attr('fill', 'rgba(0,0,0,0)')
        .attr('stroke-width', 2)
        .attr('stroke', 'white');
    // 结构处理
    let aColum = {
        ...Chart
    };
    aColum._id = oid;
    aColum.data = data;
    aColum.cData = function (_data) {
        param.cData(_data, this);
    };
    aColum.param = param;
    aColum.d3r = colRoot;

    param.cData(data, aColum); // 延后绘制

    return aColum;
}