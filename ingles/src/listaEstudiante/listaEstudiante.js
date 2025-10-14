import React from "react";
import { Link } from "react-router-dom";
import '../hojas-de-estilo/listaEstudiante.css';

// Datos de los alumnos
const alumnos = [
    // ... (el arreglo de 10 alumnos que te proporcioné antes) ...
    { numero_control: "2144001", nombre: "Ana Pérez García", correo: "ana.perez@ejemplo.com", telefono: "4431234567", curp: "PEGA880101HGRMNA01", direccion: "Av. Madero 123, Centro" },
    { numero_control: "2144002", nombre: "Luis Martínez Díaz", correo: "luis.martinez@ejemplo.com", telefono: "3512345678", curp: "MADL900202HGRMNA02", direccion: "Calle Ocampo 45, La Luneta" },
    { numero_control: "2144003", nombre: "Sofía Ramírez Fernández", correo: "sofia.ramirez@ejemplo.com", telefono: "7863456789", curp: "RAFS890303MGRMNA03", direccion: "Juárez 78, El Duero" },
    { numero_control: "2144004", nombre: "Carlos González López", correo: "carlos.gonzalez@ejemplo.com", telefono: "4439876543", curp: "GOLC910404HGRMNA04", direccion: "Morelos Sur 90, Jacona" },
    { numero_control: "2144005", nombre: "María Hernández Cruz", correo: "maria.hernandez@ejemplo.com", telefono: "3518765432", curp: "HECM920505MGRMNA05", direccion: "Hidalgo 111, Centro" },
    { numero_control: "2144006", nombre: "Javier Torres Vargas", correo: "javier.torres@ejemplo.com", telefono: "7867654321", curp: "TOVJ930606HGRMNA06", direccion: "5 de Mayo 222, Valencia" },
    { numero_control: "2144007", nombre: "Laura Flores Ríos", correo: "laura.flores@ejemplo.com", telefono: "4436543210", curp: "FORL940707MGRMNA07", direccion: "Callejón del Romance 33" },
    { numero_control: "2144008", nombre: "David Jiménez Ortiz", correo: "david.jimenez@ejemplo.com", telefono: "3515432109", curp: "JIOD950808HGRMNA08", direccion: "Virrey de Mendoza 456" },
    { numero_control: "2144009", nombre: "Fernanda Castillo Silva", correo: "fernanda.castillo@ejemplo.com", telefono: "7864321098", curp: "CASF960909MGRMNA09", direccion: "Lázaro Cárdenas 789" },
    { numero_control: "2144010", nombre: "Alejandro Mora Vega", correo: "alejandro.mora@ejemplo.com", telefono: "4433210987", curp: "MOVA971010HGRMNA10", direccion: "Constitución 101, Ario" }
];

function ListaEstudiante() {
  return (
    <div className="lista-container">
      <div className="lista-header">
        {/* <h1 className="lista-titulo">Gestión de Alumnos</h1> */}
        <div className="header-actions">
          <input type="text" placeholder="🔍 Buscar por nombre, matrícula, etc" className="search-input" />
          <Link to="/crear-alumno">
            <button className='createbutton'>Nuevo Alumno</button>
          </Link>
        </div>
      </div>

      <table className="alumnos-table">
        <thead>
          <tr>
            <th>Número de Control</th>
            <th>Nombre Completo</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>CURP</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno, index) => (
            <tr key={index}>
              <td>{alumno.numero_control}</td>
              <td>{alumno.nombre}</td>
              <td>{alumno.correo}</td>
              <td>{alumno.telefono}</td>
              <td>{alumno.curp}</td>
              <td>{alumno.direccion}</td>
              <td className="acciones-cell">
                {/* --- CAMBIO REALIZADO AQUÍ --- */}
                <Link to="/modificar-alumno">
                  <button className='modifybutton icon-button'>✏️</button>
                </Link>
                <Link to="/eliminar-alumno">
                  <button className='deletebutton icon-button'>🗑️</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaEstudiante;