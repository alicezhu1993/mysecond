$(function () {
  $.ajax({
    type:"get",
    url:"/category/queryTopCategoryPaging",
    data:{
      page:1,
      pageSize:5
    },
    dataType:'json',
    success:function (info) {
      console.log(info);
      var htmlStr=template("tmp",info);
      $('tbody').html(htmlStr);
    }
  })
})