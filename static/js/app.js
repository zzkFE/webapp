(function(){
	var app=function(){
		this.option={};
	}
	app.prototype.init=function(option){
		this.option= $.extend(this.option,option);
		this.loadDefaultContent();
		this.addEvent();
	}
	app.prototype.addEvent=function(){
		var that=this;
		//监听hash值改变事件
		window.onhashchange=function(e){
			//获取当前hash
			var hash= that.getHash();
			//激活当前导航
			that.acitveCurNav(hash);
			//展开当前页面
			that.loadCurContent(hash);
		}
		//监听导航菜单点击事件
		$(this.option.navItem).on("tap click",function(){
			window.location.hash=$(this).attr("viewtarget");
			return false;
		})
		//双击当前菜单直接刷新页面
		$(this.option.navItem).on("longTap dblclick",function(){
			if($(this).hasClass('active')){
				//获取当前hash
				var hash= that.getHash();
				//刷新当前页面
				that.loadCurContent(hash,true);
			}
			return false;
		})

		//下滑刷新当前
		/*$("body").on("swipeDown",function(e){
			$(".app-content").addClass('loading');
			var startTimes = new Date().getTime();
			//获取当前hash
			var hash= that.getHash();
			//刷新当前页面
			that.loadCurContent(hash,true,function(){
				var nowTimes = new Date().getTime();
				if((nowTimes - startTimes) >2000){
					$(".app-content").removeClass('loading');
				}
				else{
					setTimeout(function(){
						$(".app-content").removeClass('loading');
					},1000-nowTimes+startTimes)
				}
				
			});
		});*/

		$(".app-conatiner").on("click",".view-header span.icon-left",function(){
			window.history.go(-1);
		})
		
	}
	app.prototype.acitveCurNav=function(hash){
		var element = $("#nav-"+hash);
		if($(element).hasClass('active') == false){
			$(this.option.navItem).removeClass('active');
			$(element).addClass('active');
		}
	}
	app.prototype.loadCurContent=function(hash,status,callback){
		var element = $("#conatiner-"+hash);
		var href = $(element).attr("viewhref");
		if(href){
			var target = $(element).attr("viewtarget");
			$(element)
				.addClass("active")
				.siblings("div").removeClass('active');
			if(!$(element).data("pageload") || status==true){
				$(element).load(href,function(){
					callback && callback()
				});
				$(element).data("pageload",true);
			}
			
		}
	}
	app.prototype.getHash=function(){
		var hash= window.location.hash.substring(1);
		if($("#nav-"+hash).length==0){
			hash = "home";
		}
		return hash;
	}
	app.prototype.loadDefaultContent=function(){
		var that=this;
		var hash = this.getHash();

		$.each($(this.option.navItem),function(){
			if($(this).attr("viewtarget")==hash){
				//激活当前导航
				that.acitveCurNav(hash);
				//展开当前页面
				that.loadCurContent(hash);
			}
		})
	}

	var app_instance = new app();
	app_instance.init({
		"navItem":".nav-item"
	});
	console.log(app_instance)
})();
(function(window) {
  	// 如果浏览器原生支持该事件,则退出  
	if ( "onhashchange" in window.document.body ) { return; }

	  var location = window.location,
	    oldURL = location.href,
	    oldHash = location.hash;

	  // 每隔100ms检测一下location.hash是否发生变化
	  setInterval(function() {
	    var newURL = location.href,
	      newHash = location.hash;

	    // 如果hash发生了变化,且绑定了处理函数...
	    if ( newHash != oldHash && typeof window.onhashchange === "function" ) {
	      // execute the handler
	      window.onhashchange({
	        type: "hashchange",
	        oldURL: oldURL,
	        newURL: newURL
	      });

	      oldURL = newURL;
	      oldHash = newHash;
	    }
	  }, 100);

})(window);


//列表滚动
(function(){
	var bannerLen = $(".banner-view .banner .banner-list").length;
	var setBannerWidth= function(){
		$(".banner-view .banner").css({
			"width":bannerLen*($(window).width()+5)
		})
		$(".banner-view .banner .banner-list").css({
			"width":$(window).width()
		})
	};
	setBannerWidth();
	$(window).on("resize",function(){
		setBannerWidth();
	})
	var curreneScroll=0;
	var scrollDirection = 1; //1前进 0后退
	var scrollbanner=function(){
		$(".banner-view .banner").css({
			"margin-left":-($(window).width()+5)*curreneScroll
		})
		$(".banner-view .banner-icon .banner-icon-btn").eq(curreneScroll).addClass('active').siblings(".banner-icon-btn").removeClass('active');
	}
	scrollbanner();
	var scrollTimer=null;
	var startTimer=function(){
		clearInterval(scrollTimer);
		scrollTimer= setInterval(function(){
			if(scrollDirection==1){
				if(curreneScroll >= bannerLen-1){
					scrollDirection=0;
					curreneScroll--;
				}
				else{
					curreneScroll++;
				}
			}
			else{
				if(curreneScroll <= 0){
					scrollDirection=1;
					curreneScroll++;
				}
				else{
					curreneScroll--;
				}
			}
			scrollbanner();
		},3500);
	}
	startTimer();
	$(".banner-view .banner").on("swipeLeft",function(){
		if(curreneScroll<bannerLen-1){
			clearInterval(scrollTimer);
			curreneScroll++;
			scrollbanner();
			setTimeout(function(){
				startTimer();
			}, 700);
		}
	});
	$(".banner-view .banner").on("swipeRight",function(){
		if(curreneScroll>0){
			clearInterval(scrollTimer);
			curreneScroll--;
			scrollbanner();
			setTimeout(function(){
				startTimer();
			}, 700);
		}
	});
})()