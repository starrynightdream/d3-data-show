window.onload = () =>{
    initSVG();
    init();
}

/**
 * 初始化界面
 */
init = () =>{
    let param = {dataSet:[5, 3, 4, 6, 10, 1 , 5, 3, 4, 6, 10, 1]};
    createPie(param)
}

/**
 * 期望的帧变化
 */
tick = () =>{
}