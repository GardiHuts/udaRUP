define(['marionette',
        'templates',
        './comboSimpleBodyView',
        './comboSimpleTestView',
        '../../../shared/component/componentExampleCodeView',
        'rup.combo'], function(Marionette, App, ComboSimpleBodyView, ComboSimpleTestView, ComponentExampleCodeView){

  var ComboSimpleView = Marionette.LayoutView.extend({
      template: App.Templates.demo.app.shared.component.componentLayoutTemplate,
      regions:{
        Main: "#componentMainBody",
        Example: "#exampleCode",
        Test: "#componentTest"
      },
      onRender: fncOnRender
  });

  function fncOnRender(){
    var $view = this;

    $view.Main.show(new ComboSimpleBodyView());
    $view.Example.show(new ComponentExampleCodeView({
      templateHtml: App.Templates.demo.app.components.combo.comboSimple.comboSimpleHtmlCodeTemplate,
      templateJs: App.Templates.demo.app.components.combo.comboSimple.comboSimpleJsCodeTemplate
    }));
    $view.Test.show(new ComboSimpleTestView());
  }


  return ComboSimpleView;
});
