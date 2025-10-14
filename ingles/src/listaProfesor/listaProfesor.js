import React from "react";
import { Link } from "react-router-dom";
import '../hojas-de-estilo/listaEstudiante.css'; // Reutilizamos los mismos estilos

// Arreglo de 10 profesores con datos de ejemplo
const profesores = [
  { numero_empleado: "EMP001", nombre: "Juan Carlos Pérez", correo: "juan.perez@teczamora.mx", telefono: "3511234567", curp: "PEJC800115HGRMNA01", direccion: "Av. Tecnológico 100" },
  { numero_empleado: "EMP002", nombre: "María Rodriguez Lima", correo: "maria.rdz@teczamora.mx", telefono: "4432345678", curp: "ROLM850320MGRMNA02", direccion: "Calle Colón 210, Centro" },
  { numero_empleado: "EMP003", nombre: "José Luis Fernández", correo: "jl.fernandez@teczamora.mx", telefono: "3513456789", curp: "FELJ780510HGRMNA03", direccion: "Lázaro Cárdenas 500" },
  { numero_empleado: "EMP004", nombre: "Ana Sofía García", correo: "asofia.garcia@teczamora.mx", telefono: "4439876543", curp: "GASA901105MGRMNA04", direccion: "Juárez 33, La Luneta" },
  { numero_empleado: "EMP005", nombre: "Miguel Ángel Zepeda", correo: "miguel.zepeda@teczamora.mx", telefono: "3518765432", curp: "ZEAM820818HGRMNA05", direccion: "5 de Mayo 112" },
  { numero_empleado: "EMP006", nombre: "Laura Patricia Ortiz", correo: "laura.ortiz@teczamora.mx", telefono: "7867654321", curp: "OILP880225MGRMNA06", direccion: "Calle del Trabajo 45" },
  { numero_empleado: "EMP007", nombre: "Ricardo Vega Solís", correo: "ricardo.vega@teczamora.mx", telefono: "4436543210", curp: "VESR751201HGRMNA07", direccion: "Hidalgo Sur 18" },
  { numero_empleado: "EMP008", nombre: "Verónica Méndez Ruiz", correo: "veronica.mendez@teczamora.mx", telefono: "3515432109", curp: "MERV910730MGRMNA08", direccion: "Pino Suárez 78" },
  { numero_empleado: "EMP009", nombre: "Francisco Javier Ríos", correo: "javier.rios@teczamora.mx", telefono: "7864321098", curp: "RIFJ840914HGRMNA09", direccion: "Ocampo Poniente 99" },
  { numero_empleado: "EMP010", nombre: "Gabriela Cervantes", correo: "gaby.cervantes@teczamora.mx", telefono: "4433210987", curp: "CEAG890403MGRMNA10", direccion: "Allende 234" }
];

function ListaProfesor() {
  return (
    <div className="lista-container">
      <div className="lista-header">
        <div className="header-actions">
          <input type="text" placeholder="🔍 Buscar por nombre, número de empleado, etc." className="search-input" />
          <Link to="/crear-profesor">
            <button className='createbutton'>Nuevo Profesor</button>
          </Link>
        </div>
      </div>

      <table className="alumnos-table"> {/* Reutilizamos la clase de la tabla de alumnos */}
        <thead>
          <tr>
            <th>Número de Empleado</th>
            <th>Nombre Completo</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>CURP</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map((profesor, index) => (
            <tr key={index}>
              <td>{profesor.numero_empleado}</td>
              <td>{profesor.nombre}</td>
              <td>{profesor.correo}</td>
              <td>{profesor.telefono}</td>
              <td>{profesor.curp}</td>
              <td>{profesor.direccion}</td>
              <td className="acciones-cell">
                <Link to="/modificar-profesor">
                  <button className='modifybutton icon-button'>✏️</button>
                </Link>
                <Link to="/eliminar-profesor">
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

export default ListaProfesor;