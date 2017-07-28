define(['marionette',
        'templates',
        'rup.contextMenu','rup.button'], function(Marionette, App){

  var ContextMenuTestView = Marionette.LayoutView.extend({
    template: App.Templates.demo.app.components.contextMenu.contextMenuTestTemplate,
    ui:{
      contextMenu: "#contextMenu",
      contextMenuLeft: ".contextMenu-left",
      contextMenuHover: "#contextMenu-hover",
      contextMenuOther: ".contextMenu-other",
      btnActivateMenu: "#activate-menu"
    },
    events:{
      "click @ui.btnActivateMenu": fncActivateMenu
    },
    onAttach: fncOnAttach

  });

  function fncOnAttach(){

   	var items = {
        "edit": {name: "Edit", icon: "edit"},
        "cut": {name: "Cut", icon: "cut"},
        "copy": {name: "Copy", icon: "copy"},
        "paste": {name: "Paste", icon: "paste"},
        "delete": {name: "Delete", icon: "delete"},
        "sep1": "---------",
        "quit": {name: "Quit", icon: "quit"}
    };


  	this.ui.contextMenu.rup_contextMenu({
  		callback: function(key, options) {
  			alert("clicked: " + key);
  	    },
  		items: {
  	        "edit": {name: "Clickable", icon: "edit", disabled: false},
  	        "cut": {name: "Disabled", icon: "cut", disabled: true}
  		}
  	});

  	this.ui.contextMenuLeft.rup_contextMenu({
  		trigger: 'left',
  		callback: function(key, options) {
             alert("clicked: " + key);
          },
  		items: {
              "edit": {name: "Edit", icon: "edit", accesskey: "e"},
              "cut": {name: "Cut", icon: "cut", accesskey: "c"},
              // first unused character is taken (here: o)
              "copy": {name: "Copy", icon: "copy", accesskey: "c o p y"},
              // words are truncated to their first letter (here: p)
              "paste": {name: "Paste", icon: "paste", accesskey: "cool paste"},
              "delete": {name: "Delete", icon: "delete"},
              "sep1": "---------",
              "quit": {name: "Quit", icon: "quit"}
          }
  	});

  	this.ui.contextMenuHover.rup_contextMenu({
  		trigger: 'hover',
  		callback: function(key, options) {
  			alert("clicked: " + key);
  	    },
  	    items: {
              "edit": {"name": "Edit", "icon": "edit"},
              "cut": {"name": "Cut", "icon": "cut"},
              "sep1": "---------",
              "quit": {"name": "Quit", "icon": "quit"},
              "sep2": "---------",
              "fold1": {
                  "name": "Sub group",
                  "items": {
                      "foo bar": {"name": "Foo bar"},
                      "fold2": {
                          "name": "Sub group 2",
                          "items": {
                              "alpha": {"name": "alpha"},
                              "bravo": {"name": "bravo"},
                              "charlie": {"name": "charlie"}
                          }
                      },
                      "delta": {"name": "delta"}
                  }
              },
              "fold1a": {
                  "name": "Other group",
                  "items": {
                      "echo": {"name": "echo"},
                      "foxtrot": {"name": "foxtrot"},
                      "golf": {"name": "golf"}
                  }
              }
          }
  	});

  	this.ui.contextMenuOther.rup_contextMenu({
          trigger: 'none',
          build: function($trigger, e) {
  	        return {
  	        	callback: function(key, options) {
  	    			alert("clicked: " + key);
  	    	    },
  	            items: {
  	                "edit": {name: "Edit", icon: "edit"},
  	                "cut": {name: "Cut", icon: "cut"},
  	                "copy": {name: "Copy", icon: "copy"},
  	                "paste": {name: "Paste", icon: "paste"},
  	                "delete": {name: "Delete", icon: "delete"},
  	                "sep1": "---------",
  	                "quit": {name: "Quit", icon: "quit"}
  	            }
  	        };
          }
      });
  }

  function fncActivateMenu(){
    this.ui.contextMenuOther.rup_contextMenu("show");
  }


  return ContextMenuTestView;
});
