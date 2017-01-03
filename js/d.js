/**
 * Created by Administrator on 2016/12/28.
 *
 * 详情页的逻辑
 *
 */
var jq = jQuery.noConflict();
var params={
    page:null,
    taskId:null,
    platform:null,
    mewId:null,
    more:null
};
(function(){
    jq.extend({
        args:function(){
            var url=window.location.href;
            if(url.indexOf("?")>0){
                var urlstr=url.split("?")[1];
                var arr="";
                if(urlstr.indexOf("&")>0){
                    arr=urlstr.split("&");
                    params.page=arr[0].split("=")[1];
                    params.taskId=arr[1].split("=")[1];
                    params.platform=arr[2].split("=")[1];
                    params.mewId=arr[3].split("=")[1];
                }else{
                    params.page=urlstr.split("=")[1];
                }
            }
            return params;
        },
        /*
        *
        * 请求数据
        *
        *
        * */
        renderData:function(){
            jq.ajax({
//			url:"http://192.168.199.196/palmjobadmin/task/getDetail",
//                url:"http://www.timemtech.com/palmjobadmin/task/getDetail",
                url:"./static/d.json",
                type:"get",
                data:{taskId :params.taskId,platformType:params.platform,mewId:params.mewId},
                dataType:"json",
                success:function(result){

                    jq(".detail .header h1")
                    jq(".detail .card .title")
                    jq(".detail .card div .end-time")
                    jq(".detail .card div .end-time")
                    jq(".detail .card div .check-time")
                    jq(".detail .card div .repeat")
                    jq(".detail .card div .surplus")
                    jq(".detail .tab .notice")
                    console.log(result.data);
                },
                error:function(data){
                    console.log(data);
                }
            });
            return false;
        },
        /*
        *
        * 自定义倒计时
        *
        * */
        countDown:function(time){
            var timer=null;
            if(timer==null){
                timer = setInterval(function(){
                    if(time <= 0){
                        clearInterval(timer);
                        return false;
                    }
                    time --;
                    /*格式化*/
                    var h = Math.floor(time/3600);
                    var m = Math.floor((time%3600)/60);
                    var s = Math.floor(time%60);
                    h= h >= 10?h:"0"+h;
                    m= m >= 10?m:"0"+m;
                    s= s >= 10?s:"0"+s;
                    $('.detail .footer .right .continue .countdown').html(h+":"+m+":"+s);
                },1000);
            }else{
                return false;
            }
            return false;
        },

        autoFunc:function(){
            jq("html").css("overflow","auto");
            jq("body").css("overflow","auto");
        },
        hiddenFunc:function(){
            jq("html").css("overflow","hidden");
            jq("body").css("overflow","hidden");
        },
        goBack:function(){
            jq.args();
            jq(".goback").click(function(){
                if(params.page=="1"){
                    window.location.href="./home.html?page="+params.page;
                }else if(params.page=="2"){
                    window.location.href="./task.html?page="+params.page;
                }else{
                    window.location.href="./home.html?page";
                }
                return false;
            });
            return false;
        },
        toolTip:function(){
            jq(".d_msk").show();
            jq(".detail .d_msk .d_msk_box .select .d_off").click(function(){
                jq.autoFunc();
                jq(".d_msk").hide();
            });
            jq(".detail .d_msk .d_msk_box .select .d_on").click(function(){
                jq.autoFunc();
                 window.location.href="./apply.html?page="+params.page;
            });
            return false;
        },
        toNextPage:function(){
            jq(".preview").click(function(){
                window.location.href="./preview.html?page="+params.page;
            });
            jq(".play").click(function(){
                jq.hiddenFunc();
                jq.toolTip();
            });
            return false;
        },
        /*
        *
        * 加过渡
        * */
        addTransition:function(dom){
            jq(dom).css({
                webkitTransition:"all .2s",
                transition:"all .2s"
            });
        },
        /*
        *
        * 清除过渡
        *
        * */
        removeTransition:function(dom){
            jq(dom).css({
                webkitTransition:"none",
                transition:"none"
            });

        },
        /*
        *
        * 设置定位
        *
        *
        * */
        setTranslateX:function(dom,translateX){
            jq(dom).css({
                webkitTransform:"translateX("+translateX+"px)",
                transform:"translateX("+translateX+"px)"
            });
        },
        /*
        *
        * touch事件逻辑处理
        *
        *
        * */
        addTouchEvent:function(active){
            /*
             *
             * startX    记录刚刚触摸屏幕时候的坐标
             * moveX     记录滑动时候的坐标
             * distanceX 移动过得距离
             * isMove    是否滑动过
             *
             * */


            var startX=0;
            var moveX=0;
            var distanceX=0;
            var isMove=false;
            var index=active;

            var width=jq(".img_msk").width();

            var len=jq(".detail .img_msk .img_list li").length-1;
            console.log(len);

            jq.setTranslateX(".img_list",-index*width);

            jq(".img_list").bind("touchstart",function(e){
                startX= e.originalEvent.changedTouches[0].clientX;

            });
            jq(".img_list").bind("touchmove",function(e){
                e.stopPropagation();
                moveX= e.originalEvent.changedTouches[0].clientX;
                distanceX=moveX-startX;
                isMove=true;
                /*
                 *
                 * 当前的位置 加上 你改变的位置  就是 你将要定位的那个位置
                 *
                 * */
                var translateX=-index*width+distanceX;
                jq.removeTransition();
                jq.setTranslateX(".img_list",translateX);

            });
            jq(".img_list").bind("touchend",function(){
                if(Math.abs(distanceX) > width/3 && isMove){
                    /*
                     *
                     * 往右  正  往左  负
                     *
                     *
                     * 滑动超过了一定的距离
                     *
                     *
                     * */
                    if(distanceX > 0){
                        index --;
                    }else{
                        index ++;
                    }
                    if(index>len){
                        index=0;
                    }else if(index<0){
                        index=len;
                    }
                    jq.point(index ,len);
                    jq.addTransition();
                    jq.setTranslateX(".img_list",-index*width);
                }else{
                    /*滑动不超过一定的距离*/
                    jq.addTransition();
                    jq.setTranslateX(".img_list",-index*width);
                }
                /*重置*/
                startX = 0;//记录刚刚触摸屏幕时候的坐标x
                moveX = 0; //记录滑动时候的坐标x
                distanceX = 0; //移动的距离
                isMove = false;//是否滑动过

            });
            return false;
        },
        /*
        *
        * 图片滑动
        *
        *
        * */
        point:function(index,total){
            index=index+1;
            total=total+1;
            jq(".detail .img_msk .bar .current").html(index);
            jq(".detail .img_msk .bar .total").html(total);
            return false;
        },
        loops:function(){

            /*
            *
            *
            * 需求：点击图片 放大显示 左右切换
            *       bar 显示当前图
            *
            * */
            var sum=jq(".detail .tab .photos li").length-1;
            var active=1;
            jq(".detail .tab .photos li").bind("click",function(event){
                event.stopPropagation();
                active=jq(".detail .tab .photos li").index(jq(this));
                /*
                *
                * 拼接字符串
                *
                * */
                var imgs=jq(".detail .tab .photos").find("img");
                var createMsk='<div class="img_msk"><div class="bar"><span class="current">1</span> of <span class="total">2</span></div></div>';
                var createUl='<ul class="img_list clearfix"></ul>';
                var imglist="";
                for(var i=0;i<imgs.length;i++){
                    imglist+='<li style=background-image:url("'+imgs[i].src+'")> <img src="'+imgs[i].src+'" alt=""/></li>';
                }
                jq(".detail").append(createMsk);
                jq(".img_msk").append(createUl);
                jq(".img_list").append(imglist);
                jq(".detail .img_msk .img_list li img").click(function(){
                    jq(".img_msk").remove();
                });
                jq.point(active ,sum);
                jq.addTouchEvent(active);
                return false;
            });
            return false;
        }
    });
})(jQuery)
