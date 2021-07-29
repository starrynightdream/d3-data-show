window.onload = () =>{
    const svg = document.getElementById('target');
    svg.setAttribute('width', document.body.offsetWidth);
    svg.setAttribute('height', 500);

    fastD3.SVG(svg);
    console.log(fastD3);

    let his = fastD3.column(getData());

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