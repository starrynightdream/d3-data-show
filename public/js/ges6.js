// 暂时弃用，再做计划。
let initSVG = () =>{
    let svg = document.getElementById('targetSVG');
    if (svg) {
        return svg
    } else {
        svg = document.createElement('svg');
        svg.id = 'targetSVG';

        svg.setAttribute('width', window.innerWidth);
        svg.setAttribute('height', window.innerHeight);
        return svg;
    }
}

export default {
    initSVG
}