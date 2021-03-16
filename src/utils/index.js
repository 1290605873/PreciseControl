/*
* 不通过路由直接获取url中参数的方法示例
* @example  let channel=this.$utils.getUrlKey("channel")
*/
export default {
    isHttpsProtal: function () {
        return window.location.protocol.startsWith('https');
    }
    ,
    getUrlKey: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
    }
    ,
    /**
     *打印对象信息
     * 用法 vue对象中拓展 this.$utils.consoleObj(obj);
     * @param obj 需要打印的对象
     */
    consoleObj: function (obj) {
        try {
            if(process){
                if (process.env.NODE_ENV =='development') {
                    window.console.log('%c' + this.prettyPrint(obj), 'color:green');
                }
            }
        } catch (e) {

        }
        // if (Object.prototype.toString.call(obj) === '[object String]') {
        //     // window.console.error('该对象是字符串');
        // } else if (Object.prototype.toString.call(obj) === '[object Array]') {
        //     // window.console.error('该对象是数组');
        // } else if (Object.prototype.toString.call(obj) === '[object Object]') {
        //     // window.console.error('该对象是对象');
        // }
        // window.console.log('%c'+msg, 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:white;-webkit-background-clip: text;font-size:2em;');
        // console.log('%cRainbow Text ', 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:black;-webkit-background-clip: text;font-size:5em;');
        // window.console.error(msg);

    },
    dealHttpSrc: function (src) {
        if (src == null || src == undefined || src.length == 0) {
            return '';
        }
        if (this.isHttpsProtal()) {
            if(src.startsWith('https')||src.startsWith("HTTPS")){
                return src
            }else{
                return src.replace("http",'https');
            }
        } else {
            if(src.startsWith('https')){
                return src.replace("https",'http');
            }else if(src.startsWith('HTTPS')){
                return src.replace("HTTPS",'http');
            }else{
                return src;
            }
        }
    }
    ,
    prettyPrint: function (obj) {
        var ENDLINE = "\n";
        var COMMA_ENDLINE = ",\n";
        var OBJ_BEGIN = "{";
        var OBJ_END = "}";
        var ARR_BEGIN = "[";
        var ARR_END = "]";
        var INDNET_SPACES = 4;
        return (function innerPrettyPrint(obj, spaces) {
            var type = typeof obj;

            if (type == "number" || type == "boolean") {
                return obj.toString();
            } else if (type == "string") {
                return '"' + obj + '"';
            } else {
                var entries = [];
                var thisIndent = ' '.repeat(spaces);
                var subIndent = thisIndent + ' '.repeat(INDNET_SPACES);
                var subSpaces = spaces + INDNET_SPACES;

                if (Object.prototype.toString.call(obj) == '[object Object]') {
                    for (var k in obj) {
                        entries.push(k + ': ' + innerPrettyPrint(obj[k], subSpaces));
                    }

                    return OBJ_BEGIN + ENDLINE + subIndent + entries.join(COMMA_ENDLINE + subIndent) + ENDLINE + thisIndent + OBJ_END;
                } else if (Object.prototype.toString.call(obj) == '[object Array]') {
                    obj.forEach(function (a) {
                        entries.push(innerPrettyPrint(a, subSpaces));
                    });

                    return ARR_BEGIN + ENDLINE + subIndent + entries.join(COMMA_ENDLINE + subIndent) + ENDLINE + thisIndent + ARR_END;
                } else if (obj === null) {
                    return "null";
                } else {
                    try {
                        return obj.toString();
                    } catch (r) {
                        return '';
                    }

                }
            }
        })(obj, 0);
    },
    //获取guid 调用方式this.$utils.guid()
    guid:function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    },
    //判断是正式环境还是测试环境
    isTestEvn(){
        let locationHref=window.location.href.toLocaleLowerCase()
        if(locationHref.indexOf('http://test')>=0 || locationHref.indexOf('https://test')>=0){
            return true
        }else{
            return false
        }
    },
    // 深度复制对象
    deepCopy(o){
      return typeof(o) == 'object' ? JSON.parse(JSON.stringify(o)) : console.log(o + '不是对象哦')
    }

}
