define(['marionette',
        'templates',
        './formBodyView',
        './formTestView',
        '../../shared/component/componentExampleCodeView',
        'rup.form'], function(Marionette, App, FormBodyView, FormTestView, ComponentExampleCodeView){

  var FormView = Marionette.LayoutView.extend({
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

    $view.Main.show(new FormBodyView());
    $view.Example.show(new ComponentExampleCodeView({
      templateHtml: App.Templates.demo.app.components.form.formHtmlCodeTemplate,
      templateJs: App.Templates.demo.app.components.form.formJsCodeTemplate
    }));
    $view.Test.show(new FormTestView());
  }


  return FormView;
});
