import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import '../../styles/listaEstudiante.css';
import { initialModalidades } from '../../data/modalidad';
import { initialNiveles } from '../../data/niveles';

export default function ModificarProfesorModal({ open, onClose, profesor, actualizarProfesor }) {
  const [form, setForm] = useState(null);
  const [nivelesDisponibles, setNivelesDisponibles] = useState([]);

  useEffect(() => {
    if (profesor) setForm({ ...profesor });
  }, [profesor]);

  useEffect(() => {
    if (!form) return;
    const tecNivelIdsPattern = /^N[0-6]$/;
    if (form.ubicacion === 'Tecnologico') setNivelesDisponibles(initialNiveles.filter(n => tecNivelIdsPattern.test(n.id)));
    else setNivelesDisponibles(initialNiveles);
  }, [form?.ubicacion]);

  if (!form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actualizarProfesor(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        Modificar Profesor
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit} className="form-container">
          <input className='usuario' name="numero_empleado" value={form.numero_empleado} readOnly disabled />
          <input className='usuario' name="nombre" value={form.nombre} onChange={handleChange} required />
          <input className='usuario' name="correo" type="email" value={form.correo} onChange={handleChange} required />
          <input className='usuario' name="curp" value={form.curp || ''} onChange={handleChange} />
          <input className='usuario' name="telefono" value={form.telefono || ''} onChange={handleChange} />
          <input className='usuario' name="direccion" value={form.direccion || ''} onChange={handleChange} />

          <select name="ubicacion" value={form.ubicacion} onChange={handleChange} className="usuario" required>
            <option value="Tecnologico">Tecnológico (Interno)</option>
            <option value="Centro de Idiomas">Centro de Idiomas (Externo)</option>
          </select>

          <select name="modalidad" value={form.modalidad} onChange={handleChange} className="usuario" required>
            <option value="">Selecciona una modalidad</option>
            {initialModalidades.map(m => <option key={m.id} value={m.nombre}>{m.nombre}</option>)}
          </select>

          <select name="nivel" value={form.nivel} onChange={handleChange} className="usuario" required>
            <option value="">Selecciona un nivel</option>
            {nivelesDisponibles.map(n => <option key={n.id} value={n.nombre}>{n.nombre}</option>)}
          </select>

          <div className="button-list">
            <button className='modifybutton' type='submit'>Guardar Cambios</button>
            <button type='button' className='createbutton' onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
