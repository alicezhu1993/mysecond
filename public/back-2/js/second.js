$(function () {
  var currentPage=1;
  var pageSize=5;
  //渲染页面
  render();
  function render() {
    $.ajax({
      type:"get",
      url:"/category/querySecondCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:"json",
      success:function (info) {
        console.log(info);
        var htmlStr=template("secondTpl",info);
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
  
  //显示添加模态框
  $('#addBtn').click(function () {
    $('#addModal').modal('show');
    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
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
    })
  });
  
  //给下拉菜单中的a注册点击事件
  $('.dropdown-menu').on('click','a',function () {
    var txt=$(this).text();
    $('#dropdownText').text(txt);
    var id=$(this).data("id");
    $('[name="categoryId"]').val(id);
    $('#form').data("bootstrapValidator").updateStatus("categoryId","VALID");
  });
  
  //配置文件上传插件
  $('#fileupload').fileupload({
    dataType:'json',
    done:function (e,data) {
      var picUrl=data.result.picAddr;
      $('#imgBox img').attr("src",picUrl);
      $('[name="brandLogo"]').val(picUrl);
      $('#form').data("bootstrapValidator").updateStatus("brandLogo","VALID");
    }
  });
  
  //表单校验
  $('#form').bootstrapValidator({
    excluded:[],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      categoryId:{
        validators:{
          notEmpty:{
            message:"请选择一级分类"
          }
        }
      },
      brandName:{
        validators:{
          notEmpty:{
            message:"请输入二级分类名称"
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:"请选择图片"
          }
        }
      }
    }
  });
  
  //注册表单验证成功事件,阻止默认提交，通过ajax提交
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
      type:"post",
      url:"/category/addSecondCategory",
      data:$('#form').serialize(),
      dataType:'json',
      success:function (info) {
          console.log(info);
          if(info.success){
            $('#addModal').modal('hide');
            currentPage=1;
            render();
            $("#form").data('bootstrapValidator').resetForm(true);
            $("#dropdownText").text('请选择一级分类');
            $('#imgBox img').attr("src","images/none.png");
          }
      }
    })
  });
})