import { Routes } from '@angular/router';
import { ReportePrestamoDomicilio } from './reporte-prestamo-domicilio';
import { ReportePrestamoEnSala } from './reporte-prestamo-ensala';
import { ReportePrestamoLaboratorioVirtual } from './reporte-prestamo-lab-virtual';
import { ReportePrestamoMatBibliografico } from './reporte-prestamo-mat-bibliografico';
import { ReportePrestamoEquipoComputo } from './reporte-prestamo-equipo-computo';
import { ReportePrestamoEscuelaProfesional } from './reporte-prestamo-escuela-profesional';
import { ReporteEjemplarMasPrestado } from './ejemplar-mas-prestado';
import { ReporteEjemplarNoPrestado } from './ejemplar-no-prestado';
import { ReporteEstudiantesAtendidos } from './estudiantes-atendidos';
import { ReporteUsoTiempoBiblioteca } from './usotiempo-biblioteca';
import { ReporteUsuariosAtendidosBiblioteca } from './usuarios-atendidos-biblioteca';
import { ReporteMaterialBibliograficoDetallado } from './material-bibliografico-detallado';
import { ReporteMaterialBibliograficoResumen } from './material-bibliografico-resumen';
import { ReporteMaterialBibliograficoExistente } from './material-bibliografico-existente';
import { ReporteInventarioMaterialBibliografico } from './inventario-material-bibliografico';
import { ReporteVisitantesBibliotecaVirtual } from './visitantes-biblioteca-virtual';
import { ReporteIntranet } from './reporte-intranet';
export default [
    { path: 'prestamo-domicilio', component: ReportePrestamoDomicilio },
    { path: 'prestamo-ensala', component: ReportePrestamoEnSala },
    { path: 'prestamo-lab-virtual', component: ReportePrestamoLaboratorioVirtual },
    { path: 'prestamo-mat-bibliografico', component: ReportePrestamoMatBibliografico },
    { path: 'prestamo-equipo-computo', component: ReportePrestamoEquipoComputo },
    { path: 'prestamo-escuela-profesional', component: ReportePrestamoEscuelaProfesional },
    { path: 'ejemplar-mas-prestado', component: ReporteEjemplarMasPrestado },
    { path: 'ejemplar-no-prestados', component: ReporteEjemplarNoPrestado },
    { path: 'estudiantes-atendidos', component: ReporteEstudiantesAtendidos },
    { path: 'usotiempo-biblioteca', component: ReporteUsoTiempoBiblioteca },
    { path: 'usuarios-atendidos-biblioteca', component: ReporteUsuariosAtendidosBiblioteca },
    { path: 'material-bibliografico-detallado', component: ReporteMaterialBibliograficoDetallado },
    { path: 'material-bibliografico-resumen', component: ReporteMaterialBibliograficoResumen },
    { path: 'material-bibliografico-existente', component: ReporteMaterialBibliograficoExistente },
    { path: 'inventario-material-bibliografico', component: ReporteInventarioMaterialBibliografico },
    { path: 'visitantes-biblioteca-virtual', component: ReporteVisitantesBibliotecaVirtual },
    { path: 'intranet', component: ReporteIntranet },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
