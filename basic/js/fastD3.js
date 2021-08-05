/*
 * @Author: SND 
 * @Date: 2021-07-27 17:33:38 
 * @Last Modified by: SND
 * @Last Modified time: 2021-08-05 12:16:11
 */
// 前置依赖是d3.js 请在使用前导入。
// todo: 添加一个快速放置文字的接口。

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
    _formPercent() {},
    _arcDraw() {},
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

fastD3.cData = function(width, height) {
    this.width = width;
    this.height = height;
    return this;
}

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

fastD3.textDefault = {
    widthPercent: -1,
    heightPercent: -1,
    xOffset: 0,
    yOffset: 0,
    lineHeight: 20,
    fontSize: 20,
    fontLeft: 0,
    enterDuration: 2000,
    changeDuration: 1000,
    enterType: d3.easeQuad,
    changeType: d3.easeQuad,
    textReadyInit: {},
    textAfterInit: {},
    fontColor() {
        return 'black';
    },
    setText: (d) => {
        return d.name;
    },
    formData(data) {
        let numCount = 0;
        let linCount = 0;
        if (typeof data === 'object') {
            // 处理系列数组
            for (let s of data) {
                numCount = Math.max(numCount, s.length);
            }
            linCount = data.length;
        } else if (typeof data === 'string'){
            // 单个字符串
            numCount = data.length;
            linCount = 1;
            data = [data];
        } else {
            data = [data + ''];
            numCount = data[0].length;
            linCount = 1;
        }

        let width = 0;
        let height = 0;
        if (this.widthPercent < 0) {
            // 计算需要的宽度
            width = this.fontSize  * numCount;
        } else {
            width = fastD3.width * this.widthPercent;
        }

        if (this.heightPercent < 0) {
            // 计算需要的宽度
            height = (this.lineHeight + this.fontSize) * linCount;
        } else {
            height = fastD3.height * this.heightPercent;
        }

        let xoff = fastD3.width * this.xOffset;
        let yoff = fastD3.height * this.yOffset;

        let uniform = {};

        let formData = [];
        data.forEach((_d, i) => {

            formData.push({
                text: _d,
                x: this.fontLeft + xoff,
                y: i * this.lineHeight + yoff,
                width: _d.length * (this.fontSize + 1),
            });
        });
        return [width, height, formData, xoff, yoff, uniform];
    },
    cData(data, chart) {
        // 解析结构
        if (!data) {
            console.error('数据为空, 如果希望清空版面请传入空数组');
            return;
        }

        let that = this;
        // 处理变化后的新数据
        let [width, height, formData, xoff, yoff, uniform] = this.formData(data);
        chart.d3r.select(`#${chart._id}mask`).select('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('x', xoff)
            .attr('y', yoff);

        let groups = chart.d3r.select('.fastD3TextRoot').selectAll('.fastD3TextItem');

        // 绘制变化同时应用过渡
        groups.data(formData, (d) => {
                return d.text;
            })
            .enter()
            .append('tspan')
            .attr('class', 'fastD3TextItem') // 变化
            .text(d=>{return d.text;})
            .attr('fill', that.fontColor)
            .attr('x', d=>{return d.x - d.width;})
            .attr('y', d=>{return d.y;})
            .attr('dy', that.lineHeight)
            .transition(this.changeDuration)
            .ease(this.changeType)
            .attr('x', d=>{return d.x;});

        let delG = groups.data(formData, (d) => {
                return d.text;
            })
            .exit();


        delG
            .transition(this.changeDuration)
            .ease(this.changeType)
            .attr('x', d=>{return d.x + d.width;})
            .remove();


        let texts = formData.map((d) =>{return d.text;})
        groups.each( function(d) {
            let idx = texts.indexOf(d.text);
            if (idx != -1) {
                texts.splice(idx, 1);
                let selfSelector = d3.select(this);
                selfSelector
                    .transition(that.changeDuration)
                    .ease(that.changeType)
                    .attr('x', d=>{return d.x;})
                    .attr('y', d=>{return d.y;})
            }
        });

        // 处理结构
        chart.data = data;
        chart.param = this;
        return chart;
    },
}

fastD3.text = function (data, param) {
    // 快速加入方便变更位置和内容的文字对象
    if (!fastD3.check()) {
        console.error(fastD3.error());
    }
    data = [...data];
    // 绘制部分, 绘制空表
    let colRoot = d3.select(fastD3._svg).append('g');
    let oid = fastD3.onlyId();
    colRoot.attr('id', oid);
    colRoot.append('defs').append('mask')
        .attr('id', `${oid}mask`)
        .append('rect')
        .attr('fill', '#ffffff');
    colRoot.append('text').attr('class', 'fastD3TextRoot')
            .attr('style', `dominant-baseline:middle;text-anchor:start;mask:url(#${oid}mask)`);
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

/**
 * 处理数据，获取百分比值
 * @param {Array} data 待处理的数据
 * @param {Function} getter 获取键的函数
 * @param {Function} setter 设定值的函数
 * @returns 处理得到的数据，同时传入的参数也同理是会改变的。
 */
fastD3._formPercent = function (data, getter = (d) => {
    return d._value
}, setter = (d, start, end) => {
    d.start = start;
    d.end = end;
    return d;
}) {
    let fd = [...data];
    // 根据传入的数据计算比例
    let sum = 0;
    data.forEach((d) => {
        sum += getter(d);
    });
    let recodeDeg = 0;
    if (sum === 0) sum = 1;
    for (let i in data) {
        let d = fd[i];
        let deg = getter(d) / sum;
        fd[i] = setter(d, recodeDeg, recodeDeg + deg);
        recodeDeg += deg;
    }
    return fd;
}

/**
 * 获取可以扇形绘制的路径的函数
 * @param {Number} outter 外半径
 * @param {Number} intter 内半径
 * @param {Function} getter 获取键的函数
 * @returns 绘制的路径的函数
 */
fastD3._arcDraw = function (outter, intter = 0, getter = (d) => {
    return d;
}) {
    return (d) => {
        d = getter(d);
        let precent = d.end - d.start;
        // 根据对象生成路径t
        let ang = Math.PI * 2 * precent;
        return `M${Math.sin(ang) * intter} ${Math.cos(ang) * intter}` +
            ` A ${intter} ${intter} 0 0 ${precent > 0.5 ? 1 : 0} 0 ${intter}` + // 内弧形
            ` L 0 ${outter}` + // 左侧
            ` A ${outter} ${outter} 0 0 ${precent > 0.5 ? 1 : 0} ` +
            `${Math.sin(ang) * outter} ${Math.cos(ang) * outter}` + // 外弧形
            ' Z';
    };
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
    textPullAng: 20,
    enterDuration: 2000,
    changeDuration: 1000,
    enterType: d3.easeQuad,
    changeType: d3.easeQuad,
    pieReadyInit: {},
    pieAfterInit: {},
    textReadyInit: {},
    textAfterInit: {},
    sort: null,
    fontColor() {
        return 'black';
    },
    color(d, i, arr) {
        return `hsl(${i/arr.length * 360}, 100%, 80%)`;
    },
    setText: (d) => {
        return d.name;
    },
    formData(data) {
        let width = fastD3.width * this.widthPercent;
        let height = fastD3.height * this.heightPercent;

        let xoff = fastD3.width * this.xOffset;
        let yoff = fastD3.height * this.yOffset;

        let chartHeight = height * (1 - this.topSpacePerHeight - this.bottomSpacePerHeight);

        let outer = Math.min(width, chartHeight) * this.outerRadiusPerSize / 2;
        let inner = outer * this.innerRadiusPerOuter;
        let arc = fastD3._arcDraw(outer, inner);
        let uniform = {};
        uniform.arc0 = arc({
            start: 0,
            end: 0
        });
        uniform.outer = outer;
        uniform.inner = inner;

        let formData = [];
        data.forEach((_d, i) => {

            formData.push({
                name: _d.name,
                value: _d.value,
                _value: _d.value,
                text: this.setText(_d, i),
                x: 0,
                y: 0,
            });
        });
        fastD3._formPercent(formData);
        formData.forEach(_d => {
            _d.d = arc(_d);
        });
        return [width, height, formData, xoff, yoff, uniform];
    },
    cData(data, chart) {
        // 解析结构
        if (!data) {
            console.error('数据为空, 如果希望清空版面请传入空数组');
            return;
        }

        data = [...data];
        if (this.sort) {
            data.sort(this.sort);
        }
        let that = this;
        let pull = this.textPullAng / 360;
        // 处理变化后的新数据
        let [width, height, formData, xoff, yoff, uniform] = this.formData(data);
        let groups = chart.d3r.select('.pieItemSet').selectAll('.fastD3PieItem');
        let texts = chart.d3r.select('.pieTextSet').selectAll('.fastD3PieItem');

        // 绘制变化同时应用过渡
        let addG = groups.data(formData, (d) => {
                return d.name
            })
            .enter()
            .append('g')
            .attr('class', 'fastD3PieItem')
            .attr('transform', _ => {
                return `translate(${width/2 + xoff}, ${height/2 + yoff})`;
            });
        let addGT = texts.data(formData, (d) => {
                return d.name
            })
            .enter()
            .append('g')
            .attr('class', 'fastD3PieItem')
            .attr('transform', _ => {
                return `translate(${width/2 + xoff}, ${height/2 + yoff})`;
            });

        addG.append('path')
            .attr('stroke-width', 1)
            .attr('stroke', 'white')
            .attr('d', d => {
                return d.d;
            })
            .attr('transform', () => {
                return `rotate(0)`;
            })
            .transition(this.changeDuration)
            .ease(this.changeType)
            .attr('transform', (d) => {
                return `rotate(${-d.start * 360})`;
            })
            .attr('fill', (d, i, arr) => {
                return this.color(d, i, arr);
            });

        let mid = (uniform.outer + uniform.inner) / 2;
        let tr = mid;
        addGT.append('text')
            .text(d => {
                return d.text;
            })
            .attr('font-size', 0)
            .attr('fill', (d, i, arr) => {
                return this.fontColor(d, i, arr);
            })
            .attr('style', 'dominant-baseline:middle;text-anchor:middle;')
            .attr('transform', 'translate(0,0)')
            .transition(this.changeDuration)
            .ease(this.changeType)
            .attr('font-size', this.fontSize)
            .attr('transform', (d) => {
                let ang = Math.PI * (d.start + d.end);
                if (d.end - d.start < pull) {
                    tr += this.lineHeight;
                } else {
                    tr = mid;
                }
                return `translate(${Math.sin(ang) * tr},${Math.cos(ang) * tr})`
            });

        let delG = groups.data(formData, (d) => {
                return d.name;
            })
            .exit();

        let delGT = texts.data(formData, (d) => {
                return d.name;
            })
            .exit();

        delG
            .select('path')
            .transition(this.changeDuration)
            .ease(this.changeType)
            .attr('d', uniform.arc0);

        delG
            .transition(this.changeDuration)
            .ease(this.changeType)
            .remove();

        delGT
            .select('text')
            .transition(this.changeDuration)
            .ease(this.changeType)
            .attr('font-size', '0')
            .attr('transform', 'translate(0,0)');

        delGT
            .transition(this.changeDuration)
            .ease(this.changeType)
            .remove();

        let names = data.map((v) => {
            return v.name;
        });

        groups.each(function (d, i, arr) {
            let idx = names.indexOf(d.name)
            let selfSelector = d3.select(this);
            if (idx != -1) {
                // 优化仅处理依旧存在的
                names.splice(idx, 1);
                selfSelector
                    .transition(that.changeDuration)
                    .ease(that.changeType)
                    .attr('transform', _ => {
                        return `translate(${width/2 + xoff}, ${height/2 + yoff})`;
                    });
                    
                selfSelector.select('path')
                    .transition(that.changeDuration)
                    .ease(that.changeType)
                    .attr('transform', (d) => {
                        return `rotate(${-d.start * 360})`;
                    })
                    .attr('d', d => {
                        return d.d;
                    })
                    .attr('x', (d) => {
                        return d.x;
                    })
                    .attr('y', (d) => {
                        return d.y;
                    });

            }
        });

        names = data.map((v) => {
            return v.name;
        });
        texts.each(function (d, i, arr) {
            let idx = names.indexOf(d.name)
            let selfSelector = d3.select(this);
            if (idx != -1) {
                // 优化仅处理依旧存在的
                names.splice(idx, 1);
                selfSelector
                    .transition(that.changeDuration)
                    .ease(that.changeType)
                    .attr('transform', _ => {
                        return `translate(${width/2 + xoff}, ${height/2 + yoff})`;
                    });

                selfSelector.select('text')
                    .transition(that.changeDuration)
                    .ease(that.changeType)
                    .attr('transform', (d) => {
                        let ang = Math.PI * (d.start + d.end);
                        if (d.end - d.start < pull) {
                            tr += that.lineHeight;
                        } else {
                            tr = mid;
                        }
                        return `translate(${Math.sin(ang) * tr},${Math.cos(ang) * tr})`
                    });

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
    data = [...data];
    // 绘制部分, 绘制空表
    let pieRoot = d3.select(fastD3._svg).append('g');
    let oid = fastD3.onlyId();
    pieRoot.attr('id', oid);

    pieRoot.append('g').attr('class', 'pieItemSet');
    pieRoot.append('g').attr('class', 'pieTextSet');
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
    aPie.d3r = pieRoot;

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
    needLine: false,
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

        data = [...data];
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

        // 绘制变化同时应用过渡
        let addG = groups.data(formData, (d) => {
                return d.name
            })
            .enter()
            .append('g')
            .attr('class', 'fastD3ColumItem');

        addG.append('text')
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

        addG.append('g').append('text')
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
        formData.forEach((d) => {
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
    data = [...data];
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