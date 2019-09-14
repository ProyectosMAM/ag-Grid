import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';

const valueCellStyle = {
  'text-align': 'right'
};

const cellStyleRight = {
  'text-align': 'right'
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  title = 'app';

  private gridApi;
  private gridColumnApi;
  // private groupHeaderHeight: number;
  // private headerHeight: number;
  // private floatingFiltersHeight;
  // private pivotGroupHeaderHeight;
  // private pivotHeaderHeight;
  // private defaultColDef;

  columnDefs = [
    // {
    //   headerName: '',
    //   field: 'Cod Pro',
    //   width: 57,
    //   cellStyle: cellStyleRight,
    //   hide: true
    // },
    // https://www.ag-grid.com/javascript-grid-provided-renderer-group/
    //
    {
      headerName: 'Programa',
      width: 500,
      showRowGroup: 'Programa',
      cellRenderer: 'agGroupCellRenderer',
      filter: 'agTextColumnFilter',
      filterValueGetter: params => params.data.Programa,
      cellRendererParams: {
        suppressCount: true,
        footerValueGetter: function (params) {
          return '<span style="color: red; font-size: 14px; padding-right: 5px;"> Total ' + params.value + '</span>';
        }
      }
    },
    {
      field: 'Programa',
      rowGroup: true,
      hide: true,
           // pinned: 'left',
      // showRowGroup: 'Programa',
      // cellRenderer: 'agGroupCellRenderer',
      // filter: 'agTextColumnFilter',
      // filterValueGetter: params => params.data.Programa
    },
    // {
    //     headerName: '',
    //     field: 'CodPro',
    //     width: 57,
    //     hide: false,
    //     pinned: 'left'
    //   },
    {
      headerName: '',
      field: 'Capítulo',
      width: 10,
      hide: true,
      // cellStyle: cellStyleRight,
      // rowGroup: true,
      // cellRenderer: 'agGroupCellRenderer',
      // showRowGroup: 'Programa',
      // pinned: 'left'

    },
    {
      headerName: 'Capítulo',
      field: 'DesCap',
      width: 300,
      rowGroup: true,
      resizable: true,
      // hide: true,
      // pinned: 'left',
      showRowGroup: 'DesCap',
      cellRenderer: 'agGroupCellRenderer',
      valueGetter: params => {
        if (params.data) {
          return params.data.Capítulo + ' - ' + params.data.DesCap;
        } else {
          return null;
        }
      },
      cellRendererParams: {
        suppressCount: true,
        innerRenderer: params => {
          console.log('params', params);
          if (params.node.group) {
            return params.value;
          } else {
            return '';
          }
        },
        footerValueGetter: function (params) {
          const val = params.value.split(' - ')[1];
          return '<span style="color: red; font-size: 14px; padding-right: 5px;"> Total ' + val + '</span>';
        }
      }
    },
    {
      headerName: '',
      field: 'CodEco',
      width: 57,
      // cellStyle: cellStyleRight,
      // pinned: 'left'
      comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
        return valueA - valueB;
      }
    },
    {
      headerName: 'Económico',
      field: 'DesEco',
      cellClass: 'resaltado',
      width: 400,
      resizable: true,
      // pinned: 'left'
    },

    {
      headerName: 'Creditos',
      children: [
        {
          headerName: 'Iniciales',
          field: 'Créditos Iniciales',
          width: 100,
          resizable: true,
          cellStyle: valueCellStyle,
          aggFunc: 'sum',
          // suppressSizeToFit: true,
          // cellRenderer: 'agGroupCellRenderer',
          // cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
          // cellRendererParams: {
          //   suppressCount: true, // turn off the row count
          //   suppressDoubleClickExpand: true, // turn off double click for expand
          //   innerRenderer: params => params.value, // provide an inner renderer
          //   footerValueGetter: function (params) {
          //     console.log('test loolo00000 params', params);
          //     return '<span style="color: red; font-size: 14px; padding-right: 5px;">' + params.value + '</span>';
          //   }
          // }
        },
        {
          headerName: 'Iniciales',
          field: 'Créditos Iniciales',
          width: 100,
          type: 'numericColumn'
          // cellStyle: valueCellStyle
        },
        {
          headerName: 'Modificaciones',
          field: 'Modificaciones de Crédito',
          // cellStyle: valueCellStyle,
          // cellRenderer: CurrencyCellRenderer,
          // type: 'numericColumn',
          width: 140
        },
        {
          headerName: 'Totales',
          field: 'Créditos Totales consignados',
          width: 140,
          // cellRenderer: CurrencyCellRenderer
        },
      ]
    },

    {
      headerName: 'Gastos',
      children: [
        {
          headerName: 'Obliga. reconocidas',
          field: 'Saldo de Obligaciones Reconocidas',
          width: 140,
          // cellStyle: valueCellStyle
        },
        {
          headerName: 'Comprometidos',
          field: 'Saldo de Gastos Compromet.',
          width: 140,
          // cellStyle: valueCellStyle
        },
        {
          headerName: 'Autorizados',
          field: 'Saldo de Gastos Autorizados',
          width: 140,
          // cellStyle: valueCellStyle
        },
        {
          headerName: 'Facturas consumen disp. Pend. Contabilizar',
          field: 'Facturas consumen disp. Pend. Contabilizar',
          width: 140,
          // cellStyle: valueCellStyle
        },
        {
          headerName: 'Fase definitiva',
          field: 'Gastado en Fase Definitiva',
          width: 140,
          // cellStyle: valueCellStyle
        },
        {
          headerName: 'Pendiente Aplicar a Presupuesto',
          field: 'Gasto Pendiente Aplicar a Presupuesto',
          width: 140,
          // cellStyle: valueCellStyle
        },
        {
          headerName: 'Total gastado',
          field: 'Total gastado',
          width: 140,
          // cellStyle: valueCellStyle
        },
      ]
    },

    {
      headerName: 'Pagos',
      children: [
        {
          headerName: 'Ordenados',
          field: 'Saldo de Pagos Ordenados',
          width: 140,
          // cellStyle: valueCellStyle
        },
        {
          headerName: 'Realizados',
          field: 'Pagos Realizados',
          width: 140,
          // cellStyle: valueCellStyle
        },
      ]
    },

    {
      headerName: 'Saldos de créditos',
      children: [
        {
          headerName: 'Disponibles',
          field: 'Saldo de Créditos disponibles',
          width: 140,
          // cellStyle: valueCellStyle
        },
        {
          headerName: 'Acuerdo no disponibilidad',
          field: 'Saldo de Acuerd. Créd. para No Disponibil.',
          width: 140,
          // cellStyle: valueCellStyle
        },
        {
          headerName: 'Retenidos transferencias',
          field: 'Saldo de Créditos Retenidos para Trans.',
          width: 140,
          // cellStyle: valueCellStyle
        },
        {
          headerName: 'Retenidos pdtes de utilización',
          field: 'Saldo de Créditos Retenidos pdtes de utilización',
          width: 140,
          // cellStyle: valueCellStyle
        },
        {
          headerName: 'Disponible real',
          field: 'Saldo de Crédito Disponible Real',
          width: 140,
          // cellStyle: valueCellStyle
        },
        {
          headerName: 'Disponibles vinculación',
          field: 'Saldo de Créditos disp. a nivel de Vinculación',
          width: 140,
          // cellStyle: valueCellStyle
        },
      ]
    }

  ];

  // No funciona. ................................
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true
    },
    // columnDefs: columnDefs,
    // rowData: null,
    // floatingFilter:true,
  };

  defaultColDef = {
    width: 150,
    editable: true,
    filter: 'agTextColumnFilter'
  };
