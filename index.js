/*
 * @Author: SND 
 * @Date: 2021-08-17 16:07:53 
 * @Last Modified by: SND
 * @Last Modified time: 2021-08-17 17:08:23
 */
const fastD3 = {
    _pid :0,
    _errMessage: {
        WithOutSVG: '指定的svg面板缺失',
    }
};

fastD3.onlyPid = function () {
    return this._pid++;
}

fastD3.createSVG = function (svgRoot) {
    // 创建一个用于操作SVG面板的操作对象
    if (!svgRoot) {
        console.error('请指定正确的节点');
        return null;
    }
    let handle = {
        _rKey: 'W,\'K\\gNe\"GyAnsQMV[mJ:r_YL5v.3|19>8XhOz^j*-u(C<}]#2cptHZ{I%D476dEi!w&qk;@l=+)Bo0SaxT$fbP/F?UR',
        _svg: null,
        _chartAr: [],
        _cid: 0,
        _id: fastD3.onlyPid(),
        width: 0,
        height: 0,
    }

    handle.check = function () {

        if (!this._svg) {
            console.error(fastD3._errMessage.WithOutSVG);
            return false;
        }
        return true;
    }

    handle.onlyCid = function () {
        return this._cid++;
    }

    handle.setInfo = function (width = this.width, height = this.height) {
        this.width = width || 0;
        this.height = height || 0;
        this._chartAr.forEach(c => {
            c.cData(c.data, c.param);
        });
        return this;
    }

    handle.strToNum = function (str) {
        let that = this;
        str = encodeURI(str).split('%').reverse();
        let num = 0;
        str.forEach( word =>{
            let _n = 0;
            word.forEach(char =>{
                _n+= that._rKey.indexOf(char);
            });
            num *= 13; // 使得字之间的关系更复杂些
            num += _n;
        });
        return num;
    }

    return handle;
}
module.exports = fastD3;