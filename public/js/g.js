const ID = 'targetSVG';

let initSVG = () =>{
    let svg = document.getElementById(ID);
    if (svg) {
        return svg
    } else {
        svg = document.createElement('svg');
        svg.id = ID;

        svg.setAttribute('width', window.innerWidth + '');
        svg.setAttribute('height', window.innerHeight + '');

        document.body.appendChild(svg);
        return svg;
    }
}
