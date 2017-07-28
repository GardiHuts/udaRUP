define(['marionette',
        'templates',
        'rup.contextMenu'], function(Marionette, App){

  var ContextMenuBodyView = Marionette.LayoutView.extend({
      template: App.Templates.demo.app.components.contextMenu.contextMenuBodyTemplate

  });

  return ContextMenuBodyView;
});
