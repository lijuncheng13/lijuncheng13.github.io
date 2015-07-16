var waterFall = {
    container: document.getElementById("container"),
    columnNumber: 1,
    columnWidth: 300,
    // 
    rootImage: "./pictures/",
    maxIndex: 2138,
    indexImage: 0,

    scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
    //detectLeft: 0,

    loadFinish: false,

    // 返回固定格式的图片名
    getIndex: function() {
        var index = this.indexImage + '';
        while (index.length < 4) {
            index = '0' + index;
        }
        return index;
    },

    // 是否滚动载入的检测
    appendDetect: function() {
        var start = 0;
        for (start; start < this.columnNumber; start++) {
            var eleColumn = document.getElementById("waterFallColumn_" + start);
            if (eleColumn && !this.loadFinish) {
                if (eleColumn.offsetTop + eleColumn.clientHeight + 10 < this.scrollTop + (window.innerHeight || document.documentElement.clientHeight)) {
                    for (var i = 0; i < 3; i++) {
                        this.appendImage(eleColumn);
                    }
                }
            }
        }

        return this;
    },

    // 滚动载入
    appendImage: function(column) {
        this.indexImage += 1;
        var html = '';
        var index = this.getIndex();
        var imgUrl = this.rootImage + index + '_downbank' + ".jpg";

        // 图片尺寸
        /*
        var aEle = document.createElement("a");
        aEle.href = "###";
        aEle.className = "pic_a";
        aEle.innerHTML = '<img src="' + imgUrl + '" class="a_img" /><strong>' + index + '</strong>';
        column.appendChild(aEle);
        */
        var aEle = '<a href="###" class="pic_a"><img id="' + index + '" src="' + this.rootImage + index + '_downbank' + '.jpg" class="a_img" /><strong>' + index + '</strong></a>';
        $('#' + column.id).append(aEle);
        
        $('#' + index).on("load", function(){
            $(this).fadeIn(1000);
        });
        $('#' + index).on('click', onClickImg);

        if (index >= this.maxIndex) {
            //alert("图片加载光光了！");
            this.loadFinish = true;
        }

        return this;
    },

    // 页面加载初始创建
    create: function() {
        this.columnNumber = Math.floor(document.body.clientWidth / this.columnWidth);

        var start = 0,
        htmlColumn = '',
        self = this;
        for (start; start < this.columnNumber; start += 1) {
            htmlColumn = htmlColumn + '<span id="waterFallColumn_' + start + '" class="column" style="width:' + this.columnWidth + 'px;">' +
            function() {
                var html = '',
                i = 0;
                for (i = 0; i < 5; i += 1) {
                    self.indexImage = start + self.columnNumber * i;
                    var index = self.getIndex();
                    html = html + '<a href="###" class="pic_a"><img src="' + self.rootImage + index + '_downbank' + '.jpg" class="a_img" /><strong>' + index + '</strong></a>';
                }
                return html;
            } () + '</span> ';
        }
        //htmlColumn += '<span id="waterFallDetect" class="column" style="width:' + this.columnWidth + 'px;"></span>';

        this.container.innerHTML = htmlColumn;

        //this.detectLeft = document.getElementById("waterFallDetect").offsetLeft;
        return this;
    },

    refresh: function() {
        var arrHtml = [];
        var arrTemp = [];
        var htmlAll = '';
        var start = 0;
        var maxLength = 0;
        for (start; start < this.columnNumber; start += 1) {
            var arrColumn = document.getElementById("waterFallColumn_" + start).innerHTML.match(/<a(?:.|\n|\r|\s)*?a>/gi);
            if (arrColumn) {
                maxLength = Math.max(maxLength, arrColumn.length);
                // arrTemp是一个二维数组
                arrTemp.push(arrColumn);
            }
        }

        // 需要重新排序
        var lengthStart, arrStart;
        for (lengthStart = 0; lengthStart < maxLength; lengthStart++) {
            for (arrStart = 0; arrStart < this.columnNumber; arrStart++) {
                if (arrTemp[arrStart][lengthStart]) {
                    arrHtml.push(arrTemp[arrStart][lengthStart]);
                }
            }
        }

        if (arrHtml && arrHtml.length !== 0) {
            // 新栏个数		
            this.columnNumber = Math.floor(document.body.clientWidth / this.columnWidth);

            // 计算每列的行数
            // 向下取整
            var line = Math.floor(arrHtml.length / this.columnNumber);

            // 重新组装HTML
            var newStart = 0,
            htmlColumn = '',
            self = this;
            for (newStart; newStart < this.columnNumber; newStart += 1) {
                htmlColumn = htmlColumn + '<span id="waterFallColumn_' + newStart + '" class="column" style="width:' + this.columnWidth + 'px;">' +
                function() {
                    var html = '',
                    i = 0;
                    for (i = 0; i < line; i += 1) {
                        html += arrHtml[newStart + self.columnNumber * i];
                    }
                    // 是否补足余数
                    html = html + (arrHtml[newStart + self.columnNumber * line] || '');

                    return html;
                } () + '</span> ';
            }
            //htmlColumn += '<span id="waterFallDetect" class="column" style="width:' + this.columnWidth + 'px;"></span>';

            this.container.innerHTML = htmlColumn;

            //this.detectLeft = document.getElementById("waterFallDetect").offsetLeft;

            // 检测
            this.appendDetect();
        }

        //document.getElementById('container').style.width = '' + (this.columnWidth + 10) * this.columnNumber;

        return this;
    },

    // 滚动加载
    scroll: function() {
        var self = this;
        window.onscroll = function() {
            // 为提高性能，滚动前后距离大于100像素再处理
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (!this.loadFinish && Math.abs(scrollTop - self.scrollTop) > 100) {
                self.scrollTop = scrollTop;
                self.appendDetect();
            }

        };
        return this;
    },

    // 浏览器窗口大小变换
    resize: function() {
        var self = this;
        window.onresize = function() {
            /*
            var eleDetect = document.getElementById("waterFallDetect");
            var detectLeft = eleDetect && eleDetect.offsetLeft;
            if (detectLeft && Math.abs(detectLeft - self.detectLeft) > 50) {
                // 检测标签偏移异常，认为布局要改变
                self.refresh();
            }
            */
            if (window.clientWidth / this.columnWidth != this.columnNumber) {
                self.refresh();
                $(".a_img").on('click', onClickImg);
            }
        };
        return this;
    },
    init: function() {
        if (this.container) {
            this.create().scroll().resize();
        }
    }
};

