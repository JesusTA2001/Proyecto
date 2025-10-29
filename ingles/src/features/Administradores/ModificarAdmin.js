import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../styles/listaEstudiante.css';

function ModificarAdministrador({ administradores, actualizarAdministrador }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const adminAEditar = administradores.find(a => a.numero_empleado === id);
    if (adminAEditar) {
      setAdmin(adminAEditar);
    } else {
      navigate("/lista-administradores");
    }
  }, [id, administradores, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actualizarAdministrador(admin);
    navigate("/lista-administradores");
  };
  
  if (!admin) return <p className="loading-message">Cargando datos del administrador...</p>;

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input className='usuario' name="numero_empleado" value={admin.numero_empleado} readOnly disabled />
      <input className='usuario' name="nombre" value={admin.nombre} onChange={handleChange} placeholder="Nombre Completo" required />
      <input className='usuario' name="correo" type="email" value={admin.correo} onChange={handleChange} placeholder="Correo Electrónico" required />
      <input className='usuario' name="curp" value={admin.curp} onChange={handleChange} placeholder="CURP" />
      <input className='usuario' name="telefono" value={admin.telefono} onChange={handleChange} placeholder="Teléfono" />
      <input className='usuario' name="direccion" value={admin.direccion} onChange={handleChange} placeholder="Dirección" />
      <div className="button-list">
        <button className='modifybutton' type='submit'>Guardar Cambios</button>
      </div>
    </form>
  );
}

export default ModificarAdministrador;