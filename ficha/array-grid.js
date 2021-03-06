Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

   var store = new Ext.data.Store({	
       proxy: new Ext.data.HttpProxy({
	    url: 'grilla.php' 		
	    ,method: 'POST'			
	}),
        //baseParams:{task: "LISTAR"},				
        reader: new Ext.data.JsonReader({			
	   root: 'results',				
	   totalProperty: 'total',				
	   id:'pidserv'									
         },[{name: 'pidserv', type: 'integer', mapping: 'pidserv'},
	    {name: 'pnombre', type: 'string', mapping: 'pnombre'}, 
            {name: 'cue', type: 'string', mapping: 'cue'},  	      
  	     {name: 'anexo', type: 'string', mapping: 'anexo'}
	  ]),
	  sortInfo:{field: 'pnombre', direction: "ASC"}	
	});		
	store.load({params:{start: 0, limit: 9}});	

    var grid = new Ext.grid.GridPanel({
        store: store,
        stripeRows: true,
        enableColumnMove: false,
        width    : 630,
        height   : 285,
        stateful: true,
        stateId: 'grid',
        columns: [
		 {id:'pidserv',header: "Idserv", width: 50, sortable: true, dataIndex: 'pidserv'}
 		,{id:'pnombre',header: "Escuela", width: 520, sortable: true, dataIndex: 'pnombre'}
                ,{
                  xtype: 'actioncolumn',
                  width: 50,
                  items: [{
                    icon   : 'icono_vermas.gif', align: 'center',
                    tooltip: 'Ver mas información',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        tabs.add({
                           title: rec.get('pidserv'),
	                   autoLoad:{url:'datosescuela.php',
     		                     params:{ idserv:rec.get('pidserv')}},
   	     		   discardUrl:false,
  	                   nocache:true,
 	                   text:"Cargando...",
 	                   timeout:30,
 	                   scripts:false,
                           closable:true
                        }).show();
                    }
                }]
            }
        ]
       ,bbar: new Ext.PagingToolbar({
         pageSize: 9, store: store, displayInfo: true, plugins: new Ext.ux.ProgressBarPager()
       })
    });

   var tabs = new Ext.TabPanel({
      region    : 'center',
      autoDestroy : false,
      deferredRender : false,
      activeTab : 0,
      enableTabScroll:true,
      defaults  : {autoScroll : true},
      items     : [
		{id : 'lista',
		 title: 'ESTABLECIMIENTOS',
		  items:[grid]
             }]
   });



   if(!win){
	var win = new Ext.Window({
            title    : 'Resultados de la busqueda',
            closable : false,
            width    : 650,
            height   : 380,
            plain    : true,
            layout   : 'border',
            items    : [tabs],
	    buttons: [{
                     text     : 'Cerrar',
                      handler  : function(){
		          tabs.setActiveTab(0);
                          win.hide();
                      }
                  }]
         }).show();
    }
});
