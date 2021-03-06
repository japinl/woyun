/*
 * 字符串格式化
 * 使用:
 * 'Hello, {0}! My name is {1}'.format('Lily', 'Bob');
 */
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

$(document).ready(function(){
    // 登录后相关设置
    globalUserInfo();

    $(".confirmDialog").dialog({ // 通用确认框
        autoOpen: false,
        width: 400,
        modal: true
    });

    // 一级菜单提示框设置
    $('#id-first-nav').setBarCss("active");
    $(".lbar-link").setBarCss("active");

    $(".user-msg-tooltips").jBox("Tooltip",{
	width:'auto',
	height:'auto',
	closeOnMouseleave:true,
	animation:'zoomIn',
        title: '',
        content: $("#id-userMenu-content")
    });
    
    $(".tip-component").off("click").on("click", function(){
	$(".confirmDialog").html(
	    '<div class="confirmContent">'
		+'<h3><i class="icon-lock-single"></i>标准证书 <h3>'
		+'<p>标准证书要求签署方在签署合同之前经过实名认证。 </p>'
		+'<p>适用场景：您希望合同具有最高级别的安全性，需要保证签署方实名。比如在线交易、金融交易等 </p>'
		+'<h3><i class="icon-lock-single"></i>一次性证书 <h3>'
		+'<p>不需要签署方实名认证，只需要邮箱或手机认证即可。</p>'
		+'<p>适用场景：您知道签署方真实身份，不需要对方进行实名认证环节，快速实现签名。</p>'
		+'</div>'
		+'<div class="confirmBtn textRight borderTop">'
		+'<span class="confirmNo btn-border-default-m mr25">我知道了</span>'
		+'</div>'
	).dialog({autoOpen: true, title: "提示"});
	
	$('.confirmNo').unbind('click').click(function(){ // 取消
	    $(".ui-dialog-titlebar-close").click();
	});
	
    });

    // 二维码
    $("#show-app-mod").mouseEnterLeave("#lbar-app-mod", "hidden");

});

// 用户信息初始化
function globalUserInfo(){
    // 添加logo触发事件
    $(".logo").on("click",function(){
	window.location.href=gfALLDATA("alipayPage")+"/index.html";
    });
}

/* 设置将要登出系统前公共的参数 */
function setLogoutingCommon(){
    $(".js_header_logout").click(function(){
	// 删除“设置”项的tab状态检测
	$.totalStorage.deleteItem("settingTabType");
	// 删除“动态”项的tab状态检测
	$.totalStorage.deleteItem("activityTabType");
	// 删除“xxx”项的tab状态检测
	$(this).attr('href','/user/sys/users/logout');
    });
}

// 提示信息 + loading.gif
function showInfo(infoText){  // 信息提示
    $('#commomTipBox').clearQueue().stop().text(infoText);
    $('#commomTipBox').css({'background-color': '#33cc99', 'border':'#33cc99', 'margin-left': '-' + $('#commomTipBox').width()/2 + 'px'}).show();
    setTimeout(function(){
        $('#commomTipBox').fadeOut('normal');
    }, 3000);// 设置提示出现时间为3s
}
function showErrorInfo(infoText){
    $('#commomTipBox').clearQueue().stop().text(infoText);
    $('#commomTipBox').css({'background-color': '#fa893c', 'border':'#fa893c', 'margin-left': '-' + $('#commomTipBox').width()/2 + 'px'}).show();
    setTimeout(function(){
        $('#commomTipBox').fadeOut('normal');
    }, 3000);// 设置提示出现时间3s
}

function showLoading(){ // 正在加载动画
    $('#loadingTip').clearQueue().stop().css({'margin-left': '-' + $('#loadingTip').width()/2 + 'px'}).show();
}

function hideLoading(){  // 隐藏动画
    $('#loadingTip').clearQueue().stop().fadeOut('normal');
}

// ***定时保存专用动画提示
function showLightInfo(infoText){  // 信息提示
    $('#commomTipBox').clearQueue().stop().text(infoText);
    $('#commomTipBox').css({'color':'#cdd7e1;','background-color': '#226ab2;', 'border':'0', 'top': '16px', 'left': '180px', 'padding': '5px 15px'}).show();
    setTimeout(function(){
        $('#commomTipBox').fadeOut('normal');
    }, 3000);// 设置提示出现时间为3s
}

