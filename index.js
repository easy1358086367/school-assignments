var boxBg = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#564545', '#607d8b', '#405d6b', '#9e9e9e', '#70737d', '#389fa0', '#38a05e', '#b3c981', '#76a803', '#fecf43', '#e2785f'];	//box背景色

//基础样式
{
    let style = document.createElement('style');
    let styleStr = '';
    let box = document.querySelectorAll('.box');

    for (let i = 0; i < box.length; i++) {
        styleStr += `
        .box:nth-child(${i + 1}) div {
            background: ${boxBg[i]} url(./images/${i + 1}.png) no-repeat center;
        }
    `
    }
    style.innerHTML = styleStr;
    document.head.append(style)

}



// 添加事件
let boxs = document.querySelectorAll('.box');
let swiperImg = document.querySelector('.swiper img')

boxs.forEach( function ( box ) {
    box.onmouseenter = function ( ev ) {

        let deg = getDir( ev , this );
        let place = (Math.round( (deg + 180) / 90)  + 3) % 4;
        switch ( place ) {
            case 0 : this.style.transform='rotateX(-180deg)';break;
            case 1 : this.style.transform='rotateY(-180deg)';break;
            case 2 : this.style.transform='rotateX(180deg)';break;
            case 3 : this.style.transform='rotateY(180deg)';break;
        }
        swiperImg.src = this.dataset.img
    }
    box.onmouseleave = function ( ev ) {
        this.style.transform= '';
    }
})

//计算鼠标当前位置与盒子中心的角度
function getDir ( ev,box ) {
    
    let boxMsg = box.getBoundingClientRect();//盒子的基本信息
    let boxX =boxMsg.left + boxMsg.width / 2;//盒子中心与页面左侧的距离
    let boxY = boxMsg.top + boxMsg.height / 2;//盒子中心与页面上侧的距离

    let evX = ev.clientX - boxX;//鼠标与盒子中心的横向距离
    let evY = ev.clientY - boxY;//鼠标与盒子中心的纵向距离

    let deg = Math.atan2( evY , evX ) / ( Math.PI / 180);//计算鼠标与盒子中心的角度


    return deg;

}


