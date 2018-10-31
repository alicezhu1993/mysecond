$(document).ajaxStart(function () {
  NProgress.start();
});
$(document).ajaxStop(function () {
  setTimeout(function () {
    NProgress.done();
  },500);
});

$(function () {
  //二级导航的切换
  $('.lt_aside .nav .category').click(function () {
    $(this).next().slideToggle();
  });
  //左侧菜单的切换
  $('.lt_topbar .icon_menu').click(function () {
  $('.lt_aside').toggleClass('hidemenu');
    $('.lt_main').toggleClass('hidemenu');
    $('.lt_topbar').toggleClass('hidemenu');
  });
  //退出功能
  $('.lt_topbar .icon_logout').click(function () {
    $('#logoutModal').modal('show');
  });
  $('#logoutBtn').click(function () {
    $.ajax({
      type:"get",
      url:"/employee/employeeLogout",
      dataType:'json',
      success:function (info) {
        console.log(info);
        if(info.success){
          location.href="login.html";
        }
      }
    })
  })
})