// 通用请求
function requestServer(option){
    $.ajax({
        url: option.requestURL,
        async: option.requestAsync || true,	// async: boolean类型
        type: option.requestType || 'POST',
        dataType: option.requesDatatType || 'text json',
        contentType: option.requestContentType || 'application/json',
        data: option.requestData||{},
	headers:option.requestHeaders||{},
        beforeSend: function(xhr){
            if(option.beforeCallback){
                option.beforeCallback(xhr);
            }
        },
        success: function(data, textStatus, resObj){
            if(data == 'No Access'){
                showInfo('连接超时，请重新登录');
            }
            else{
                if(option.successCallback)option.successCallback(data, textStatus, resObj);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            // 需要完善的容错处理
	    // 容错处理：1.网络中断情况——提醒检查网络；2.会话连接超时——刷新重新连接；3.程序错误——不能抛给用户，程序员调试程序时使用，采用console.log输出
            if(option.errorCallback)option.errorCallback(jqXHR, textStatus, errorThrown);
            if(jqXHR.status==403 && jqXHR.getResponseHeader("Referer") != null ){// 登录超时错误
                showInfo('连接超时，正在跳转到登录页');
                window.location.href = jqXHR.getResponseHeader("Referer");
            }else{
                hideLoading();
            }
        }
    });
}

// 上传文件大小转换提示
function uploadFileSizeConvertTip(fileByteSize){
    // 以KB显示
    if(fileByteSize < 1048576){// 1024*1024
	return parseFloat((fileByteSize/1024).toFixed(2))+'KB';
    }
    // 以MB显示
    if(fileByteSize >= 1048576 && fileByteSize < 1073741824){
	return parseFloat((fileByteSize/1048576).toFixed(2))+'MB';
    }
    // 以GB显示
    if(fileByteSize >= 1073741824){
	return parseFloat((fileByteSize/1073741824).toFixed(2))+'GB';
    }
}

// 时间转换
function transformTime(ms, link){
    var date = new Date(ms);
    var y = date.getFullYear() + '-' + dateFormat(date.getMonth() + 1) + '-' + dateFormat(date.getDate());
    var h = dateFormat(date.getHours()) + ':' + dateFormat(date.getMinutes()) + ':' + dateFormat(date.getSeconds());

    if(link == true){  // 日期时间连在一起
        return (y+' '+h);
    }else{
        return {ymd : y, hmm : h};  // 日期时间分开
    }

    function dateFormat(value){
    	if(value != "null" && value != null){
    	    return (value < 10 ? '0' + value : value);
    	}else{
    	    return " ";
    	}
    }
}

// 动态鼠标移入移除
(function($){
    $.fn.mouseEnterLeave = function(obj, className){
        var _this = this;
        $(_this).mouseenter(function(){
      	    $(obj).removeClass(className);
        }).mouseleave(function(){
      	    $(obj).addClass(className);
        });
        return this;
    };
})(jQuery);

// 动态设置当前一级菜单选中项样式
(function($){
    $.fn.setBarCss = function(className){
        var _this = this;
        var windowHref = ((window.location.pathname).split("/"))[((window.location.pathname).split("/")).length - 2] + '/' + ((window.location.pathname).split("/"))[((window.location.pathname).split("/")).length - 1];
        var linkHref = $(_this).children("li");
        var len = $(linkHref).length;

        for(var i = 0; i < len; i++){
            var _this = $($(linkHref)[i]);
            var curHref = ((_this.find('a').attr("href")).split("/"))[((_this.find('a').attr("href")).split("/")).length - 2] + '/' + ((_this.find('a').attr("href")).split("/"))[((_this.find('a').attr("href")).split("/")).length - 1];
            if( windowHref === curHref ){
             	/*
		 * console.log("windowHref:" + windowHref + ";" +"curHref:"
		 * +curHref+";"+$(linkHref)[i]);
		 */
             	_this.addClass(className);
             	return true;
            }else{
            	// console.log("windowHref:" + windowHref + ";" +"curHref:"
		// +curHref+";"+$(linkHref)[i]);
                continue;
            }
        }
        return this;
    };
})(jQuery);

/*
 * **生成uuid
 */
// Generate a pseudo-GUID by concatenating random hexadecimal.
function GUID() {
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    // Generate four random hex digits.
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
};

/***************************************************************************
 * global parameter : gALLDATA Parameter call : gALLDATA(
 * "subparameter_name" ) //调用统一方式 gALLDATA("publicHref") define: uRole-用户角色,
 * uId-用户ID, uCode-用户编码, uName-用户名 baseHref-IP+port+projectName // eg: <base
 * href="http://localhost:8080/cloudsign-wesign">
 * publicHref-公共接口地址，userInfoHref-用户个人信息接口地址，docHref-文档接口地址，sealHref-签章接口地址，certHref-证书接口地址
 **************************************************************************/

var gfALLDATA=function( para ){

    var obj=null;
    return function(para){
	if(!obj){
	    var uRole = $("#USER_ROLE").attr("value") ,
		uId = $("#USER_ID").attr("value") ,
		uCode = $("#USER_SERIAL_CODE").attr("value") ,
		uName = $("#USER_BEST_NAME").attr("value") ,
		uEmail= $("#USER_CONTACT_EMAIL").attr("value") ,
		uphone= $("#USER_CONTACT_PHONE").attr("value") ,
		baseHref = $("base").attr("href") ,
		publicHref = baseHref + "/wesign/common" ,
		userHref = baseHref + "/ws-rest/v1",
		userPublicHref = userHref + "/common",
		userInfoHref = userHref + "/users/" + uId ,
		docHref = userInfoHref + "/documents" ,
		sealHref = userInfoHref + "/seals" ,
		certHref = userInfoHref + "/certificates" ,
		payHref = userInfoHref + "/payments" ,
		alipayHref = userInfoHref ,
		envelopeHref = userInfoHref + "/envelopes",
		docPage = baseHref + "/wesign/documents" ,
		envePage = baseHref +"/wesign/envelopes",
		payPage = baseHref +"/wesign/payments",
		alipayPage = baseHref + "/wesign/users",
		certPage = baseHref + "/wesign/certificates",
		sealPage = baseHref + "/wesign/seals";
	    obj =	{
		"uRole" : uRole ,
		"uId" : uId ,
		"uCode" : uCode ,
		"uName" : uName ,
		"uEmail" : uEmail ,
		"uPhone" : uphone ,
		"baseHref" : baseHref ,
		"publicHref": publicHref ,
		"userHref": userHref,
		"userPublicHref": userPublicHref,
		"docHref" : docHref ,
		"userInfoHref": userInfoHref ,
		"sealHref": sealHref ,
		"certHref": certHref,
		"payHref": payHref,
		"alipayHref": alipayHref,
		"envelopeHref": envelopeHref,
		"docPage": docPage,
		"envePage": envePage,
		"payPage": payPage,
		"alipayPage": alipayPage,
		"certPage": certPage,
		"sealPage": sealPage
	    } ;
	}
	return obj[para] || "error/" ;
    };
}();
// 两个选择菜单
/*
 * nameLeft:左边按钮文字，nameRight:右边按钮文字，leftUrl:左边按钮链接， rightUrl:右边按钮额链接,msg：提示文字
 */
function twoChooseMune( nameLeft,nameRight,leftUrl,rightUrl,msg ){
    $(".tipMsg").dialog({ autoOpen: true,width: 400,modal: true});
    $('.tipMsgContent').html(
        '<span class="confirmNo chooseLeft mr25">'+nameLeft+'</span>'
            +'<span class="confirmYes chooseRight">'+nameRight+'</span>'
    );
    $("#js_btn_group").html(msg);
    $('.confirmNo').unbind('click').click(function(){
        window.location.href=leftUrl;
        $(".ui-dialog-titlebar-close").click();
    });
    $('.confirmYes').unbind('click').click(function(){
        window.location.href=rightUrl;
        $(".ui-dialog-titlebar-close").click();
    });
}

// 一个选择菜单
/*
 * nameLeft:左边按钮文字，nameRight:右边按钮文字，leftUrl:左边按钮链接， rightUrl:右边按钮额链接,msg：提示文字
 */
function chooseMune( nameLeft,leftUrl,msg ){
    $(".tipMsg").dialog({ autoOpen: true,width: 400,modal: true});
    $('.tipMsgContent').html(
        '<span class="confirmNo choosebtn">'+nameLeft+'</span>'
    );
    $("#js_btn_group").html(msg);
    $('.confirmNo').unbind('click').click(function(){
        window.location.href=leftUrl;
        $(".ui-dialog-titlebar-close").click();
    });
}

// 获取URL查询参数
function getQueryString(name, url){
    if (!url) url = window.location.href;
    var name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/*
 * 第三方库 jquery-jBox/jBox.min.js jquery-scrollstop/jquery.scrollstop.min.js
 */
// jBox
function jBox(type,options){this.options={id:null,width:"auto",height:"auto",minWidth:null,maxHeight:null,minWidth:null,maxHeight:null,attach:null,trigger:"click",preventDefault:!1,title:null,content:null,getTitle:null,getContent:null,isolateScroll:!0,ajax:{url:null,data:"",reload:!1,getData:"data-ajax",setContent:!0,spinner:!0},target:null,position:{x:"center",y:"center"},outside:null,offset:0,attributes:{x:"left",y:"top"},adjustPosition:!1,adjustTracker:!1,adjustDistance:5,fixed:!1,reposition:!1,repositionOnOpen:!0,repositionOnContent:!0,pointer:!1,pointTo:"target",fade:180,animation:null,theme:"Default",addClass:"",overlay:!1,zIndex:1e4,delayOpen:0,delayClose:0,closeOnEsc:!1,closeOnClick:!1,closeOnMouseleave:!1,closeButton:!1,constructOnInit:!1,blockScroll:!1,appendTo:jQuery("body"),draggable:null,dragOver:!0,onInit:null,onBeforeInit:null,onAttach:null,onCreated:null,onOpen:null,onClose:null,onCloseComplete:null,confirmButton:"Submit",cancelButton:"Cancel",confirm:null,cancel:null,autoClose:7e3,color:null,stack:!0,audio:!1,volume:100,src:"href",gallery:"data-jbox-image",imageLabel:"title",imageFade:600,imageSize:"contain"},this.defaultOptions={Tooltip:{getContent:"title",trigger:"mouseenter",position:{x:"center",y:"top"},outside:"y",pointer:!0,adjustPosition:!0,reposition:!0},Mouse:{target:"mouse",position:{x:"right",y:"bottom"},offset:15,trigger:"mouseenter",adjustPosition:"flip"},Modal:{target:jQuery(window),fixed:!0,blockScroll:!0,closeOnEsc:!0,closeOnClick:"overlay",closeButton:!0,overlay:!0,animation:"zoomOut"},Confirm:{target:jQuery(window),fixed:!0,attach:jQuery("[data-confirm]"),getContent:"data-confirm",content:"Do you really want to do this?",minWidth:320,maxWidth:460,blockScroll:!0,closeOnEsc:!0,closeOnClick:"overlay",closeButton:!0,overlay:!0,animation:"zoomOut",preventDefault:!0,_onAttach:function(t){if(!this.options.confirm){var i=t.attr("onclick")?t.attr("onclick"):t.attr("href")?t.attr("target")?'window.open("'+t.attr("href")+'", "'+t.attr("target")+'");':'window.location.href = "'+t.attr("href")+'";':"";t.prop("onclick",null).data("jBox-Confirm-submit",i)}},_onCreated:function(){this.footer=jQuery('<div class="jBox-Confirm-footer"/>'),jQuery('<div class="jBox-Confirm-button jBox-Confirm-button-cancel"/>').html(this.options.cancelButton).click(function(){this.options.cancel&&this.options.cancel(),this.close()}.bind(this)).appendTo(this.footer),this.submitButton=jQuery('<div class="jBox-Confirm-button jBox-Confirm-button-submit"/>').html(this.options.confirmButton).appendTo(this.footer),this.footer.appendTo(this.container)},_onOpen:function(){this.submitButton.off("click.jBox-Confirm"+this.id).on("click.jBox-Confirm"+this.id,function(){this.options.confirm?this.options.confirm():eval(this.source.data("jBox-Confirm-submit")),this.close()}.bind(this))}},Notice:{target:jQuery(window),fixed:!0,position:{x:20,y:20},attributes:{x:"right",y:"top"},animation:"zoomIn",closeOnClick:"box",_onInit:function(){this.open(),this.options.delayClose=this.options.autoClose,this.options.delayClose&&this.close()},_onCreated:function(){this.options.color&&this.wrapper.addClass("jBox-Notice-color jBox-Notice-"+this.options.color),this.wrapper.data("jBox-Notice-position",this.options.attributes.x+"-"+this.options.attributes.y)},_onOpen:function(){jQuery.each(jQuery(".jBox-Notice"),function(t,i){return i=jQuery(i),i.attr("id")!=this.id&&i.data("jBox-Notice-position")==this.options.attributes.x+"-"+this.options.attributes.y?this.options.stack?void i.css("margin-"+this.options.attributes.y,parseInt(i.css("margin-"+this.options.attributes.y))+this.wrapper.outerHeight()+10):void i.data("jBox").close({ignoreDelay:!0}):void 0}.bind(this)),this.options.audio&&this.audio({url:this.options.audio,valume:this.options.volume})},_onCloseComplete:function(){this.destroy()}},Image:{target:jQuery(window),fixed:!0,blockScroll:!0,closeOnEsc:!0,closeOnClick:"overlay",closeButton:!0,overlay:!0,animation:"zoomOut",width:800,height:533,attach:jQuery("[data-jbox-image]"),preventDefault:!0,_onInit:function(){this.images=this.currentImage={},this.imageZIndex=1,this.attachedElements&&jQuery.each(this.attachedElements,function(t,i){if(i=jQuery(i),!i.data("jBox-image-gallery")){var s=i.attr(this.options.gallery)||"default";!this.images[s]&&(this.images[s]=[]),this.images[s].push({src:i.attr(this.options.src),label:i.attr(this.options.imageLabel)||""}),"title"==this.options.imageLabel&&i.removeAttr("title"),i.data("jBox-image-gallery",s),i.data("jBox-image-id",this.images[s].length-1)}}.bind(this));var t=function(t,i,s,o){if(!jQuery("#jBox-image-"+t+"-"+i).length){{var e=jQuery("<div/>",{id:"jBox-image-"+t+"-"+i,"class":"jBox-image-container"}).css({backgroundImage:"url("+this.images[t][i].src+")",backgroundSize:this.options.imageSize,opacity:o?1:0,zIndex:s?0:this.imageZIndex++}).appendTo(this.content);jQuery("<div/>",{id:"jBox-image-label-"+t+"-"+i,"class":"jBox-image-label"+(o?" active":"")}).html(this.images[t][i].label).appendTo(this.imageLabel)}!o&&!s&&e.animate({opacity:1},this.options.imageFade)}}.bind(this),i=function(t,i){jQuery(".jBox-image-label.active").removeClass("active"),jQuery("#jBox-image-label-"+t+"-"+i).addClass("active")};this.showImage=function(s){if("open"!=s){var o=this.currentImage.gallery,e=this.currentImage.id+(1*("prev"==s)?-1:1);e=e>this.images[o].length-1?0:0>e?this.images[o].length-1:e}else{var o=this.source.data("jBox-image-gallery"),e=this.source.data("jBox-image-id");jQuery(".jBox-image-pointer-prev, .jBox-image-pointer-next").css({display:this.images[o].length>1?"block":"none"})}if(this.currentImage={gallery:o,id:e},jQuery("#jBox-image-"+o+"-"+e).length)jQuery("#jBox-image-"+o+"-"+e).css({zIndex:this.imageZIndex++,opacity:0}).animate({opacity:1},"open"==s?0:this.options.imageFade),i(o,e);else{this.wrapper.addClass("jBox-loading");{jQuery('<img src="'+this.images[o][e].src+'">').load(function(){t(o,e,!1),i(o,e),this.wrapper.removeClass("jBox-loading")}.bind(this))}}var n=e+1;n=n>this.images[o].length-1?0:0>n?this.images[o].length-1:n,!jQuery("#jBox-image-"+o+"-"+n).length&&jQuery('<img src="'+this.images[o][n].src+'">').load(function(){t(o,n,!0)})}},_onCreated:function(){this.imageLabel=jQuery("<div/>",{id:"jBox-image-label"}).appendTo(this.wrapper),this.wrapper.append(jQuery("<div/>",{"class":"jBox-image-pointer-prev",click:function(){this.showImage("prev")}.bind(this)})).append(jQuery("<div/>",{"class":"jBox-image-pointer-next",click:function(){this.showImage("next")}.bind(this)}))},_onOpen:function(){jQuery("body").addClass("jBox-image-open"),jQuery(document).on("keyup.jBox-"+this.id,function(t){37==t.keyCode&&this.showImage("prev"),39==t.keyCode&&this.showImage("next")}.bind(this)),this.showImage("open")},_onClose:function(){jQuery("body").removeClass("jBox-image-open"),jQuery(document).off("keyup.jBox-"+this.id)},_onCloseComplete:function(){this.wrapper.find(".jBox-image-container").css("opacity",0)}}},"string"==jQuery.type(type)&&(this.type=type,type=this.defaultOptions[type]?this.defaultOptions[type]:window["jBox"+type+"Options"]),this.options=jQuery.extend(!0,this.options,type,options),this._fireEvent=function(t,i){this.options["_"+t]&&this.options["_"+t].bind(this)(i),this.options[t]&&this.options[t].bind(this)(i)},this._fireEvent("onBeforeInit"),null===this.options.id&&(this.options.id="jBoxID"+jBox._getUniqueID()),this.id=this.options.id,("center"==this.options.position.x&&"x"==this.options.outside||"center"==this.options.position.y&&"y"==this.options.outside)&&(this.options.outside=!1),(!this.options.outside||"xy"==this.options.outside)&&(this.options.pointer=!1),"object"!=jQuery.type(this.options.offset)&&(this.options.offset={x:this.options.offset,y:this.options.offset}),this.options.offset.x||(this.options.offset.x=0),this.options.offset.y||(this.options.offset.y=0),this.options.adjustDistance="object"!=jQuery.type(this.options.adjustDistance)?{top:this.options.adjustDistance,right:this.options.adjustDistance,bottom:this.options.adjustDistance,left:this.options.adjustDistance}:jQuery.extend({top:5,left:5,right:5,bottom:5},this.options.adjustDistance),this.align=this.options.outside&&"xy"!=this.options.outside?this.options.position[this.options.outside]:"center"!=this.options.position.y&&"number"!=jQuery.type(this.options.position.y)?this.options.position.x:"center"!=this.options.position.x&&"number"!=jQuery.type(this.options.position.x)?this.options.position.y:this.options.attributes.x,this.options.outside&&"xy"!=this.options.outside&&(this.outside=this.options.position[this.options.outside]);var userAgent=navigator.userAgent.toLowerCase();return this.IE8=-1!=userAgent.indexOf("msie")&&8==parseInt(userAgent.split("msie")[1]),this.prefix=-1!=userAgent.indexOf("webkit")?"-webkit-":"",this._getOpp=function(t){return{left:"right",right:"left",top:"bottom",bottom:"top",x:"y",y:"x"}[t]},this._getXY=function(t){return{left:"x",right:"x",top:"y",bottom:"y",center:"x"}[t]},this._getTL=function(t){return{left:"left",right:"left",top:"top",bottom:"top",center:"left",x:"left",y:"top"}[t]},this._supportsSVG=function(){return document.createElement("svg").getAttributeNS},this._createSVG=function(t,i){var s=document.createElementNS("http://www.w3.org/2000/svg",t);return jQuery.each(i,function(t,i){s.setAttribute(i[0],i[1]||"")}),s},this._appendSVG=function(t,i){return i.appendChild(t)},this._isolateScroll=function(t){t&&jQuery(t).length&&t.on("DOMMouseScroll.jBoxIsolatedScroll mousewheel.jBoxIsolatedScroll",function(i){var s=i.wheelDelta||i.originalEvent&&i.originalEvent.wheelDelta||-i.detail,o=this.scrollTop+t.outerHeight()-this.scrollHeight>=0,e=this.scrollTop<=0;(0>s&&o||s>0&&e)&&i.preventDefault()})},this._create=function(){if(!this.wrapper){if(this.wrapper=jQuery("<div/>",{id:this.id,"class":"jBox-wrapper"+(this.type?" jBox-"+this.type:"")+(this.options.theme?" jBox-"+this.options.theme:"")+(this.options.addClass?" "+this.options.addClass:"")+(this.IE8?" jBox-IE8":"")}).css({position:this.options.fixed?"fixed":"absolute",display:"none",opacity:0,zIndex:this.options.zIndex}).data("jBox",this),this.options.closeOnMouseleave&&this.wrapper.mouseleave(function(t){!this.source||!(t.relatedTarget==this.source[0]||-1!==jQuery.inArray(this.source[0],jQuery(t.relatedTarget).parents("*")))&&this.close()}.bind(this)),"box"==this.options.closeOnClick&&this.wrapper.on("touchend click",function(){this.close({ignoreDelay:!0})}.bind(this)),this.container=jQuery("<div/>",{"class":"jBox-container"}).appendTo(this.wrapper),this.content=jQuery("<div/>",{"class":"jBox-content"}).css({width:this.options.width,height:this.options.height,minWidth:this.options.minWidth,minHeight:this.options.minHeight,maxWidth:this.options.maxWidth,maxHeight:this.options.maxHeight}).appendTo(this.container),this.options.isolateScroll&&this._isolateScroll(this.content),this.options.closeButton){if(this.closeButton=jQuery("<div/>",{"class":"jBox-closeButton jBox-noDrag"}).on("touchend click",function(){this.isOpen&&this.close({ignoreDelay:!0})}.bind(this)),this._supportsSVG()){var t=this._createSVG("svg",[["viewBox","0 0 24 24"]]);this._appendSVG(this._createSVG("path",[["d","M22.2,4c0,0,0.5,0.6,0,1.1l-6.8,6.8l6.9,6.9c0.5,0.5,0,1.1,0,1.1L20,22.3c0,0-0.6,0.5-1.1,0L12,15.4l-6.9,6.9c-0.5,0.5-1.1,0-1.1,0L1.7,20c0,0-0.5-0.6,0-1.1L8.6,12L1.7,5.1C1.2,4.6,1.7,4,1.7,4L4,1.7c0,0,0.6-0.5,1.1,0L12,8.5l6.8-6.8c0.5-0.5,1.1,0,1.1,0L22.2,4z"]]),t),this.closeButton.append(t)}else this.wrapper.addClass("jBox-nosvg");("box"==this.options.closeButton||this.options.closeButton===!0&&!this.options.overlay&&!this.options.title)&&(this.wrapper.addClass("jBox-closeButton-box"),this.closeButton.appendTo(this.container))}if(this.wrapper.appendTo(this.options.appendTo),this.options.pointer){if(this.pointer={position:"target"!=this.options.pointTo?this.options.pointTo:this._getOpp(this.outside),xy:this._getXY("target"!=this.options.pointTo?this.options.pointTo:this.outside),align:"center",offset:0},this.pointer.element=jQuery("<div/>",{"class":"jBox-pointer jBox-pointer-"+this.pointer.position}).appendTo(this.wrapper),this.pointer.dimensions={x:this.pointer.element.outerWidth(),y:this.pointer.element.outerHeight()},"string"==jQuery.type(this.options.pointer)){var i=this.options.pointer.split(":");i[0]&&(this.pointer.align=i[0]),i[1]&&(this.pointer.offset=parseInt(i[1]))}this.pointer.alignAttribute="x"==this.pointer.xy?"bottom"==this.pointer.align?"bottom":"top":"right"==this.pointer.align?"right":"left",this.wrapper.css("padding-"+this.pointer.position,this.pointer.dimensions[this.pointer.xy]),this.pointer.element.css(this.pointer.alignAttribute,"center"==this.pointer.align?"50%":0).css("margin-"+this.pointer.alignAttribute,this.pointer.offset),this.pointer.margin={},this.pointer.margin["margin-"+this.pointer.alignAttribute]=this.pointer.offset,"center"==this.pointer.align&&this.pointer.element.css(this.prefix+"transform","translate("+("y"==this.pointer.xy?this.pointer.dimensions.x*-.5+"px":0)+", "+("x"==this.pointer.xy?this.pointer.dimensions.y*-.5+"px":0)+")"),this.pointer.element.css("x"==this.pointer.xy?"width":"height",parseInt(this.pointer.dimensions[this.pointer.xy])+parseInt(this.container.css("border-"+this.pointer.alignAttribute+"-width"))),this.wrapper.addClass("jBox-pointerPosition-"+this.pointer.position)}if(this.setContent(this.options.content,!0),this.setTitle(this.options.title,!0),this.options.draggable){var s="title"==this.options.draggable?this.titleContainer:this.options.draggable.length>0?this.options.draggable:this.options.draggable.selector?jQuery(this.options.draggable.selector):this.wrapper;s.addClass("jBox-draggable").on("mousedown",function(t){if(2!=t.button&&!jQuery(t.target).hasClass("jBox-noDrag")&&!jQuery(t.target).parents(".jBox-noDrag").length){this.options.dragOver&&this.wrapper.css("zIndex")<=jBox.zIndexMax&&(jBox.zIndexMax+=1,this.wrapper.css("zIndex",jBox.zIndexMax));var i=this.wrapper.outerHeight(),s=this.wrapper.outerWidth(),o=this.wrapper.offset().top+i-t.pageY,e=this.wrapper.offset().left+s-t.pageX;jQuery(document).on("mousemove.jBox-draggable-"+this.id,function(t){this.wrapper.offset({top:t.pageY+o-i,left:t.pageX+e-s})}.bind(this)),t.preventDefault()}}.bind(this)).on("mouseup",function(){jQuery(document).off("mousemove.jBox-draggable-"+this.id)}.bind(this)),jBox.zIndexMax=jBox.zIndexMax?Math.max(jBox.zIndexMax,this.options.zIndex):this.options.zIndex}this._fireEvent("onCreated")}},this.options.constructOnInit&&this._create(),this.options.attach&&this.attach(),this._positionMouse=function(t){this.pos={left:t.pageX,top:t.pageY};var i=function(t,i){return"center"==this.options.position[i]?void(this.pos[t]-=Math.ceil(this.dimensions[i]/2)):(this.pos[t]+=t==this.options.position[i]?-1*this.dimensions[i]-this.options.offset[i]:this.options.offset[i],this.pos[t])}.bind(this);this.wrapper.css({left:i("left","x"),top:i("top","y")}),this.targetDimensions={x:0,y:0,left:t.pageX,top:t.pageY},this._adjustPosition()},this._attachEvents=function(){if(this.options.closeOnEsc&&jQuery(document).on("keyup.jBox-"+this.id,function(t){27==t.keyCode&&this.close({ignoreDelay:!0})}.bind(this)),(this.options.closeOnClick===!0||"body"==this.options.closeOnClick)&&jQuery(document).on("touchend.jBox-"+this.id+" click.jBox-"+this.id,function(t){this.blockBodyClick||"body"==this.options.closeOnClick&&(t.target==this.wrapper[0]||this.wrapper.has(t.target).length)||this.close({ignoreDelay:!0})}.bind(this)),(this.options.adjustPosition&&this.options.adjustTracker||this.options.reposition)&&!this.fixed&&this.outside){var t,i=0,s=150,o=function(){var o=(new Date).getTime();t||(o-i>s&&(this.options.reposition&&this.position(),this.options.adjustTracker&&this._adjustPosition(),i=o),t=setTimeout(function(){t=null,i=(new Date).getTime(),this.options.reposition&&this.position(),this.options.adjustTracker&&this._adjustPosition()}.bind(this),s))}.bind(this);this.options.adjustTracker&&"resize"!=this.options.adjustTracker&&jQuery(window).on("scroll.jBox-"+this.id,function(){o()}.bind(this)),(this.options.adjustTracker&&"scroll"!=this.options.adjustTracker||this.options.reposition)&&jQuery(window).on("resize.jBox-"+this.id,function(){o()}.bind(this))}"mouse"==this.options.target&&jQuery("body").on("mousemove.jBox-"+this.id,function(t){this._positionMouse(t)}.bind(this))},this._detachEvents=function(){this.options.closeOnEsc&&jQuery(document).off("keyup.jBox-"+this.id),(this.options.closeOnClick===!0||"body"==this.options.closeOnClick)&&jQuery(document).off("touchend.jBox-"+this.id+" click.jBox-"+this.id),(this.options.adjustPosition&&this.options.adjustTracker||this.options.reposition)&&(jQuery(window).off("scroll.jBox-"+this.id),jQuery(window).off("resize.jBox-"+this.id)),"mouse"==this.options.target&&jQuery("body").off("mousemove.jBox-"+this.id)},this._addOverlay=function(){this.overlay||(this.overlay=jQuery("#jBox-overlay").length?jQuery("#jBox-overlay").css({zIndex:Math.min(jQuery("#jBox-overlay").css("z-index"),this.options.zIndex-1)}):jQuery("<div/>",{id:"jBox-overlay"}).css({display:"none",opacity:0,zIndex:this.options.zIndex-1}).appendTo(jQuery("body")),("overlay"==this.options.closeButton||this.options.closeButton===!0)&&(jQuery("#jBox-overlay .jBox-closeButton").length>0?jQuery("#jBox-overlay .jBox-closeButton").on("touchend click",function(){this.isOpen&&this.close({ignoreDelay:!0})}.bind(this)):this.overlay.append(this.closeButton)),"overlay"==this.options.closeOnClick&&this.overlay.on("touchend click",function(){this.isOpen&&this.close({ignoreDelay:!0})}.bind(this)));var t=this.overlay.data("jBox")||{};t["jBox-"+this.id]=!0,this.overlay.data("jBox",t),"block"!=this.overlay.css("display")&&(this.options.fade?this.overlay.stop()&&this.overlay.animate({opacity:1},{queue:!1,duration:this.options.fade,start:function(){this.overlay.css({display:"block"})}.bind(this)}):this.overlay.css({display:"block",opacity:1}))},this._removeOverlay=function(){if(this.overlay){var t=this.overlay.data("jBox");delete t["jBox-"+this.id],this.overlay.data("jBox",t),jQuery.isEmptyObject(t)&&(this.options.fade?this.overlay.stop()&&this.overlay.animate({opacity:0},{queue:!1,duration:this.options.fade,complete:function(){this.overlay.css({display:"none"})}.bind(this)}):this.overlay.css({display:"none",opacity:0}))}},this._generateCSS=function(){if(!this.IE8){"object"!=jQuery.type(this.options.animation)&&(this.options.animation={pulse:{open:"pulse",close:"zoomOut"},zoomIn:{open:"zoomIn",close:"zoomIn"},zoomOut:{open:"zoomOut",close:"zoomOut"},move:{open:"move",close:"move"},slide:{open:"slide",close:"slide"},flip:{open:"flip",close:"flip"},tada:{open:"tada",close:"zoomOut"}}[this.options.animation]),this.options.animation.open&&(this.options.animation.open=this.options.animation.open.split(":")),this.options.animation.close&&(this.options.animation.close=this.options.animation.close.split(":")),this.options.animation.openDirection=this.options.animation.open?this.options.animation.open[1]:null,this.options.animation.closeDirection=this.options.animation.close?this.options.animation.close[1]:null,this.options.animation.open&&(this.options.animation.open=this.options.animation.open[0]),this.options.animation.close&&(this.options.animation.close=this.options.animation.close[0]),this.options.animation.open&&(this.options.animation.open+="Open"),this.options.animation.close&&(this.options.animation.close+="Close");var t={pulse:{duration:350,css:[["0%","scale(1)"],["50%","scale(1.1)"],["100%","scale(1)"]]},zoomInOpen:{duration:this.options.fade||180,css:[["0%","scale(0.9)"],["100%","scale(1)"]]},zoomInClose:{duration:this.options.fade||180,css:[["0%","scale(1)"],["100%","scale(0.9)"]]},zoomOutOpen:{duration:this.options.fade||180,css:[["0%","scale(1.1)"],["100%","scale(1)"]]},zoomOutClose:{duration:this.options.fade||180,css:[["0%","scale(1)"],["100%","scale(1.1)"]]},moveOpen:{duration:this.options.fade||180,positions:{top:{"0%":-12},right:{"0%":12},bottom:{"0%":12},left:{"0%":-12}},css:[["0%","translate%XY(%Vpx)"],["100%","translate%XY(0px)"]]},moveClose:{duration:this.options.fade||180,timing:"ease-in",positions:{top:{"100%":-12},right:{"100%":12},bottom:{"100%":12},left:{"100%":-12}},css:[["0%","translate%XY(0px)"],["100%","translate%XY(%Vpx)"]]},slideOpen:{duration:400,positions:{top:{"0%":-400},right:{"0%":400},bottom:{"0%":400},left:{"0%":-400}},css:[["0%","translate%XY(%Vpx)"],["100%","translate%XY(0px)"]]},slideClose:{duration:400,timing:"ease-in",positions:{top:{"100%":-400},right:{"100%":400},bottom:{"100%":400},left:{"100%":-400}},css:[["0%","translate%XY(0px)"],["100%","translate%XY(%Vpx)"]]},flipOpen:{duration:600,css:[["0%","perspective(400px) rotateX(90deg)"],["40%","perspective(400px) rotateX(-15deg)"],["70%","perspective(400px) rotateX(15deg)"],["100%","perspective(400px) rotateX(0deg)"]]},flipClose:{duration:this.options.fade||300,css:[["0%","perspective(400px) rotateX(0deg)"],["100%","perspective(400px) rotateX(90deg)"]]},tada:{duration:800,css:[["0%","scale(1)"],["10%, 20%","scale(0.9) rotate(-3deg)"],["30%, 50%, 70%, 90%","scale(1.1) rotate(3deg)"],["40%, 60%, 80%","scale(1.1) rotate(-3deg)"],["100%","scale(1) rotate(0)"]]}};jQuery.each(["pulse","tada"],function(i,s){t[s+"Open"]=t[s+"Close"]=t[s]});var i=function(i,s){return keyframe_css="@"+this.prefix+"keyframes jBox-animation-"+this.options.animation[i]+"-"+i+(s?"-"+s:"")+" {",jQuery.each(t[this.options.animation[i]].css,function(o,e){var n=s?e[1].replace("%XY",this._getXY(s).toUpperCase()):e[1];t[this.options.animation[i]].positions&&(n=n.replace("%V",t[this.options.animation[i]].positions[s][e[0]])),keyframe_css+=e[0]+" {"+this.prefix+"transform:"+n+";}"}.bind(this)),keyframe_css+="}",keyframe_css+=".jBox-animation-"+this.options.animation[i]+"-"+i+(s?"-"+s:"")+" {",keyframe_css+=this.prefix+"animation-duration: "+t[this.options.animation[i]].duration+"ms;",keyframe_css+=this.prefix+"animation-name: jBox-animation-"+this.options.animation[i]+"-"+i+(s?"-"+s:"")+";",keyframe_css+=t[this.options.animation[i]].timing?this.prefix+"animation-timing-function: "+t[this.options.animation[i]].timing+";":"",keyframe_css+="}"}.bind(this),s="";jQuery.each(["open","close"],function(o,e){return this.options.animation[e]&&t[this.options.animation[e]]&&("close"!=e||this.options.fade)?void(t[this.options.animation[e]].positions?jQuery.each(["top","right","bottom","left"],function(t,o){s+=i(e,o)}):s+=i(e)):""}.bind(this)),jQuery("<style/>").append(s).appendTo(jQuery("head"))}},this._blockBodyClick=function(){this.blockBodyClick=!0,setTimeout(function(){this.blockBodyClick=!1}.bind(this),10)},this.options.animation&&this._generateCSS(),this._animate=function(t){if(!this.IE8){if(t||(t=this.isOpen?"open":"close"),!this.options.fade&&"close"==t)return null;var i=this.options.animation[t+"Direction"]||("center"!=this.align?this.align:this.options.attributes.x);this.flipped&&this._getXY(i)==this._getXY(this.align)&&(i=this._getOpp(i));var s="jBox-animation-"+this.options.animation[t]+"-"+t+" jBox-animation-"+this.options.animation[t]+"-"+t+"-"+i;this.wrapper.addClass(s);var o=1e3*parseFloat(this.wrapper.css(this.prefix+"animation-duration"));"close"==t&&(o=Math.min(o,this.options.fade)),setTimeout(function(){this.wrapper.removeClass(s)}.bind(this),o)}},this._abortAnimation=function(){if(!this.IE8){var t="jBox-animation",i=this.wrapper.attr("class").split(" ").filter(function(i){return 0!==i.lastIndexOf(t,0)});this.wrapper.attr("class",i.join(" "))}},this._adjustPosition=function(){if(!this.options.adjustPosition)return null;this.positionAdjusted&&(this.wrapper.css(this.pos),this.pointer&&this.wrapper.css("padding",0).css("padding-"+this._getOpp(this.outside),this.pointer.dimensions[this._getXY(this.outside)]).removeClass("jBox-pointerPosition-"+this._getOpp(this.pointer.position)).addClass("jBox-pointerPosition-"+this.pointer.position),this.pointer&&this.pointer.element.attr("class","jBox-pointer jBox-pointer-"+this._getOpp(this.outside)).css(this.pointer.margin),this.positionAdjusted=!1,this.flipped=!1);var t=jQuery(window),i={x:t.width(),y:t.height(),top:this.options.fixed&&this.target.data("jBox-fixed")?0:t.scrollTop(),left:this.options.fixed&&this.target.data("jBox-fixed")?0:t.scrollLeft()};i.bottom=i.top+i.y,i.right=i.left+i.x;var s=i.top>this.pos.top-(this.options.adjustDistance.top||0),o=i.right<this.pos.left+this.dimensions.x+(this.options.adjustDistance.right||0),e=i.bottom<this.pos.top+this.dimensions.y+(this.options.adjustDistance.bottom||0),n=i.left>this.pos.left-(this.options.adjustDistance.left||0),a=n?"left":o?"right":null,h=s?"top":e?"bottom":null,r=a||h;if(r){"move"==this.options.adjustPosition||a!=this.outside&&h!=this.outside||("mouse"==this.target&&(this.outside="right"),("top"==this.outside||"left"==this.outside?i[this._getXY(this.outside)]-(this.targetDimensions[this._getTL(this.outside)]-i[this._getTL(this.outside)])-this.targetDimensions[this._getXY(this.outside)]+this.options.offset[this._getXY(this.outside)]:this.targetDimensions[this._getTL(this.outside)]-i[this._getTL(this.outside)]-this.options.offset[this._getXY(this.outside)])>this.dimensions[this._getXY(this.outside)]+parseInt(this.options.adjustDistance[this._getOpp(this.outside)])&&(this.wrapper.css(this._getTL(this.outside),this.pos[this._getTL(this.outside)]+(this.dimensions[this._getXY(this.outside)]+this.options.offset[this._getXY(this.outside)]*("top"==this.outside||"left"==this.outside?-2:2)+this.targetDimensions[this._getXY(this.outside)])*("top"==this.outside||"left"==this.outside?1:-1)),this.pointer&&this.wrapper.removeClass("jBox-pointerPosition-"+this.pointer.position).addClass("jBox-pointerPosition-"+this._getOpp(this.pointer.position)).css("padding",0).css("padding-"+this.outside,this.pointer.dimensions[this._getXY(this.outside)]),this.pointer&&this.pointer.element.attr("class","jBox-pointer jBox-pointer-"+this.outside),this.positionAdjusted=!0,this.flipped=!0));var p="x"==this._getXY(this.outside)?h:a;if(this.pointer&&"flip"!=this.options.adjustPosition&&this._getXY(p)==this._getOpp(this._getXY(this.outside))){if("center"==this.pointer.align)var l=this.dimensions[this._getXY(p)]/2-this.pointer.dimensions[this._getOpp(this.pointer.xy)]/2-parseInt(this.pointer.element.css("margin-"+this.pointer.alignAttribute))*(p!=this._getTL(p)?-1:1);else var l=p==this.pointer.alignAttribute?parseInt(this.pointer.element.css("margin-"+this.pointer.alignAttribute)):this.dimensions[this._getXY(p)]-parseInt(this.pointer.element.css("margin-"+this.pointer.alignAttribute))-this.pointer.dimensions[this._getXY(p)];spaceDiff=p==this._getTL(p)?i[this._getTL(p)]-this.pos[this._getTL(p)]+this.options.adjustDistance[p]:-1*(i[this._getOpp(this._getTL(p))]-this.pos[this._getTL(p)]-this.options.adjustDistance[p]-this.dimensions[this._getXY(p)]),p==this._getOpp(this._getTL(p))&&this.pos[this._getTL(p)]-spaceDiff<i[this._getTL(p)]+this.options.adjustDistance[this._getTL(p)]&&(spaceDiff-=i[this._getTL(p)]+this.options.adjustDistance[this._getTL(p)]-(this.pos[this._getTL(p)]-spaceDiff)),spaceDiff=Math.min(spaceDiff,l),l>=spaceDiff&&spaceDiff>0&&(this.pointer.element.css("margin-"+this.pointer.alignAttribute,parseInt(this.pointer.element.css("margin-"+this.pointer.alignAttribute))-spaceDiff*(p!=this.pointer.alignAttribute?-1:1)),this.wrapper.css(this._getTL(p),this.pos[this._getTL(p)]+spaceDiff*(p!=this._getTL(p)?-1:1)),this.positionAdjusted=!0)}}},this._fireEvent("onInit"),this}jBox.prototype.attach=function(t,i){return t||(t=jQuery(this.options.attach.selector||this.options.attach)),i||(i=this.options.trigger),t&&t.length&&jQuery.each(t,function(t,s){s=jQuery(s),s.data("jBox-attached-"+this.id)||("title"==this.options.getContent&&void 0!=s.attr("title")&&s.data("jBox-getContent",s.attr("title")).removeAttr("title"),this.attachedElements||(this.attachedElements=[]),this.attachedElements.push(s[0]),s.on(i+".jBox-attach-"+this.id,function(t){if(this.timer&&clearTimeout(this.timer),"mouseenter"!=i||!this.isOpen||this.source[0]!=s[0]){if(this.isOpen&&this.source&&this.source[0]!=s[0])var o=!0;this.source=s,!this.options.target&&(this.target=s),"click"==i&&this.options.preventDefault&&t.preventDefault(),this["click"!=i||o?"open":"toggle"]()}}.bind(this)),"mouseenter"==this.options.trigger&&s.on("mouseleave",function(t){(!this.options.closeOnMouseleave||t.relatedTarget!=this.wrapper[0]&&!jQuery(t.relatedTarget).parents("#"+this.id).length)&&this.close()}.bind(this)),s.data("jBox-attached-"+this.id,i),this._fireEvent("onAttach",s))}.bind(this)),this},jBox.prototype.detach=function(t){return t||(t=this.attachedElements||[]),t&&t.length&&jQuery.each(t,function(t,i){i=jQuery(i),i.data("jBox-attached-"+this.id)&&(i.off(i.data("jBox-attached-"+this.id)+".jBox-attach-"+this.id),i.data("jBox-attached-"+this.id,null)),this.attachedElements=jQuery.grep(this.attachedElements,function(t){return t!=i[0]})}.bind(this)),this},jBox.prototype.setTitle=function(t,i){!this.wrapper&&this._create();var s=this.wrapper.height(),o=this.wrapper.width();return null==t||void 0==t?this:(this.title||(this.titleContainer=jQuery("<div/>",{"class":"jBox-title"}),this.title=jQuery("<div/>").appendTo(this.titleContainer),this.wrapper.addClass("jBox-hasTitle"),("title"==this.options.closeButton||this.options.closeButton===!0&&!this.options.overlay)&&(this.wrapper.addClass("jBox-closeButton-title"),this.closeButton.appendTo(this.titleContainer)),this.titleContainer.insertBefore(this.content)),this.title.html(t),!i&&this.options.repositionOnContent&&(s!=this.wrapper.height()||o!=this.wrapper.width())&&this.position(),this)},jBox.prototype.setContent=function(t,i){if(null==t)return this;!this.wrapper&&this._create();var s=this.wrapper.height(),o=this.wrapper.width(),e=jQuery("body").height(),n=jQuery("body").width();switch(this.content.children("[data-jbox-content-appended]").appendTo("body").css({display:"none"}),jQuery.type(t)){case"string":this.content.html(t);break;case"object":this.content.html(""),t.attr("data-jbox-content-appended",1).appendTo(this.content).css({display:"block"})}var a={x:n-jQuery("body").width(),y:e-jQuery("body").height()};return!i&&this.options.repositionOnContent&&(s!=this.wrapper.height()||o!=this.wrapper.width())&&this.position({adjustOffset:a}),this},jBox.prototype.setDimensions=function(t,i,s){!this.wrapper&&this._create(),this.content.css(t,i),(void 0==s||s)&&this.position()},jBox.prototype.setWidth=function(t,i){this.setDimensions("width",t,i)},jBox.prototype.setHeight=function(t,i){this.setDimensions("height",t,i)},jBox.prototype.position=function(t){if(t||(t={}),this.target=t.target||this.target||this.options.target||jQuery(window),this.dimensions={x:this.wrapper.outerWidth(),y:this.wrapper.outerHeight()},"mouse"!=this.target){if("center"==this.options.position.x&&"center"==this.options.position.y)return this.wrapper.css({left:"50%",top:"50%",marginLeft:this.dimensions.x*-.5+this.options.offset.x,marginTop:this.dimensions.y*-.5+this.options.offset.y}),this;var i=this.target.offset();!this.target.data("jBox-fixed")&&this.target.data("jBox-fixed",this.target[0]==jQuery(window)[0]||"fixed"!=this.target.css("position")&&this.target.parents().filter(function(){return"fixed"==jQuery(this).css("position")}).length<=0?"static":"fixed"),"fixed"==this.target.data("jBox-fixed")&&this.options.fixed&&(i.top=i.top-jQuery(window).scrollTop(),i.left=i.left-jQuery(window).scrollLeft()),this.targetDimensions={x:this.target.outerWidth(),y:this.target.outerHeight(),top:i?i.top:0,left:i?i.left:0},this.pos={};var s=function(t){if(-1==jQuery.inArray(this.options.position[t],["top","right","bottom","left","center"]))return void(this.pos[this.options.attributes[t]]=this.options.position[t]);var i=this.options.attributes[t]="x"==t?"left":"top";return this.pos[i]=this.targetDimensions[i],"center"==this.options.position[t]?void(this.pos[i]+=Math.ceil((this.targetDimensions[t]-this.dimensions[t])/2)):(i!=this.options.position[t]&&(this.pos[i]+=this.targetDimensions[t]-this.dimensions[t]),void((this.options.outside==t||"xy"==this.options.outside)&&(this.pos[i]+=this.dimensions[t]*(i!=this.options.position[t]?1:-1))))
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }.bind(this);if(s("x"),s("y"),this.options.pointer&&"number"!=jQuery.type(this.options.position.x)&&"number"!=jQuery.type(this.options.position.y)){var o=0;switch(this.pointer.align){case"center":"center"!=this.options.position[this._getOpp(this.options.outside)]&&(o+=this.dimensions[this._getOpp(this.options.outside)]/2);break;default:switch(this.options.position[this._getOpp(this.options.outside)]){case"center":o+=(this.dimensions[this._getOpp(this.options.outside)]/2-this.pointer.dimensions[this._getOpp(this.options.outside)]/2)*(this.pointer.align==this._getTL(this.pointer.align)?1:-1);break;default:o+=this.pointer.align!=this.options.position[this._getOpp(this.options.outside)]?this.dimensions[this._getOpp(this.options.outside)]*(-1!==jQuery.inArray(this.pointer.align,["top","left"])?1:-1)+this.pointer.dimensions[this._getOpp(this.options.outside)]/2*(-1!==jQuery.inArray(this.pointer.align,["top","left"])?-1:1):this.pointer.dimensions[this._getOpp(this.options.outside)]/2*(-1!==jQuery.inArray(this.pointer.align,["top","left"])?1:-1)}}o*=this.options.position[this._getOpp(this.options.outside)]==this.pointer.alignAttribute?-1:1,o+=this.pointer.offset*(this.pointer.align==this._getOpp(this._getTL(this.pointer.align))?1:-1),this.pos[this._getTL(this._getOpp(this.pointer.xy))]+=o}return t.adjustOffset&&t.adjustOffset.x&&(this.pos[this.options.attributes.x]+=parseInt(t.adjustOffset.x)*("left"==this.options.attributes.x?1:-1)),t.adjustOffset&&t.adjustOffset.y&&(this.pos[this.options.attributes.y]+=parseInt(t.adjustOffset.y)*("top"==this.options.attributes.y?1:-1)),this.pos[this.options.attributes.x]+=this.options.offset.x,this.pos[this.options.attributes.y]+=this.options.offset.y,this.wrapper.css(this.pos),this._adjustPosition(),this}},jBox.prototype.open=function(t){if(t||(t={}),this.isDestroyed)return!1;if(!this.wrapper&&this._create(),this.timer&&clearTimeout(this.timer),this._blockBodyClick(),this.isDisabled)return this;var i=function(){this.source&&this.options.getTitle&&(this.source.attr(this.options.getTitle)&&this.setTitle(this.source.attr(this.options.getTitle)),!0),this.source&&this.options.getContent&&(this.source.data("jBox-getContent")?this.setContent(this.source.data("jBox-getContent"),!0):this.source.attr(this.options.getContent)?this.setContent(this.source.attr(this.options.getContent),!0):null),this._fireEvent("onOpen"),(this.options.ajax&&this.options.ajax.url&&(!this.ajaxLoaded||this.options.ajax.reload)||t.ajax&&t.ajax.url)&&this.ajax(t.ajax||null),(!this.positionedOnOpen||this.options.repositionOnOpen)&&this.position({target:t.target})&&(this.positionedOnOpen=!0),this.isClosing&&this._abortAnimation(),this.isOpen||(this.isOpen=!0,this._attachEvents(),this.options.blockScroll&&jQuery("body").addClass("jBox-blockScroll-"+this.id),this.options.overlay&&this._addOverlay(),this.options.animation&&!this.isClosing&&this._animate("open"),this.options.fade?this.wrapper.stop().animate({opacity:1},{queue:!1,duration:this.options.fade,start:function(){this.isOpening=!0,this.wrapper.css({display:"block"})}.bind(this),always:function(){this.isOpening=!1}.bind(this)}):this.wrapper.css({display:"block",opacity:1}))}.bind(this);return!this.options.delayOpen||this.isOpen||this.isClosing||t.ignoreDelay?i():this.timer=setTimeout(i,this.options.delayOpen),this},jBox.prototype.close=function(t){if(t||(t={}),this.isDestroyed)return!1;if(this.timer&&clearTimeout(this.timer),this._blockBodyClick(),this.isDisabled)return this;var i=function(){this._fireEvent("onClose"),this.isOpen&&(this.isOpen=!1,this._detachEvents(),this.options.blockScroll&&jQuery("body").removeClass("jBox-blockScroll-"+this.id),this.options.overlay&&this._removeOverlay(),this.options.animation&&!this.isOpening&&this._animate("close"),this.options.fade?this.wrapper.stop().animate({opacity:0},{queue:!1,duration:this.options.fade,start:function(){this.isClosing=!0}.bind(this),complete:function(){this.wrapper.css({display:"none"}),this.options.onCloseComplete&&this.options.onCloseComplete.bind(this)(),this.options._onCloseComplete&&this.options._onCloseComplete.bind(this)()}.bind(this),always:function(){this.isClosing=!1}.bind(this)}):(this.wrapper.css({display:"none",opacity:0}),this.options._onCloseComplete&&this.options._onCloseComplete.bind(this)()))}.bind(this);return t.ignoreDelay?i():this.timer=setTimeout(i,Math.max(this.options.delayClose,10)),this},jBox.prototype.toggle=function(t){return this[this.isOpen?"close":"open"](t),this},jBox.prototype.disable=function(){return this.isDisabled=!0,this},jBox.prototype.enable=function(){return this.isDisabled=!1,this},jBox.prototype.ajax=function(t){t||(t={}),this.options.ajax.getData&&!t.data&&this.source&&void 0!=this.source.attr(this.options.ajax.getData)&&(t.data=this.source.attr(this.options.ajax.getData)||"");var i=jQuery.extend(!0,{},this.options.ajax);this.ajaxRequest&&this.ajaxRequest.abort();var s=t.beforeSend||i.beforeSend||function(){},o=t.complete||i.complete||function(){},e=jQuery.extend(!0,i,t);return e.beforeSend=function(){e.spinner&&(this.wrapper.addClass("jBox-loading"),this.spinner=jQuery(e.spinner!==!0?e.spinner:'<div class="jBox-spinner"></div>').appendTo(this.container)),s.bind(this)()}.bind(this),e.complete=function(t){this.wrapper.removeClass("jBox-loading"),this.spinner&&this.spinner.remove(),e.setContent&&this.setContent(t.responseText),this.ajaxLoaded=!0,o.bind(this)(t)}.bind(this),this.ajaxRequest=jQuery.ajax(e),this},jBox.prototype.audio=function(t){if(t||(t={}),jBox._audio||(jBox._audio={}),!t.url||this.IE8)return this;if(!jBox._audio[t.url]){var i=jQuery("<audio/>");jQuery("<source/>",{src:t.url+".mp3"}).appendTo(i),jQuery("<source/>",{src:t.url+".ogg"}).appendTo(i),jBox._audio[t.url]=i[0]}jBox._audio[t.url].volume=Math.min(void 0!=t.volume?t.volume:(void 0!=this.options.volume?this.options.volume:100)/100,1),jBox._audio[t.url].pause();try{jBox._audio[t.url].currentTime=0}catch(s){}return jBox._audio[t.url].play(),this},jBox.prototype.destroy=function(){return this.detach().close({ignoreDelay:!0}),this.wrapper&&this.wrapper.remove(),this.isDestroyed=!0,this},jBox._getUniqueID=function(){var t=1;return function(){return t++}}(),jQuery.fn.jBox=function(t,i){return t||(t={}),i||(i={}),new jBox(t,jQuery.extend(i,{attach:this}))},Function.prototype.bind||(Function.prototype.bind=function(t){var i=Array.prototype.slice.call(arguments,1),s=this,o=function(){},e=function(){return s.apply(this instanceof o&&t?this:t,i.concat(Array.prototype.slice.call(arguments)))};return o.prototype=this.prototype,e.prototype=new o,e});
// scrollstop
!function(factory){"function"==typeof define&&define.amd?define(["jquery"],factory):"object"==typeof exports?module.exports=factory(require("jquery")):factory(jQuery)}(function($){var dispatch=$.event.dispatch||$.event.handle,special=$.event.special,uid1="D"+ +new Date,uid2="D"+(+new Date+1);special.scrollstart={setup:function(data){var timer,_data=$.extend({latency:special.scrollstop.latency},data),handler=function(evt){var _self=this,_args=arguments;timer?clearTimeout(timer):(evt.type="scrollstart",dispatch.apply(_self,_args)),timer=setTimeout(function(){timer=null},_data.latency)};$(this).bind("scroll",handler).data(uid1,handler)},teardown:function(){$(this).unbind("scroll",$(this).data(uid1))}},special.scrollstop={latency:250,setup:function(data){var timer,_data=$.extend({latency:special.scrollstop.latency},data),handler=function(evt){var _self=this,_args=arguments;timer&&clearTimeout(timer),timer=setTimeout(function(){timer=null,evt.type="scrollstop",dispatch.apply(_self,_args)},_data.latency)};$(this).bind("scroll",handler).data(uid2,handler)},teardown:function(){$(this).unbind("scroll",$(this).data(uid2))}}});


function resetrenameRepose(){
    $("#id-renamerepose").val("");
}
function fnewresetrepose(){
    $("#id-newrepose").val("");
}

function formatTrashRepository(repos) {
    var HTML = '';
    repos.forEach(function(r) {
        var repoid = r.repoId;
        var name = r.repoName;
        var size = uploadFileSizeConvertTip(r.repoSize);
        var deleteTime = moment(r.deleteTime).format("YYYY-MM-DD HH:mm:ss");

        var html = '';
        html += '<tr class-"tr-border">';
        html += '	<th class="th-1"><input type="checkbox" /></th>';
        html += '	<th class="th-2"><i class="icon-ownsign-hollow all-icon"></i><span repoid="{0}" title="{1}">{1}</span></th>';
        html += '	<th class="th-3">';
        html += '		<i repoid="{0}" title="{2}" class="icon-bin all-icon" onclick="permanentDelete(this)"></i>';
        html += '		<i repoid="{0}" title="{3}" class="icon-history all-icon" onclick="restoreRepository(this)"></i>';
        html += '	<th class="th-4">{4}</th>';
        html += '	<th class="th-5">{5}</th>';
        html += '</th>';

        HTML += html.format(repoid, name, '永久删除', '还原', size, deleteTime);
    });
    return HTML;
}

$("#id-trash").unbind().bind('click',function(){
    $("#newRepos").addClass('hidden');
    // TODO: 修改表头为
    // 名称 | 操作 | 删除时间 |
    var html = '';
    $.ajax({
	url:'/wesign/repos/deleted',
	async:false,
	type:'GET',
	dataType:'json',
	contentType:'application/json',
	success:function(data){
	    var status = data.status;
	    var dd = data.data;

	    if(status == 0 && dd){
		html = formatTrashRepository(dd);	
	    }
	}
    });
    $("#repo-table").html(html);
});

/**
 * 发送请求获取分类文件信息
 */
function fetchFileByCategory(category) {
    var categoryFiles = [];
    $.ajax({
        url: '/wesign/repos/' + category,
        async: false,
        type: 'GET',
        contentType: 'application/json',
        success: function(data) {
            if (data.status == 0 && data.data) {
                categoryFiles = data.data;
            }
            // TODO: 错误处理
        }
    });

    return categoryFiles;
}

function formatCategoryFileInfo(repoId, file) {
    var HTML = '';
    
    if (file && file instanceof Array) {
        console.log(repoId);
        file.forEach(function(f) {
            var name = f.filename;
            var path = (typeof f.path == 'undefined') ? '' : f.path;
            var size = uploadFileSizeConvertTip(f.size);
            var time = moment(f.mtime).format("YYYY-MM-DD HH:mm:ss");
            var html = '';
            html += '<tr class="tr-border">';
            html += '	<th class="th-1"><input type="checkbox" /></th>';
            html += '	<th class="th-2"><span title="{0}" repoid="{1}" path="{2}" name="{0}">{0}</span></th>';
            html += '	<th class="th-3">';
            html += '		<i title="{3}" repoid="{1}" path="{2}" name="{0}" class="icon-bin all-icon" onclick="deleteFile(this)"></i>';
            html += '		<i>';
            html += '			<a title="{4}" repoid="{1}" path="{2}" name="{0}" class="icon-download3 all-icon" onclick="downloadFile(this)">';
            html += '			<a id="down" style="visibility: hidden;>"</a>';
            html += '		</i>';
            html += '		<i title="{5}" repoid="{1}" path="{2}" name="{0}" class="icon-history all-icon" onclick="getFileHistory(this)"></i>';
            html += '	</th>';
            html += '	<th class="th-4">{6}</th>';
            html += '	<th class="th-5">{7}</th>';
            HTML += html.format(name, repoId, path, '删除', '下载', '历史记录', size, time);
        });
    }
    return HTML;
}

function formatCategoryFiles(categoryFiles) {
    var html = '';
    categoryFiles.forEach(function(files) {
        var repoId = files.repoId;
        var repoName = files.repoName;        
        var fileInfos = files.fileInfo;
        html += formatCategoryFileInfo(repoId, fileInfos);
    });
    return html;
}

//分类获取文件信息id-myword
$("#id-myword").unbind().bind('click',function(){
    $("#newRepos").addClass('hidden');
    var categoryFiles = fetchFileByCategory('doc');
    var html = formatCategoryFiles(categoryFiles);
    $("#repo-table").html(html);
});
//分类获取文件信息id-mymovei
$("#id-mymovei").unbind().bind('click',function(){
    $("#newRepos").addClass('hidden');
    $.ajax({
	url:'/wesign/repos/video',
	async:false,
	type:'GET',
	dataType:'json',
	contentType:'application/json',
	success:function(data){
	    var status = data.status;
	    var Data = data.data;
	    var html = "";
	    if(status == 0){
		console.log(data);
		Data.forEach(function(e){
		    if(e.type == "file"){
			html += '<tr class="tr-border">'
			    +'<th class="th-1"><input type="checkbox"/></th>'
			    +'<th class="th-2"><span title="'+e.filename+'">' +e.filename+ '<span></th>'
			    +'<th class="th-3"><i  title="'+e.filename+'" class="icon-bin all-icon" onclick="fwriteNextDelete(this)"></i>'
			    +'<i  title="'+e.filename+'" class="icon-write-down all-icon deal-method" onclick="fwriteNext(this)"></i>'
			    +'<i class="icon-download3 all-icon" onclick="fwriteNextDown(this)"></i>'
			    +'<i class="icon-copy all-icon" onclick="fcopyNext(this)"></i>'
			    +'<i class="icon-remove all-icon" onclick="fmoveNext(this)"></i>'
			    +'<i class="icon-history all-icon" onclick="fhistoryNext(this)"></i></th>'
			    +'<th class="th-4">'+uploadFileSizeConvertTip(e.size)+'</th>'
			    +'<th class="th-5">'+ moment(e.mtime).format("YYYY-MM-DD HH:mm:ss") +'</th>'
			    +'</tr>';
		    }
		});
		$("#repo-table").html(html);
	    }
	}
    });
});
