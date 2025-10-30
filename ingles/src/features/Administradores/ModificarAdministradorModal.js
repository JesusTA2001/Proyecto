import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import '../../styles/listaEstudiante.css';

export default function ModificarAdministradorModal({ open, onClose, admin, actualizarAdministrador }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (admin) setForm({ ...admin });
  }, [admin]);

  if (!form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actualizarAdministrador(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        Modificar Administrador
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
          <div className="button-list">
            <button className='modifybutton' type='submit'>Guardar Cambios</button>
            <button type='button' className='createbutton' onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
