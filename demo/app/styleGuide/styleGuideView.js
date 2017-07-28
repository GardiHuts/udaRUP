
define(['marionette',
	'templates', 'rup.button','rup.combo'], function(Marionette, App){

	var StyleGuideView = Marionette.LayoutView.extend({
		template: App.Templates.demo.app.styleGuide.styleGuideTemplate,
		ui:{
			rupButtons: '.rup-button',
			rupDropdown: '#dropdownHtmlListButton',
			rupCombo: '#rupCombo'
		},
		onDomRefresh: fncOnDomRefresh
	});

	function fncOnDomRefresh(){

		this.ui.rupButtons.rup_button();

		this.ui.rupDropdown.rup_button({
    		dropdown:{
    			dropdownListId:'dropdownHtmlList'
    		}
    	});

		this.ui.rupCombo.rup_combo({
			loadFromSelect: true
    	});
	}

	return StyleGuideView;

});
