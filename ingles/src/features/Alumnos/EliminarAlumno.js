import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../styles/listaEstudiante.css';

function EliminarAlumno({ alumnos, eliminarAlumno }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const alumno = alumnos.find(a => a.numero_control === id);

  const handleDelete = () => {
    eliminarAlumno(id);
    navigate("/lista-estudiantes");
  };

  if (!alumno) {
    return (
        <div style={{ padding: '20px' }}>
            <h2>Alumno no encontrado</h2>
            <p>El alumno que intentas eliminar ya no existe.</p>
        </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>¿Estás seguro que deseas eliminar a este alumno?</h2>
      <div style={{ margin: '20px 0', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <p><strong>Número de Control:</strong> {alumno.numero_control}</p>
        <p><strong>Nombre:</strong> {alumno.nombre}</p>
        <p><strong>Correo:</strong> {alumno.correo}</p>
      </div>
      <div className="button-list">
        <button className='deletebutton' onClick={handleDelete}>Sí, Eliminar Alumno</button>
        <button className='createbutton' onClick={() => navigate("/lista-estudiantes")}>Cancelar</button>
      </div>
    </div>
  );
}

export default EliminarAlumno;