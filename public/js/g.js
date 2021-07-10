let initSVG = () =>{
    let svg = document.getElementById('targetSVG');
    if (svg) {
        return svg
    } else {
        svg = document.createElement('svg');
        svg.id = 'targetSVG';

        svg.setAttribute('width', window.innerWidth);
        svg.setAttribute('height', window.innerHeight);

        document.body.appendChild(svg);
        return svg;
    }
}