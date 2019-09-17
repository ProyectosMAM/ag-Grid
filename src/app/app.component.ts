import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';

import { GridOptions } from 'ag-grid-community/main';
import { HeaderComponent } from './header-component/header.component';
import { HeaderGroupComponent } from './header-group-component/header-group.component';

const valueCellStyle = {
  'text-align': 'right'
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  // title = 'app';

  private gridOptions: GridOptions;

  public sideBar;
  rowData: any;
  groupHeaderHeight = 25;
  headerHeight = 75;
  HeaderNumericWidth = 98;


  private gridApi;
  private gridColumnApi;

  columnDefs = [
    // {
    //   headerName: '',
    //   field: 'Cod Pro',
    //   width: 57,
    //   cellStyle: cellStyleRight,
    //   hide: true
    // },
    // https://www.ag-grid.com/javascript-grid-provided-renderer-group/

    { headerName: 'Programa-Capítulo-Económico.',
      // headerGroupComponentFramework: HeaderGroupComponent,
      children: [
        {
          headerName: 'Programa',
          width: 500,
          pinned: 'left',
          resizable: true,
          showRowGroup: 'Programa',
          cellRenderer: 'agGroupCellRenderer',
          filter: false,
          // filterValueGetter: params => params.data.Programa,
          cellRendererParams: {
            suppressCount: true,
            footerValueGetter(params) {
              return '<span style="color: red; font-size: 14px; font-weight: bold; margin-left: 0px;"> Total ' + params.value + '</span>';
            }
          }
        },
        // Si no tengo esta parte separada no funciona bien, repite Programa con cada Económico.
        {
          field: 'Programa',
          rowGroup: true,
          hide: true,
          pinned: 'left',
          resizable: true,
          filter: true,
        },
        {
          headerName: '',
          field: 'Capítulo',
          width: 10,
          hide: true,
          pinned: 'left',
          resizable: true,
          filter: false,
          sortable: true,
        },
        {
          headerName: 'Capítulo',
          field: 'DesCap',
          width: 300,
          rowGroup: true,
          resizable: true,
          filter: false,
          pinned: 'left',
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
              // console.log('params', params);
              if (params.node.group) {
                return params.value;
              } else {
                return '';
              }
            },
            footerValueGetter(params) {
              const val = params.value.split(' - ')[1];
              return '<span style="color: red; font-size: 12px;  font-weight: bold; margin-left: 0px;"> Total ' + val + '</span>';
            }
          }
        },
        {
          headerName: '',
          field: 'CodEco',
          width: 57,
          pinned: 'left',
          filter: false,
          // comparator(valueA, valueB, nodeA, nodeB, isInverted) {
          //   return valueA - valueB;
          // }
        },
        {
          headerName: 'Económico',
          field: 'DesEco',
          cellClass: 'resaltado',
          width: 400,
          resizable: true,
          pinned: 'left',
          filter: false,
        },
      ]
    },

    { headerName: 'Creditos',
      headerGroupComponentFramework: HeaderGroupComponent,
      children: [
        {
          // para separar el headerName en 3 lineas debe contener DOS comas.
          headerName: 'Iniciales,,',
          headerComponentFramework: HeaderComponent,
          field: 'Créditos Iniciales',
          width: this.HeaderNumericWidth,
          resizable: true,
          filter: false,
          columnGroupShow: 'open',
          cellStyle: valueCellStyle,
          aggFunc: 'sum',
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Modificación,,',
          headerComponentFramework: HeaderComponent,
          field: 'Modificaciones de Crédito',
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
          // type: 'numericColumn',
          width: this.HeaderNumericWidth,
          filter: false,
          columnGroupShow: 'open',
          footerValueGetter(params) {
            const val = params.value;
            return '<span style="color: green; font-size: 12px;  font-weight: bold; margin-left: 0px;"> Total ' + val + '</span>';
          }
        },
        {
          headerName: 'Creditos,totales,consignados',
          headerComponentFramework: HeaderComponent,
          field: 'Créditos Totales consignados',
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
          width: this.HeaderNumericWidth,
          filter: false,
          // columnGroupShow: 'open' // Se muestra por defecto.
        },
      ]
    },

    { headerName: 'Gastos',
      headerGroupComponentFramework: HeaderGroupComponent,
      children: [
        {
          headerName: 'Obligaciones,reconocidas,',
          headerComponentFramework: HeaderComponent,
          field: 'Saldo de Obligaciones Reconocidas',
          width: this.HeaderNumericWidth,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Comprometidos,,',
          headerComponentFramework: HeaderComponent,
          field: 'Saldo de Gastos Compromet.',
          width: this.HeaderNumericWidth,
          filter: false,
          columnGroupShow: 'open',
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Autorizados,,',
          headerComponentFramework: HeaderComponent,
          field: 'Saldo de Gastos Autorizados',
          width: this.HeaderNumericWidth,
          filter: false,
          columnGroupShow: 'open',
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Facturas, consumen disp., Pend. Contabilizar',
          headerComponentFramework: HeaderComponent,
          field: 'Facturas consumen disp. Pend. Contabilizar',
          width: this.HeaderNumericWidth,
          filter: false,
          columnGroupShow: 'open',
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Fase,definitiva,',
          headerComponentFramework: HeaderComponent,
          field: 'Gastado en Fase Definitiva',
          width: this.HeaderNumericWidth,
          filter: false,
          columnGroupShow: 'open',
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Pendiente,Aplicar,a Presupuesto',
          headerComponentFramework: HeaderComponent,
          field: 'Gasto Pendiente Aplicar a Presupuesto',
          width: this.HeaderNumericWidth,
          filter: false,
          columnGroupShow: 'open',
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Total,gastado,',
          headerComponentFramework: HeaderComponent,
          field: 'Total gastado',
          width: this.HeaderNumericWidth,
          filter: false,
          columnGroupShow: 'open',
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
      ]
    },

    { headerName: 'Pagos',
      headerGroupComponentFramework: HeaderGroupComponent,
      children: [
        {
          headerName: 'Ordenados,,',
          headerComponentFramework: HeaderComponent,
          field: 'Saldo de Pagos Ordenados',
          width: this.HeaderNumericWidth,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Realizados,,',
          headerComponentFramework: HeaderComponent,
          field: 'Pagos Realizados',
          width: this.HeaderNumericWidth,
          filter: false,
          columnGroupShow: 'open',
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
      ]
    },

    { headerName: 'Saldos créditos',
      headerGroupComponentFramework: HeaderGroupComponent,
      children: [
        {
          headerName: 'Disponibles,,',
          headerComponentFramework: HeaderComponent,
          field: 'Saldo de Créditos disponibles',
          width: this.HeaderNumericWidth + 30, // + espacio para la fecha de despliegue.
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Acuerdo no,disponibilidad,',
          headerComponentFramework: HeaderComponent,
          field: 'Saldo de Acuerd. Créd. para No Disponibil.',
          width: this.HeaderNumericWidth,
          filter: false,
          columnGroupShow: 'open',
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Retenidos,transferencias,',
          headerComponentFramework: HeaderComponent,
          field: 'Saldo de Créditos Retenidos para Trans.',
          width: this.HeaderNumericWidth,
          filter: false,
          columnGroupShow: 'open',
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Retenidos,pendientes,de utilización',
          headerComponentFramework: HeaderComponent,
          field: 'Saldo de Créditos Retenidos pdtes de utilización',
          width: this.HeaderNumericWidth,
          filter: false,
          columnGroupShow: 'open',
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Disponible,real,',
          headerComponentFramework: HeaderComponent,
          field: 'Saldo de Crédito Disponible Real',
          width: this.HeaderNumericWidth,
          filter: false,
          columnGroupShow: 'open',
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Disponibles,a nivel,vinculación',
          headerComponentFramework: HeaderComponent,
          field: 'Saldo de Créditos disp. a nivel de Vinculación',
          width: this.HeaderNumericWidth,
          filter: false,
          columnGroupShow: 'open',
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
      ]
    }

  ];

  //  TODO: NO parece hacer nada.
  // autoGroupColumnDef = {
  //   headerName: 'Programa',
  //   field: 'Programa',
  //   cellRenderer: 'agGroupCellRenderer',
  //   cellRendererParams: {
  //     checkbox: true
  //   }
  // };

  constructor(private http: HttpClient) {
    this.sideBar = 'filters';
    // we pass an empty gridOptions in, so we can grab the api out
    this.gridOptions = {} as GridOptions;
    this.gridOptions.defaultColDef = {
      headerComponentFramework: HeaderComponent as new () => HeaderComponent,
      headerComponentParams: {
        menuIcon: 'fa-bars'
      }
    };
  }

  ngOnInit() { }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = this.http.get('https://mamjerez.fra1.digitaloceanspaces.com/20190807eje.json');
    const defaultSortModel = [
      {
        colId: 'CodEco',
        sort: 'asc'
      }
    ];
    params.api.setSortModel(defaultSortModel);
  }
}

function CurrencyCellRenderer(params: any) {
  if (params.value) {
    // return params.value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return  '<span style=" text-align: right;">' + params.value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + '</span>';
  } else {
    return null;
  }
}

function redCellRenderer(params: any) {
  if (params.node.footer) {
    return '<span style="color: red; font-size: 14px;">' + params.valueFormatted + '</span>';
  } else {
    return params.valueFormatted;
  }
}

 // No funciona. ................................
  // gridOptions = {
  //   defaultColDef: {
  //     sortable: true,
  //     resizable: true
  //   },
  //    };

  // defaultColDef = {
  //   width: 150,
  //   editable: true,
  //   filter: false,
  // };
  // Final No funciona. ................................

// function CurrencyCellRenderer(params: any) {
//   const inrFormat = new Intl.NumberFormat('es-ES', {
//     style: 'decimal',
//     currency: 'EUR',
//     minimumFractionDigits: 0
//   });
//   console.log(inrFormat.format(params.value));
//   return inrFormat.format(params.value);
// }
