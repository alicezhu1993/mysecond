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
  // $('.lt_aside .nav .category').click(function () {
  //   $(this).next().slideToggle();
  // });
  //左侧菜单的切换
  
  //退出功能
})