// Final No funciona. ................................

  rowData: any;
  groupHeaderHeight = 25;
  headerHeight = 25;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // tslint:disable-next-line:max-line-length
    this.rowData = this.http.get('https://mamjerez.fra1.digitaloceanspaces.com/20190807eje.json');
    var defaultSortModel = [
      {
        colId: "CodEco",
        sort: "asc"
      }
    ];
    params.api.setSortModel(defaultSortModel);
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    // this.rowData = this.http.get('https://mamjerez.fra1.digitaloceanspaces.com/CONSULTA%20EJECUCI%C3%92N%20GASTO+%20(Varias%20conexiones).json');
    // console.log(this.rowData);
  }

  // getSelectedRows() {
  //   const selectedNodes = this.agGrid.api.getSelectedNodes();
  //   const selectedData = selectedNodes.map(node => node.data);
  //   const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');
  //   alert(`Selected nodes: ${selectedDataStringPresentation}`);
  // }
}











function CurrencyCellRenderer(params: any) {
  if (params.value) {
    return params.value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  } else {
    return null;
  }
}

function redCellRenderer(params: any) {
  if (params.node.footer) {
    return '<span style="color: red; font-size: 14px; padding-right: 5px;">' + params.valueFormatted + '</span>';
  } else {
    return params.valueFormatted;
  }

}