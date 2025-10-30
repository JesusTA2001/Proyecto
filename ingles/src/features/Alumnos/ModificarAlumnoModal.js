import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import '../../styles/listaEstudiante.css';
import { generoOptions, carrerasOptions } from '../../data/mapping';
import { initialModalidades } from '../../data/modalidad';
import { initialNiveles } from '../../data/niveles';

export default function ModificarAlumnoModal({ open, onClose, alumno, actualizarAlumno }) {
  const [form, setForm] = useState(null);
  const [nivelesDisponibles, setNivelesDisponibles] = useState([]);

  useEffect(() => {
    if (alumno) {
      setForm({ ...alumno });
    }
  }, [alumno]);

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
    const final = { ...form };
    if (final.ubicacion === 'Centro de Idiomas' && !final.carrera) final.carrera = 'No Aplica';
    if (final.ubicacion === 'Tecnologico' && !final.carrera) {
      alert('Debes seleccionar una carrera para alumnos del Tecnológico.');
      return;
    }
    actualizarAlumno(final);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        Modificar Alumno
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit} className="form-container">
          <input className='usuario' name="numero_control" value={form.numero_control} readOnly disabled />
          <input className='usuario' name="nombre" value={form.nombre} onChange={handleChange} required />
          <input className='usuario' name="correo" type="email" value={form.correo} onChange={handleChange} required />
          <select name="genero" value={form.genero} onChange={handleChange} className="usuario" required>
            <option value="">Selecciona un género</option>
            {generoOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
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

          <select name="carrera" value={form.carrera || ''} onChange={handleChange} className="usuario" required={form.ubicacion === 'Tecnologico'}>
            <option value="">{form.ubicacion === 'Tecnologico' ? 'Selecciona una carrera *' : 'Selecciona carrera (si aplica)'}</option>
            {carrerasOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            {form.ubicacion === 'Centro de Idiomas' && <option value="No Aplica">No Aplica</option>}
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
