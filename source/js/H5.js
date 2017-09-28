/* 内容管理对象 */
// 1 内容组织：添加页面、添加组件
// 整合fullpage
// 链式调用
var H5 = function () {
  this.id = ('h5_' + Math.random()).replace('.', '_')
  this.el = $(`<div class="h5" id=${this.id}>`).hide()

  $('body').append(this.el)

  // 新增页
  /**
   * name 页面名称
   * text  文本内容
   * reutrn {H5} 可以重复使用H5对象支持的方法
   */
  this.addPage = function (name, text) {
    var page = $('<div class="h5_page section">')

    if (name !== undefined) {
      page.addClass('h5_page_'+name)
    }
    if (text !== undefined) {
      page.text(text)
    }
    this.el.append(page)
    return this;
  }
  // 新增组件
  
  this.addComponent = function (name, cfg) {
    var cfg = cfg || {}
    cfg = $.extend({
      type: 'base'
    }, cfg)
    // 定义一个变量， 存储 组件元素
    var component;
    switch (cfg.type) {
      case 'base':
        component = new H5ComponentBase(name, cfg)
      break;
      
      default
    }

    return this;
  }
  
  // H5 对象
  this.loader = function () {
    this.el.fullpage()
    this.el.show()
  }
}