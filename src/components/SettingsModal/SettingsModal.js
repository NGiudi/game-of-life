import React, { useContext, useState } from 'react';

// import from external libraries.
import { IconButton, Modal, TextField, Tooltip } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as yup from 'yup';

// import from local files.
import { MIN_TIME, MAX_ROWS, MAX_COLUMNS } from '../../constants/settings';
import { RedButton, GreenButton } from './settingModalStyles';
import { BoardContext } from '../../context/BoardContext';

function SettingsModal() {
  const { time, rows, columns, setColumns, setRows, setTime} = useContext(BoardContext);
  
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  
  // form validation with yup library.
  const validationSchema = yup.object({
    localTime: yup
      .number()
      .positive('El número debe ser positivo')
      .moreThan(MIN_TIME, `El intervalo mínimo es de ${MIN_TIME+1}ms`)
      .required('Intervalo de tiempo requerido'),
    localRows: yup
      .number()
      .positive('El número debe ser positivo')
      .max(MAX_ROWS, `No se puede superar las ${MAX_ROWS} filas`)
      .required('Cantidad de filas requerido'),
    localColumns: yup
      .number()
      .positive('El número debe ser positivo')
      .max(MAX_COLUMNS, `No se puede superar las ${MAX_COLUMNS} columnas`)
      .required('Cantidad de columnas requerido'),
  });

  const formik = useFormik({
    initialValues: {
      localTime: time,
      localRows: rows,
      localColumns: columns
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // set values.
      setColumns(values.localColumns);
      setRows(values.localRows);
      setTime(values.localTime);
      //close modal.
      handleClose();
      // show success message.
      enqueueSnackbar("Configuraciones Modificadas con éxito.", { variant: 'success' });
    },
  });

  return (
    <>
      <div className="text-end">
        <Tooltip title="Configuraciones">
          <IconButton color="inherit" onClick={handleOpen}>
            <SettingsIcon/>
          </IconButton>
        </Tooltip>
      </div>

      <Modal open={open} onClose={handleClose}>
        <div className="box-modal">
          <h2 className="modal-title">Configuraciones</h2>

          <form onSubmit={formik.handleSubmit}>
            <div className="my-2">
              <TextField
                fullWidth
                id="localTime"
                name="localTime"
                label="Intervalo de tiempo"
                type="number"
                variant="outlined"
                value={formik.values.localTime}
                onChange={formik.handleChange}
                error={formik.touched.localTime && Boolean(formik.errors.localTime)}
                helperText={formik.touched.localTime && formik.errors.localTime}
              />
            </div>

            <div className="my-2">
              <TextField
                fullWidth
                id="localColumns"
                name="localColumns"
                label="Columnas"
                type="number"
                variant="outlined"
                value={formik.values.localColumns}
                onChange={formik.handleChange}
                error={formik.touched.localColumns && Boolean(formik.errors.localColumns)}
                helperText={formik.touched.localColumns && formik.errors.localColumns}
              />
            </div>
            
            <div className="my-2">
              <TextField
                fullWidth
                id="localRows"
                name="localRows"
                label="Filas"
                type="number"
                variant="outlined"
                value={formik.values.localRows}
                onChange={formik.handleChange}
                error={formik.touched.localRows && Boolean(formik.errors.localRows)}
                helperText={formik.touched.localRows && formik.errors.localRows}
              />
            </div>
                  
            <div className="modal-box-buttons">
              <RedButton variant="contained"onClick={handleClose}>Cancelar</RedButton> 
              <GreenButton variant="contained" type="submit">Aceptar</GreenButton>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default SettingsModal;