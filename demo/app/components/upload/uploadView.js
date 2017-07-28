define(['marionette',
        'templates',
        './uploadBodyView',
        './uploadTestView',
        '../../shared/component/componentExampleCodeView',
        'rup.upload'], function(Marionette, App, UploadBodyView, UploadTestView, ComponentExampleCodeView){

  var UploadView = Marionette.LayoutView.extend({
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

    $view.Main.show(new UploadBodyView());
    $view.Example.show(new ComponentExampleCodeView({
      templateHtml: App.Templates.demo.app.components.upload.uploadHtmlCodeTemplate,
      templateJs: App.Templates.demo.app.components.upload.uploadJsCodeTemplate
    }));
    $view.Test.show(new UploadTestView());
  }


  return UploadView;
});