waterFall.init();

/*
$(".a_img").one('load', function() {
  // do stuff
  $(this).fadeIn(1000);
}).each(function() {
  if(this.complete) $(this).load();
});
*/

$(".a_img").on("load", function(){
    $(this).fadeIn(1000);
});

/*
$.getJSON("./img.js", function(data) {
    window.console.log(data);
});
*/

$(".a_img").on('click', onClickImg);

$("#show_detail").on('click', function(e) {
    e.preventDefault();
    $("body").removeClass("noScroll");
    $('.show_detail_content').remove();
    $("#show_detail").css("display", "none");
})

function onClickImg(e) {
    e.preventDefault();
    $("body").addClass("noScroll");
    $("#show_detail").css("display", "block");
    $('#show_detail').scrollTop(0);
    $('#show_detail').append('<div class="show_detail_content"></div>');
    var detail = '';
    detail = '<img class="pic_detail" />';
    $('.show_detail_content').append(detail);
    $('.pic_detail').attr("src", $(e.target).attr("src"));
    $('.pic_detail').load(function(e) {
        if ($(this).clientWidth > $('.show_detail_content').clientWidth * 0.98) {
            $(this).style.width = $('.show_detail_content').clientWidth * 0.98;
        }
    });

    $.getJSON('./json/comments.js', function(data) {
        $('.show_detail_content').append('<ol class="comments_container"></div>');
        var n = new Array();
        for (var i = 1; i <= data[0].length; i++) {
            n.push(i);
        }
        n.forEach(function(i) {
            $('.comments_container').append('<li class="comment" id="comments_' + i + '"></li>');

            $('#comments_' + i).append('<div class="comment_meta" id="comment_meta_' + i + '"></div>');

            $('#comment_meta_' + i).append('<img src="' + data[0].img_root + data[i].user_id + data[0].img_format + '" id="comment_meta_img_' + i +  '" alt=""></img>');
            //$('#comment_meta_img_' + i).css("src", data[0].img_root + data[i].user_id + data[0].img_format);
            $('#comment_meta_img_' + i).css("width", 50);
            $('#comment_meta_img_' + i).css("height", 50);

            $('#comment_meta_' + i).append('<h4 id="comment_meta_user_' + i +  '"></h4>');
            $('#comment_meta_user_' + i).append(data[i].user_name);

            $('#comment_meta_' + i).append('<span id="comment_meta_date_' + i +  '"></span>');
            $('#comment_meta_date_' + i).append(data[i].date);

            $('#comments_' + i).append('<blockquote id="comments_content_' + i + '"></blockquote>');
            /*
            if (data[i].user_id === 0) {
                $('#comments_' + i).addClass("left");
            }
            else {
                $('#comments_' + i).addClass("right");
            }
            */
            $.getJSON(data[i].content_src, function(text) {
                $('#comments_content_' + i).append('<p>' + text[data[i].content_id].content + '</p>');
            });
        });
            
    });
}