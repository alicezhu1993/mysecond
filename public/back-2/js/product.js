$(function () {
  var currentPage=1;
  var pageSize=2;
  var picArr=[];
  //渲染页面
  render();
  function render() {
    $.ajax({
      type:"GET",
      url:"/product/queryProductDetailList",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:"json",
      success:function (info) {
        console.log(info);
        var htmlStr=template("productTpl",info);
        $('tbody').html(htmlStr);
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:info.page,
          totalPages:Math.ceil(info.total/info.size),
          onPageClicked:function (a,b,c,page) {
            currentPage=page;
            render();
          }
        })
      }
    })
  };
  
  //添加模态框
  $('#addBtn').click(function () {
    $('#addModal').modal('show');
    $.ajax({
      type:"GET",
      url:"/category/querySecondCategoryPaging",
      data:{
        page:1,
        pageSize:100
      },
      dataType:"json",
      success:function (info) {
        console.log(info);
        var htmlStr=template("dropdownTpl",info);
        $('.dropdown-menu').html(htmlStr);
      }
    });
  });
  
  //下拉菜单
  $('.dropdown-menu').on("click","a",function () {
    var txt=$(this).text();
    $('#dropdownText').text(txt);
    var id=$(this).data('id');
    $('[name="brandId"]').val(id);
    $("#form").data('bootstrapValidator').updateStatus("brandId","VALID");
  });
  
  //上传图片
  $('#fileupload').fileupload({
    dataType:"json",
    done:function (e,data) {
      console.log(data.result);
      var picObj=data.result;
      var picUrl=picObj.picAddr;
      
      picArr.unshift(picObj);
      $('#imgBox').prepend('<img src="'+picUrl+'" alt="">');
      
      if(picArr.length>3){
        picArr.pop();
        $('#imgBox img:last-of-type').remove();
      }
      if(picArr.length===3){
        $("#form").data('bootstrapValidator').updateStatus("picStatus","VALID");
      }
      console.log(picArr);
    }
  });
  
  //初始化表单校验插件
  $('#form').bootstrapValidator({
    excluded:[],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      brandId:{
        validators:{
          notEmpty:{
            message:"请选择二级分类"
          }
        }
      },
      proName:{
        validators:{
          notEmpty:{
            message:"请输入商品名称"
          }
        }
      },
      proDesc:{
        validators:{
          notEmpty:{
            message:"请输入商品名称"
          }
        }
      },
      num:{
        validators:{
          notEmpty:{
            message:"请输入商品名称"
          },
          regexp:{
            regexp:/^[1-9]\d*$/,
            message:"商品库存格式, 必须是非零开头的数字"
          }
        }
      },
      size:{
        validators:{
          notEmpty:{
            message:"请输入商品名称"
          },
          regexp:{
            regexp:/^\d{2}-\d{2}$/,
            message:"尺码格式必须是 xx-xx 的格式, 例如: 32-40"
          }
        }
      },
      oldPrice:{
        validators:{
          notEmpty:{
            message:"请输入商品名称"
          }
        }
      },
      price:{
        validators:{
          notEmpty:{
            message:"请输入商品名称"
          }
        }
      },
      picStatus:{
        validators:{
          notEmpty:{
            message:"请上传3张图片"
          }
        }
      }
    }
  });
  
  //注册表单校验成功事件
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    
    var params=$('#form').serialize();
    params += "&picName1="+picArr[0].picName+"&picAddr1="+picArr[0].picAddr;
    params += "&picName1="+picArr[1].picName+"&picAddr1="+picArr[1].picAddr;
    params += "&picName1="+picArr[2].picName+"&picAddr1="+picArr[2].picAddr;
    $.ajax({
      type:"post",
      url:"/product/addProduct",
      data:params,
      dataType:"json",
      success:function (info) {
        console.log(info);
        if(info.success){
          $('#addModal').modal('hide');
          currentPage=1;
          render();
        }
      }
    })
  });
  
})