import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

/**
 * Componente para gestionar los estudios académicos de un profesor
 * @param {Array} estudios - Lista de estudios del profesor
 * @param {Array} catalogoEstudios - Catálogo de niveles de estudio disponibles
 * @param {Function} onEstudiosChange - Callback cuando cambian los estudios
 * @param {boolean} readOnly - Si es true, solo muestra los estudios sin permitir edición
 */
export default function GestionEstudios({ estudios = [], catalogoEstudios = [], onEstudiosChange, readOnly = false }) {
  const [lista, setLista] = useState(estudios);
  const [nuevoEstudio, setNuevoEstudio] = useState({
    id_Estudio: '',
    titulo: '',
    institucion: '',
    año_obtencion: ''
  });
  const [editando, setEditando] = useState(null); // id_prep del estudio en edición
  const [estudioEditado, setEstudioEditado] = useState({});
  const [agregando, setAgregando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLista(estudios);
  }, [estudios]);

  const handleAgregarEstudio = () => {
    // Validaciones
    if (!nuevoEstudio.id_Estudio || !nuevoEstudio.titulo.trim()) {
      setError('El nivel de estudio y el título son obligatorios');
      return;
    }

    const nivelEstudio = catalogoEstudios.find(c => c.id_Estudio === parseInt(nuevoEstudio.id_Estudio));
    
    const estudio = {
      id_prep: Date.now(), // Temporal para estudios nuevos
      ...nuevoEstudio,
      nivelEstudio: nivelEstudio?.nivelEstudio || '',
      _nuevo: true // Marca para identificar estudios nuevos
    };

    const nuevaLista = [...lista, estudio];
    setLista(nuevaLista);
    onEstudiosChange(nuevaLista);
    
    // Resetear formulario
    setNuevoEstudio({
      id_Estudio: '',
      titulo: '',
      institucion: '',
      año_obtencion: ''
    });
    setAgregando(false);
    setError('');
  };

  const handleEditarEstudio = (estudio) => {
    setEditando(estudio.id_prep);
    setEstudioEditado({ ...estudio });
  };

  const handleGuardarEdicion = () => {
    // Validaciones
    if (!estudioEditado.id_Estudio || !estudioEditado.titulo.trim()) {
      setError('El nivel de estudio y el título son obligatorios');
      return;
    }

    const nivelEstudio = catalogoEstudios.find(c => c.id_Estudio === parseInt(estudioEditado.id_Estudio));
    
    const nuevaLista = lista.map(e => 
      e.id_prep === editando 
        ? { ...estudioEditado, nivelEstudio: nivelEstudio?.nivelEstudio || '' }
        : e
    );
    
    setLista(nuevaLista);
    onEstudiosChange(nuevaLista);
    setEditando(null);
    setEstudioEditado({});
    setError('');
  };

  const handleCancelarEdicion = () => {
    setEditando(null);
    setEstudioEditado({});
    setError('');
  };

  const handleEliminarEstudio = (id_prep) => {
    const nuevaLista = lista.filter(e => e.id_prep !== id_prep);
    setLista(nuevaLista);
    onEstudiosChange(nuevaLista);
  };

  const handleCancelarAgregar = () => {
    setAgregando(false);
    setNuevoEstudio({
      id_Estudio: '',
      titulo: '',
      institucion: '',
      año_obtencion: ''
    });
    setError('');
  };

  if (readOnly) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          📚 Preparación Académica
        </Typography>
        
        {lista.length === 0 ? (
          <Alert severity="info">No hay estudios registrados</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Nivel</strong></TableCell>
                  <TableCell><strong>Título</strong></TableCell>
                  <TableCell><strong>Institución</strong></TableCell>
                  <TableCell><strong>Año</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lista.map((estudio) => (
                  <TableRow key={estudio.id_prep}>
                    <TableCell>{estudio.nivelEstudio}</TableCell>
                    <TableCell>{estudio.titulo}</TableCell>
                    <TableCell>{estudio.institucion || '-'}</TableCell>
                    <TableCell>{estudio.año_obtencion || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          📚 Preparación Académica
        </Typography>
        {!agregando && (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setAgregando(true)}
          >
            Agregar Estudio
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {/* Formulario para agregar nuevo estudio */}
      {agregando && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f9f9f9' }}>
          <Typography variant="subtitle2" gutterBottom>Nuevo Estudio</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                size="small"
                value={nuevoEstudio.id_Estudio}
                onChange={(e) => setNuevoEstudio({ ...nuevoEstudio, id_Estudio: e.target.value })}
                displayEmpty
              >
                <MenuItem value="">Selecciona nivel de estudio *</MenuItem>
                {catalogoEstudios.map((cat) => (
                  <MenuItem key={cat.id_Estudio} value={cat.id_Estudio}>
                    {cat.nivelEstudio}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Título obtenido *"
                placeholder="Ej: Licenciado en Inglés"
                value={nuevoEstudio.titulo}
                onChange={(e) => setNuevoEstudio({ ...nuevoEstudio, titulo: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Institución"
                placeholder="Ej: UNAM"
                value={nuevoEstudio.institucion}
                onChange={(e) => setNuevoEstudio({ ...nuevoEstudio, institucion: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Año de obtención"
                type="number"
                inputProps={{ min: 1950, max: new Date().getFullYear() }}
                value={nuevoEstudio.año_obtencion}
                onChange={(e) => setNuevoEstudio({ ...nuevoEstudio, año_obtencion: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelarAgregar}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<SaveIcon />}
                  onClick={handleAgregarEstudio}
                >
                  Agregar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Lista de estudios */}
      {lista.length === 0 ? (
        <Alert severity="info">
          No hay estudios registrados. Haz clic en "Agregar Estudio" para añadir uno.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Nivel</strong></TableCell>
                <TableCell><strong>Título</strong></TableCell>
                <TableCell><strong>Institución</strong></TableCell>
                <TableCell><strong>Año</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lista.map((estudio) => (
                <TableRow key={estudio.id_prep}>
                  {editando === estudio.id_prep ? (
                    <>
                      <TableCell>
                        <Select
                          fullWidth
                          size="small"
                          value={estudioEditado.id_Estudio}
                          onChange={(e) => setEstudioEditado({ ...estudioEditado, id_Estudio: e.target.value })}
                        >
                          {catalogoEstudios.map((cat) => (
                            <MenuItem key={cat.id_Estudio} value={cat.id_Estudio}>
                              {cat.nivelEstudio}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={estudioEditado.titulo}
                          onChange={(e) => setEstudioEditado({ ...estudioEditado, titulo: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={estudioEditado.institucion || ''}
                          onChange={(e) => setEstudioEditado({ ...estudioEditado, institucion: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          value={estudioEditado.año_obtencion || ''}
                          onChange={(e) => setEstudioEditado({ ...estudioEditado, año_obtencion: e.target.value })}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary" onClick={handleGuardarEdicion}>
                          <SaveIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={handleCancelarEdicion}>
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{estudio.nivelEstudio}</TableCell>
                      <TableCell>{estudio.titulo}</TableCell>
                      <TableCell>{estudio.institucion || '-'}</TableCell>
                      <TableCell>{estudio.año_obtencion || '-'}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary" onClick={() => handleEditarEstudio(estudio)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleEliminarEstudio(estudio.id_prep)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
