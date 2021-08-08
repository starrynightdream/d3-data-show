window.onload = () =>{
    const svg = document.getElementById('target');

    fastD3.SVG(svg);

    let param = {...fastD3.pieDefault};
    param.widthPercent = 0.25
    param.heightPercent = 0.25
    param.xOffset = 0.25;
    param.yOffset = 0.25;
    param.fontSize = 10;
    param.lineHeight = 10;
    param.fontColor = (d, i, arr) =>{
        return `black`;
    }
    param.sort = (a,b) =>{
        return b.value - a.value;
    }
    let his = fastD3.pie(getData(), param);

    let param2 = {...fastD3.columnDefault};
    param2.widthPercent = 0.25
    param2.heightPercent = 0.25
    param2.xOffset = 0;
    param2.yOffset = 0.25;
    param2.fontSize = 10;
    param2.lineHeight = 10;
    param2.needLine = true;
    param2.fontColor = (d, i, arr) =>{
        return `white`;
    }
    let col = fastD3.column(getData(), param2);

    let param3 = {...fastD3.linesDefault};
    param3.widthPercent = 0.25
    param3.heightPercent = 0.25
    param3.xOffset = 0.5;
    param3.yOffset = 0.25;
    param3.fontSize = 10;
    param3.lineHeight = 10;
    param3.fontColor = (d, i, arr) =>{
        return `white`;
    }
    // param3.sort = (a,b)=>{return b.value - a.value;}
    let lines = fastD3.lines(getData(), param3);

    setTimeout(() => {
        let d = getData();
        d.splice(2,1);
        d.push({
            name: 'Change',
            value: 7
        });
        d.push({
            name: 'Change1',
            value: 8
        });
        d.push({
            name: 'Change2',
            value: 9
        });
        d.push({
            name: 'Change3',
            value: 10
        });
        d[1].value = 20;

        his.cData(d);
        col.cData(d);
        lines.cData(d);
    }, 2000);

    setTimeout(() => {
        his.cData([]);
        col.cData([]);
        lines.cData([]);
    }, 3000);


    let testL = [{name: 'a', _value:1},{name: 'a', _value:2},{name: 'a', _value:3},{name: 'a', _value:4}]
}

function getData() {
    return [{
        name: 'APath',
        value: 46
    }, {
        name: 'BPath',
        value: 51
    }, {
        name: 'CPath',
        value: 4
    }, {
        name: 'DPath',
        value: 23
    }, {
        name: 'EPath',
        value: 27
    }, {
        name: 'FPath',
        value: 11
    }];
}