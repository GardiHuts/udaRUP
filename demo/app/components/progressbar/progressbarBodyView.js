define(['marionette',
        'templates',
        'rup.progressbar'], function(Marionette, App){

  var ProgressbarBodyView = Marionette.LayoutView.extend({
      template: App.Templates.demo.app.components.progressbar.progressbarBodyTemplate

  });

  return ProgressbarBodyView;
});
