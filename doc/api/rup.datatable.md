<a name="module_rup.datatable"></a>

## rup.datatable
Genera un datatable

**Summary**: Componente RUP Datatable  
**Version**: 1.0.0  
**License**: Licencia con arreglo a la EUPL, Versión 1.1 exclusivamente (la «Licencia»);
**Copyright**: Copyright 2018 E.J.I.E., S.A.  

* [rup.datatable](#module_rup.datatable)
    * [~_initOptions(options)](#module_rup.datatable.._initOptions)
    * [~_getColumns(options)](#module_rup.datatable.._getColumns)
    * [~_doFilter(options)](#module_rup.datatable.._doFilter)
    * [~_ajaxOptions(options)](#module_rup.datatable.._ajaxOptions)
    * [~_ajaxSuccessData(json)](#module_rup.datatable.._ajaxSuccessData)
    * [~_ajaxRequestData(data, options)](#module_rup.datatable.._ajaxRequestData)
    * [~_createSearchPaginator(tabla, settingsT)](#module_rup.datatable.._createSearchPaginator)
    * [~_clearFilter(options)](#module_rup.datatable.._clearFilter)

<a name="module_rup.datatable.._initOptions"></a>

### rup.datatable~_initOptions(options)
Inicializa ciertas opciones del componente

**Kind**: inner method of [<code>rup.datatable</code>](#module_rup.datatable)  
**Since**: UDA 3.4.0 // Datatable 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Opciones del componente |

<a name="module_rup.datatable.._getColumns"></a>

### rup.datatable~_getColumns(options)
Obtiene las columnas

**Kind**: inner method of [<code>rup.datatable</code>](#module_rup.datatable)  
**Since**: UDA 3.4.0 // Datatable 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Opciones del componente |

<a name="module_rup.datatable.._doFilter"></a>

### rup.datatable~_doFilter(options)
Filtrado

**Kind**: inner method of [<code>rup.datatable</code>](#module_rup.datatable)  
**Since**: UDA 3.4.0 // Datatable 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Opciones del componente |

<a name="module_rup.datatable.._ajaxOptions"></a>

### rup.datatable~_ajaxOptions(options)
Prepara el objeto necesario para la consulta de registros al servidor

**Kind**: inner method of [<code>rup.datatable</code>](#module_rup.datatable)  
**Since**: UDA 3.4.0 // Datatable 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Opciones del componente |

<a name="module_rup.datatable.._ajaxSuccessData"></a>

### rup.datatable~_ajaxSuccessData(json)
Obtiene los datos devueltos por el servidor de manera ordenada

**Kind**: inner method of [<code>rup.datatable</code>](#module_rup.datatable)  
**Since**: UDA 3.4.0 // Datatable 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| json | <code>object</code> | Información de los registros de la página actual |

<a name="module_rup.datatable.._ajaxRequestData"></a>

### rup.datatable~_ajaxRequestData(data, options)
Solicita los datos al servidor

**Kind**: inner method of [<code>rup.datatable</code>](#module_rup.datatable)  
**Since**: UDA 3.4.0 // Datatable 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | Opciones del datatable |
| options | <code>object</code> | Opciones del componente |

<a name="module_rup.datatable.._createSearchPaginator"></a>

### rup.datatable~_createSearchPaginator(tabla, settingsT)
Gestiona la paginación

**Kind**: inner method of [<code>rup.datatable</code>](#module_rup.datatable)  
**Since**: UDA 3.4.0 // Datatable 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| tabla | <code>object</code> | Objeto que contiene la tabla |
| settingsT | <code>object</code> | Opciones del componente |

<a name="module_rup.datatable.._clearFilter"></a>

### rup.datatable~_clearFilter(options)
Limpia el filtro

**Kind**: inner method of [<code>rup.datatable</code>](#module_rup.datatable)  
**Since**: UDA 3.4.0 // Datatable 1.0.0  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Opciones del componente |
