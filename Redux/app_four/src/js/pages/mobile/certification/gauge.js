/* eslint-disable */
export default class Gauge{
    defaults = {
        value: 0,
        value_max: 0,
        ticks: 5,
        degrees: 180,
        thickness: 3,
        percent: 0,
        percent_target: 0,
        duration: 550,
        color: '#fff',
        color_active: '#fff77a',
        scale: .95
    }
    constructor(options){
        options = Object.assign(this.defaults, options);
        let {element} = options;
        element.width = this.responsive(element.width);
        element.height = this.responsive(element.height);
        options.percent = options.value / options.value_max;
        options.percent_target = options.percent;
        options.context = element.getContext('2d');
        options.thickness = this.responsive(options.thickness);
        options.stroages = [];

        let size = 4;
        let spacing = options.value_max / 4;
        for(let i = 0;i < 5;i++){
            options.stroages.push(spacing * i);
        }
        for(let i in options) !!!this[i] && (this[i] = options[i]);
    }
    prepare(visible = true){
        let {element: {width, height}, context, thickness, scale} = this;
        visible && context.clearRect(0, 0, width, height);
        context.translate(width / 2, height - thickness / 2 - this.responsive(3));
        context.scale(scale, scale);
    }
    render(){
        let {element: {width, height}, stroages, value, context, percent, percent_target, degrees, thickness, color, color_active} = this;
        {
            context.save();
            this.prepare();
            context.fillStyle = '#fff';
            context.font = `${this.responsive(14)}px Microsoft Yahei`;
            context.textAlign = 'center';
            context.textBaseLine = 'bottom';
            context.fillText('认证分', 0, this.responsive(-42));
            context.restore();
        }
        {
            context.save();
            this.prepare(false);
            context.fillStyle = '#fff';
            context.font = `${this.responsive(36)}px Microsoft Yahei`;
            context.textAlign = 'center';
            context.textBaseLine = 'bottom';
            context.fillText(value, 0, 0);
            context.restore();
        }
        {
            stroages.map((stroage, index) => {
                let x = 0;
                let y = 0;
                index == 0 && (x = -110,y = 2.5);
                index == 1 && (x = -82,y = -60);
                index == 2 && (x = 0,y = -100);
                index == 3 && (x = 82,y = -60);
                index == 4 && (x = 103,y = 2.5);
                context.save();
                this.prepare(false);
                context.fillStyle = stroage <= value ? color_active : color;
                context.font = `${this.responsive(16)}px Arial`;
                context.textAlign = 'center';
                context.textBaseLine = 'bottom';
                context.fillText(stroage, this.responsive(x), this.responsive(y));
                context.restore();
            });
        }
        // 文字刻度
        // {
        //     context.save();
        //     this.prepare(false);
        //     // figure out how many degrees between each tick
        //     let ticks = 5;
        //     let rotation = degrees / (ticks - 1);
        //     let starting = (180 - degrees) / 2;
        //     let stroage = [0, 30, 60, 90, 120];
        //     context.rotate(starting * Math.PI / 180);
        //     context.scale(.82, .82);
        //     for(let i = 0;i < ticks;i++){
        //         let visible = (stroage[i] <= percent);
        //         context.fillStyle = visible ? color_active : color;
        //         context.font = `${this.responsive(18)}px Arial`;
        //         context.fillText(stroage[i], -1 * (width / 2), -thickness / 2);
        //         context.rotate(rotation * Math.PI / 180);
        //     }
        //     context.restore();
        // }
        // 刻度
        {
            context.save();
            this.prepare(false);
            // figure out how many degrees between each tick
            let ticks = 5 + this.ticks * 4;
            let rotation = degrees / (ticks - 1);
            let starting = (180 - degrees) / 2;
            // context.rotate(starting * Math.PI / 180);
            for(let i = 0;i <= ticks;i++){
                let visible = (( i / ticks) * 100 <= percent);
                // let size = (i + this.ticks) % ((ticks - 1) / 4) === 0 ? 52 : 52;
                context.fillStyle = visible ? color_active : color;
                context.fillRect(-1 * (width / 2), -thickness / 2, this.responsive(23), thickness);
                context.rotate(rotation * Math.PI / 180);
            }
            context.restore();
        }
        // 轨道
        {
            context.save();
            this.prepare(false);
            // figure out how many degrees between each tick
            let ticks = 5 + 180 * 4;
            let rotation = degrees / (ticks - 10);
            let starting = (178 - degrees) / 2;
                thickness = this.responsive(1);
            context.rotate(starting * Math.PI / 180);
            context.scale(.55, .55);
            for(let i = 0;i <= ticks;i++){
                let visible = (( i / ticks) * 100 <= percent);
                // let size = (i + this.ticks) % ((ticks - 1) / 4) === 0 ? 10 : 10;
                context.fillStyle = visible ? color_active : color;
                context.fillRect(-1 * (width / 2), -thickness / 2, this.responsive(3), thickness);
                context.rotate(rotation * Math.PI / 180);
            }
            context.restore();
        }
        {
            context.save();
            this.prepare(false);
            // figure out how many degrees between each tick
            let ticks = 5 + 180 * 4;
            let rotation = degrees / (ticks - 1);
            let starting = (180 - degrees) / 2;
            let index = 0;
                thickness = this.responsive(7);
            context.rotate(starting * Math.PI / 180);
            context.scale(.545, .545);
            for(let i = 0;i <= ticks;i++){
                let visible = (( i / ticks) * 100 <= percent - 1);
                visible && (index = i);
            }
            for(let i = 0;i <= ticks;i++){
                let visible = (( i / ticks) * 100 <= percent);
                let size = (i + this.ticks) % ((ticks - 1) / 4) === 0 ? 10 : 10;
                context.beginPath();
                context.fillStyle = i == index ? color_active : 'transparent';
                context.arc(-1 * (width / 2), -thickness / 2, thickness, degrees, Math.PI * 2, true);
                context.closePath();
                context.fill();
                context.rotate(rotation * Math.PI / 180);
            }
            context.restore();
        }
        return true;
    }
    update(value = 0, options = {}){
        let self = this;
        let {value_max, percent, percent_target, duration} = this;
        percent = value / value_max;
        percent_target = Math.round(value / value_max * 100);
        // this.value = value;
        if(duration){
            let updated = Date.now();
            let start = percent;
            let end = percent_target;
            let timer = (end - start) / duration;
            let increasing = timer > 0 ? 1 : 0;
            let update = () => {
                let now = Date.now();
                let elapsed = now - updated;
                this.percent += elapsed * timer;
                updated = now;
                if((increasing && this.percent < percent_target) || (!increasing && this.percent > percent_target)){
                    this.value++;
                    this.render();
                    this.requestAnimationFrame(update);
                }else{
                    this.value = value;
                    percent = percent_target;
                    this.render();
                }
            };
            this.requestAnimationFrame(update);
        }else{
            this.percent = value;
            this.render();
        }
    }
    responsive(value, visible){
        return value * devicePixelRatio;
    }
    requestAnimationFrame(callback){
        return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback){
            window.setTimeout(() => {
                callback(+new Date);
            }, 1000 / 60);
        })(callback);
    }
};