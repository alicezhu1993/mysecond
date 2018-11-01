$(function () {
  var currentPage=1;
  var pageSize=5;
  //发送ajax请求数据，进行渲染
  render();
  function render() {
    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function (info) {
        console.log(info);
        var htmlStr=template("firstTpl",info);
        $('tbody').html(htmlStr);
        // 分页初始化
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
  
  //点击添加按钮，显示添加模态框
  $('#addBtn').click(function () {
    $('#addModal').modal('show');
  });
  
  //表单校验
  $('#form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    fields:{
      categoryName:{
        validators:{
          notEmpty:{
            message:'请输入一级分类'
          }
        }
      }
    }
  });

  //注册表单验证成功事件，阻止默认提交，通过ajax提交
  $('#form').on('success.form.bv',function (e) {
    e.preventDefault();
    $.ajax({
      type:'post',
      url:"/category/addTopCategory",
      data:$('#form').serialize(),
      dataType:'json',
      success:function (info) {
        console.log(info);
        $('#addModal').modal('hide');
        currentPage=1;
        render();
        $('#form').data('bootstrapValidator').resetForm(true);
      }
    })
  });
})