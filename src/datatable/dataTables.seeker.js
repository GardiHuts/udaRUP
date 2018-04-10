/**
  * Buscador interno del datatable
  *
  * @summary 		Extensión del componente RUP Datatable
  * @module			"dataTables.seeker"
  * @version     1.0.0
  * @license
  * Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la «Licencia»);
  * Solo podrá usarse esta obra si se respeta la Licencia.
  * Puede obtenerse una copia de la Licencia en
  *
  *      http://ec.europa.eu/idabc/eupl.html
  *
  * Salvo cuando lo exija la legislación aplicable o se acuerde por escrito,
  * el programa distribuido con arreglo a la Licencia se distribuye «TAL CUAL»,
  * SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ni expresas ni implícitas.
  * Véase la Licencia en el idioma concreto que rige los permisos y limitaciones
  * que establece la Licencia.
  * @copyright   Copyright 2018 E.J.I.E., S.A.
  *
  */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Version information for debugger
DataTable.seeker = {};

DataTable.seeker.version = '1.2.4';

/**
 * 
* Se inicializa el componente seeker
*
* @name init
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
* 
* @param {object} dt - Es el objeto datatable.
*
*/
DataTable.seeker.init = function ( dt ) {

	var ctx = dt.settings()[0];

	_createFilterColumn(dt,ctx);

	var ajaxOptions = {
			url : ctx.oInit.urlBase+'/search',
			accepts: {'*':'*/*','html':'text/html','json':'application/json, text/javascript',
				'script':'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
				'text':'text/plain','xml':'application/xml, text/xml'},
			type : 'POST',
			data : _getDatos(ctx),
			dataType : 'json',
			showLoading : false,
			contentType : 'application/json',
			async : true,
			success : function(data, status, xhr) {
				DataTable.seeker.search.funcionParams = data;
				_processData(dt,ctx,data);
			},
			error : function(xhr, ajaxOptions,thrownError) {
				console.log('Errors '+thrownError+ ": "+xhr.responseText);

			}
		};

	DataTable.seeker.ajaxOption = ajaxOptions;

	//Ver el buscador interno de la tabla.
	if(ctx.fnRecordsTotal() === 0){
		DataTable.seeker.search.$searchRow.hide();
	}else{
		DataTable.seeker.search.$searchRow.show();
	}
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local functions
 */

function _eventTrigger ( api, type, args, any )
{
	if ( any && ! api.flatten().length ) {
		return;
	}

	if ( typeof type === 'string' ) {
		type = type +'.dt';
	}

	args.unshift( api );

	$(api.table().node()).trigger( type, args );
}
/**
* Crea los componentes principales del buscador.
*
* @name createFilterColumn
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
* 
* @param {object} dt - Es el objeto datatable.
* @param {object} ctx - Es el contecto del datatable donde esta la configuración del mismo.
*
*/
function _createFilterColumn(dt,ctx){

	var idTabla = ctx.sTableId;
	$('#'+idTabla+' tfoot').css('display','table-header-group');
	   $('#'+idTabla+' tfoot th').each( function () {
	        var title = $(this).text();
	        if($(this).index() > 0){
	        	var position = $(this).index()+1;
	        	var nombre = $('#'+idTabla+' thead th:nth-child('+position+')').attr('data-col-prop');
	        	$(this).html( '<input type="text" placeholder="'+title+'" name="'+nombre+'" id="'+nombre+'_seeker"/>' );
	        }
	    } );


	   dt.columns().eq(0).each(function(colIdx) {
		   if(colIdx > 0){
		        $( 'input', $('#'+idTabla+' tfoot')[0].rows[0].cells[colIdx] ).on( 'keypress', function (ev) {
		        	this.focus();
		        	if (ev.keyCode === 13 && this.value !== '') { //Se hace la llamada de busqueda.
		        		DataTable.seeker.ajaxOption.data = _getDatos(ctx);
		        		var ajaxOptions =  $.extend(true, [], DataTable.seeker.ajaxOption);
		        		//Se pasa sin el internalFeedback ya que no es necesario.
		        		if(ajaxOptions.data.multiselection !== undefined && ajaxOptions.data.multiselection.internalFeedback !== undefined){
		        			ajaxOptions.data.multiselection.internalFeedback = [];
		        		}
		        		$('#'+idTabla+'_search_searchForm').rup_form('ajaxSubmit', ajaxOptions);

		        	}
		        } );
		   }
	   });

	   _createSearchRow(dt,ctx);
	   DataTable.seeker.searchForm = $('#'+idTabla+' tfoot tr:nth-child(2)');
	   DataTable.seeker.searchForm.hide();
	   _createRupComponent(dt,ctx);
}
/**
* Genera la barra de controles para gestionar la búsqueda..
*
* @name createSearchRow
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
* 
* @param {object} dt - Es el objeto datatable.
* @param {object} ctx - Es el contecto del datatable donde esta la configuración del mismo.
*
*/
function _createSearchRow (dt,ctx){
		var idTabla = ctx.sTableId;
		var	$gridHead = jQuery('tfoot','#'+idTabla),
			// Templates
			searchRowHeaderTmpl = jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.templates.search.searchRowHeader'),
			collapseLayerTmpl = jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.templates.search.collapseLayer'),
			collapseIconTmpl = jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.templates.search.collapseIcon'),
			collapseLabelTmpl = jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.templates.search.collapseLabel'),
			matchedLayerTmpl = jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.templates.search.matchedLayer'),
			matchedLabelTmpl = jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.templates.search.matchedLabel'),
			navLayerTmpl = jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.templates.search.navLayer'),
			navLinkTmpl = jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.templates.search.navLink'),
			navSearchButtonTmpl = jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.templates.search.navSearchButton'),
			navClearLinkTmpl = jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.templates.search.navClearLink'),

			// Objetos
			$searchRow = $(jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.templates.search.searchRow')),
			$searchRowHeader = $(jQuery.jgrid.format(searchRowHeaderTmpl, $gridHead.find('th').length)),
			// Capa que controla el colapso del formualario
			$collapseLayer = $(jQuery.jgrid.format(collapseLayerTmpl, 'searchCollapseLayer_'+idTabla)),
			$collapseIcon = $(jQuery.jgrid.format(collapseIconTmpl, 'searchCollapseIcon_'+idTabla)),
			$collapseLabel = $(jQuery.jgrid.format(collapseLabelTmpl, 'searchCollapsLabel_'+idTabla, jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.plugins.search.searchCriteria'))),
			// Capa que muestra el número de ocurrencias
			$matchedLayer = $(jQuery.jgrid.format(matchedLayerTmpl, 'matchedLayer_'+idTabla)),
			$matchedLabel = $(jQuery.jgrid.format(matchedLabelTmpl, 'matchedLabel_'+idTabla, jQuery.jgrid.format(jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.plugins.search.matchedRecords'),0))),

			// Capa que controla la navegación entre las diferentes ocurrencias
			$navLayer = $(jQuery.jgrid.format(navLayerTmpl, 'searchNavLayer_'+idTabla)),
			$firstNavLink = $(jQuery.jgrid.format(navLinkTmpl, 'search_nav_first_'+idTabla, jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.first'))),
			$backNavLink = $(jQuery.jgrid.format(navLinkTmpl, 'search_nav_back_'+idTabla, jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.previous'))),
			$forwardNavLink = $(jQuery.jgrid.format(navLinkTmpl, 'search_nav_forward_'+idTabla, jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.next'))),
			$lastNavLink = $(jQuery.jgrid.format(navLinkTmpl, 'search_nav_last_'+idTabla, jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.last'))),
			$navSearchButton = $(jQuery.jgrid.format(navSearchButtonTmpl, 'search_nav_button_'+idTabla, jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.search.Find'))),
			$navClearLink = $(jQuery.jgrid.format(navClearLinkTmpl, 'search_nav_clear_link'+idTabla, jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.search.Reset')));

		// Construcción del objeto final
		$collapseLayer.append($collapseIcon).append($collapseLabel);
		$matchedLayer.append($matchedLabel);
		$navLayer.append($firstNavLink).append($backNavLink).append($forwardNavLink).append($lastNavLink).append($navSearchButton).append($navClearLink);

		$searchRowHeader.append($collapseLayer);
		$searchRowHeader.append($matchedLayer);
		$searchRowHeader.append($navLayer);

		$searchRow.append($searchRowHeader);

		$gridHead.prepend($searchRow);
		jQuery('tfoot tr.search_row','#'+idTabla+'').addClass('ui-state-default');

		DataTable.seeker.search = DataTable.seeker.search  || {};

		DataTable.seeker.search.created = false;

		DataTable.seeker.search.$collapseIcon = $collapseIcon;
		DataTable.seeker.search.$searchRow = $searchRow;
		DataTable.seeker.search.$matchedLabel = $matchedLabel;
		DataTable.seeker.search.$firstNavLink = $firstNavLink;
		DataTable.seeker.search.$backNavLink = $backNavLink;
		DataTable.seeker.search.$forwardNavLink = $forwardNavLink;
		DataTable.seeker.search.$lastNavLink = $lastNavLink;

		// Creacion del enlace de mostrar/ocultar el formulario
		$collapseIcon.add($collapseLabel).on('click', function(){
			if (!DataTable.seeker.search.created){
				DataTable.seeker.search.$collapseIcon.removeClass('ui-icon-triangle-1-e');
				DataTable.seeker.search.$collapseIcon.addClass('ui-icon-triangle-1-s');
				DataTable.seeker.search.created = true;
				DataTable.seeker.searchForm.show();
				$navLayer.show();
			}else{
				DataTable.seeker.search.$collapseIcon.removeClass('ui-icon-triangle-1-s');
				DataTable.seeker.search.$collapseIcon.addClass('ui-icon-triangle-1-e');
				DataTable.seeker.search.created = false;
				DataTable.seeker.searchForm.hide();
				$navLayer.hide();
			}
		});

		// Evento de búsqueda asociado al botón
		$navSearchButton.on('click', function(){
			DataTable.seeker.ajaxOption.data = _getDatos(ctx);
    		var ajaxOptions =  $.extend(true, [], DataTable.seeker.ajaxOption);
    		//Se pasa sin el internalFeedback ya que no es necesario.
    		if(ajaxOptions.data.multiselection !== undefined && ajaxOptions.data.multiselection.internalFeedback !== undefined){
    			ajaxOptions.data.multiselection.internalFeedback = [];
    		}
    		$('#'+idTabla+'_search_searchForm').rup_form('ajaxSubmit',ajaxOptions);
		});

		// Evento asociado a limpiar el fomulario de búsqueda
		$navClearLink.on('click', function(){
			jQuery('input,textarea','#'+idTabla+' tfoot').val('');
			jQuery('tfoot [ruptype=\'combo\']','#'+idTabla).rup_combo('clear');
			DataTable.seeker.search.funcionParams = {};
			DataTable.seeker.search.pos = 0;
			_processData(dt,ctx,[]);
		});

		$navLayer.hide();

		function doSearchLinkNavigation($link, linkId){
			if (!$link.hasClass('ui-state-disabled')){
				$self.rup_table('navigateToMatchedRow', linkId);
			}
		}

		// Elemento primero
		$firstNavLink.on('click', function(){
			DataTable.seeker.search.pos = 0;
			_processData(dt,ctx,DataTable.seeker.search.funcionParams);
		});

		// Elemento anterior
		$backNavLink.on('click', function(){
			DataTable.seeker.search.pos--;
			_processData(dt,ctx,DataTable.seeker.search.funcionParams);
		});

		// Elemento siguiente
		$forwardNavLink.on('click', function(){
			DataTable.seeker.search.accion = 'next';
			DataTable.seeker.search.pos++;
			_processData(dt,ctx,DataTable.seeker.search.funcionParams);
		});

		// Elemento ultimo
		$lastNavLink.on('click', function(){
			DataTable.seeker.search.pos = DataTable.seeker.search.funcionParams.length-1;
			_processData(dt,ctx,DataTable.seeker.search.funcionParams);
		});

		// Se recubre con un form
		var $searchForm = jQuery('<form>').attr('id',idTabla+'_search_searchForm');

		DataTable.seeker.search.$searchForm = jQuery('#'+idTabla+'_search_searchForm');
		DataTable.seeker.search.$searchRow.hide();
        $('#'+idTabla).wrapAll($searchForm);
        DataTable.seeker.search.pos = 0;
        DataTable.seeker.search.accion = '';
}

/**
* Selecciona con la lupa los rows seleccionados. Una vez se han encontrado.
*
* @name selectSearch
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
* 
* @param {object} dt - Es el objeto datatable.
* @param {object} ctx - Es el contecto del datatable donde esta la configuración del mismo.
* @param {object} rows - Filas del datatable de la página actual.
*
*/
function _selectSearch(dt,ctx,rows){
	//Se limina el lapicero indicador.
	$('#'+ctx.sTableId+' tbody tr td.select-checkbox span.ui-icon-search').remove();

	//se añade el span con el lapicero
	if(rows.length > 0 && ctx.fnRecordsTotal() > 0){
		//Se selecconar el primero y se limpian los datos.
		var rowSelected = '';

		$.each(ctx.json.rows, function( idx ,value) {
			if(rows[DataTable.seeker.search.pos].pageLine-1 === idx){
				rowSelected = dt.rows().nodes()[idx];
			}
			var result = $.grep(rows, function(v) {
				return v.pk.id === value.id;
			});
			if(result.length === 1){
				var spanSearch = $("<span/>").addClass('ui-icon ui-icon-rupInfoCol ui-icon-search').css('float','right');
				$($('#'+ctx.sTableId+' tbody tr td.select-checkbox')[idx]).append(spanSearch).css('padding-right','3px');//Ajustamos el padding.
			}
		});
		var rowUnique = rows[DataTable.seeker.search.pos];
		if(rowSelected !== '' && rowSelected.className.indexOf('selected') < 0 && rowUnique.page === Number(ctx.json.page)
				&& rowUnique.pk.id === ctx.json.rows[rowUnique.pageLine-1].id &&
				(ctx.oInit.formEdit.$navigationBar.funcionParams === undefined || ctx.oInit.formEdit.$navigationBar.funcionParams.length === undefined)){//si no esta ya seleccionada.
			dt['row'](rowUnique.pageLine-1).multiSelect();
		}
		DataTable.seeker.search.accion = '';
	}
}

/**
* Metodo para saber si hay que paginar o no.
*
* @name paginar
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
* 
* @param {object} ctx - Es el contecto del datatable donde esta la configuración del mismo.
* @param {object} dato - Son los datos de las filas que viene del controller..
*
*/
function _paginar(ctx,dato){
	var paginar = false;
	if(dato !== undefined && dato.page !== Number(ctx.json.page)){
		paginar = true;
	}

	return paginar;
}

/**
* Actualiza la navegación del seeker.
*
* @name updateDetailSeekPagination
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
* 
* @param {integer} currentRowNum - Número de la posción actual del registro selecionado.
* @param {integer} totalRowNum - Número total de registros seleccionados.
*
*/
function _updateDetailSeekPagination(currentRowNum,totalRowNum){

	if (currentRowNum === 1) {
		DataTable.seeker.search.$firstNavLink.addClass('ui-state-disabled');
		DataTable.seeker.search.$backNavLink.addClass('ui-state-disabled');
	} else {
		DataTable.seeker.search.$firstNavLink.removeClass('ui-state-disabled');
		DataTable.seeker.search.$backNavLink.removeClass('ui-state-disabled');
	}
	if (currentRowNum === totalRowNum) {
		DataTable.seeker.search.$forwardNavLink.addClass('ui-state-disabled');
		DataTable.seeker.search.$lastNavLink.addClass('ui-state-disabled');
	} else {
		DataTable.seeker.search.$forwardNavLink.removeClass('ui-state-disabled');
		DataTable.seeker.search.$lastNavLink.removeClass('ui-state-disabled');
	}

	DataTable.seeker.search.$matchedLabel.html(jQuery.jgrid.format(jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.plugins.search.matchedRecordsCount'),Number(currentRowNum), Number(totalRowNum)));
}

/**
* Metodo para procesar los datos provinientes del controller.
*
* @name processData
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
* 
* @param {object} dt - Es el objeto datatable.
* @param {object} ctx - Es el contecto del datatable donde esta la configuración del mismo.
* @param {object} dato - Son los datos de las filas que viene del controller.
*
*/
function _processData(dt,ctx,data){
	DataTable.Api().multiSelect.deselectAll(dt);
	if(!_paginar(ctx,data[DataTable.seeker.search.pos])){
		_selectSearch(dt,ctx,data);
	}else{
		var tabla = $('#'+ctx.sTableId);
		tabla.dataTable().fnPageChange( data[DataTable.seeker.search.pos].page-1 );
	}

	if (data.length === 0){
		DataTable.seeker.search.$firstNavLink.add(DataTable.seeker.search.$backNavLink).add(DataTable.seeker.search.$forwardNavLink).add(DataTable.seeker.search.$lastNavLink).addClass('ui-state-disabled');
		DataTable.seeker.search.$matchedLabel.html(jQuery.jgrid.format(jQuery.rup.i18nParse(jQuery.rup.i18n.base,'rup_datatable.plugins.search.matchedRecords'),'0'));
	}else{
		_updateDetailSeekPagination(DataTable.seeker.search.pos + 1,data.length);
	}
}

/**
* Se obtienen los datos del formulario del seeker.
*
* @name getDatos
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
* 
* @param {object} ctx - Es el contecto del datatable donde esta la configuración del mismo.
* 
* @return {object} Devuelve el objeto mapeado de todos los campos.
*
*/
function _getDatos(ctx){
	var datos = ctx.aBaseJson;
	datos.search = form2object($(DataTable.seeker.search.$searchForm.selector)[0]);
	return datos;
}

/**
* Partiendo de los inputs del seeker, se convierten en componentes rup dependiendo del tipo..
*
* @name createRupComponent
* @function
* @since UDA 3.4.0 // Datatable 1.0.0
* 
* @param {object} dt - Es el objeto datatable.
* @param {object} ctx - Es el contecto del datatable donde esta la configuración del mismo.
*
*/
function _createRupComponent(dt,ctx){
	var colModel = ctx.oInit.formEdit.colModel, searchEditOptions;

	$('#'+ ctx.sTableId+' tfoot th').each( function(i) {
		if(i > 0){//La primera columna no vale es la de los select
			var cellColModel = colModel[i-1];
			var searchRupType = (cellColModel.searchoptions!==undefined && cellColModel.searchoptions.rupType!==undefined)?cellColModel.searchoptions.rupType:cellColModel.rupType;

			var colModelName = cellColModel.name;
			var $elem = $('[name=\''+colModelName+'\']',DataTable.seeker.searchForm);
			// Se añade el title de los elementos de acuerdo al colname
			$elem.attr({
				'title': ctx.aoColumns[i-1].sTitle,
				'class': 'editable customelement'
			}).removeAttr('readOnly');

			// En caso de tratarse de un componente rup, se inicializa de acuerdo a la configuracón especificada en el colModel
			if(searchRupType!==undefined) {
				searchEditOptions = cellColModel.searchoptions || cellColModel.editoptions;

				/*
				 * PRE Configuración de los componentes RUP
				 */
				if(searchRupType === 'combo'){
					searchEditOptions = $.extend({},{menuWidth:$elem.width()}, searchEditOptions, {width:'97%'});
				} else if(searchRupType === 'date'){
					$elem.css('width','86%');
					$elem.css('max-width','80px');
					$elem.css('min-width','75px');
				}

				// Invocación al componente RUP
				$elem['rup_'+searchRupType](searchEditOptions);
			}
		}
	});

}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Local variables to improve compression
var apiRegister = DataTable.Api.register;

apiRegister( 'seeker.eventTrigger()', function ( api, type, args, any ) {
	DataTable.seeker._eventTrigger(api, type, args, any );
} );

apiRegister( 'seeker.selectSearch()', function ( dt,ctx,rows ) {
	_selectSearch(dt,ctx,rows );
} );

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 */

// DataTables creation - check if select has been defined in the options. Note
// this required that the table be in the document! If it isn't then something
// needs to trigger this method unfortunately. The next major release of
// DataTables will rework the events and address this.
$(document).on( 'plugin-init.dt', function (e, ctx) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	DataTable.seeker.init( new DataTable.Api( ctx ) );

} );


return DataTable.seeker;
}));
