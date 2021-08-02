window.onload = () =>{
    const svg = document.getElementById('target');
    svg.setAttribute('width', document.body.offsetWidth);
    svg.setAttribute('height', 500);

    fastD3.SVG(svg);

    let param = {...fastD3.pieDefault};
    param.widthPercent = 0.5
    param.heightPercent = 0.5
    param.xOffset = 0.25;
    param.yOffset = 0.25;
    param.fontSize = 10;
    param.lineHeight = 10;
    param.fontColor = (d, i, arr) =>{
        return `rgb(${i * 100}, 255, 255)`;
    }
    // param.sort = (a,b) =>{
    //     return b.value - a.value;
    // }
    let his = fastD3.pie(getData(), param);

    setTimeout(() => {
        let d = getData();
        d.splice(2,1);
        d.push({
            name: 'Change',
            value: 10
        });
        d.push({
            name: 'Change1',
            value: 10
        });
        d.push({
            name: 'Change2',
            value: 10
        });
        d.push({
            name: 'Change3',
            value: 10
        });
        d[1].value = 2;
        his.cData(d);
    }, 2000);

    setTimeout(() => {
        his.cData([]);
    }, 3000);


    let testL = [{name: 'a', _value:1},{name: 'a', _value:2},{name: 'a', _value:3},{name: 'a', _value:4}]
}

function getData() {
    return [{
        name: 'APath',
        value: 42
    }, {
        name: 'BPath',
        value: 23
    }, {
        name: 'CPath',
        value: 19
    }, {
        name: 'DPath',
        value: 2
    }, {
        name: 'EPath',
        value: 34
    }, {
        name: 'FPath',
        value: 22
    }];
}