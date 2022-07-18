import React, { useContext } from "react";

/* import hooks */
import { useSnackbar } from "notistack";

/* context */
import { SettingsContext } from "../../context/SettingsContext";
import { BoardContext } from "../../context/BoardContext";

/* libraries */
import { Formik, Form } from "formik";

/* components */
import { ColumnsInput, RowsInput, TimeInput } from "../Common/Inputs";
import CloseButton from "./CloseButton/CloseButton";

/* ds components */
import Button from "../../design_system/Button/Button";

/* styles */
import { SidebarWrapper } from "./Sidebar.styles";

/* helpers */
import settingsValidation from "./settingsValidationSchema";

/* import constants */
import { GENERATION_NAME_LOCALSTORAGE } from "../../constants/settings";

const Sidebar = () => {
	const { board, count, isRunning, time, rows, columns, setColumns, setBoard, setCount, setRows, setTime} = useContext(BoardContext);
	const { openSidebar, setOpenSidebar } = useContext(SettingsContext);
	
	const { enqueueSnackbar } = useSnackbar();

	// save generation functions.
	const actionButton = () => (
		<>
			<Button onClick={() => { saveGeneration(true); }}>
        Reemplazar
			</Button>
		</>
	);

	const saveGeneration = (force) => {
		const generation = localStorage.getItem(GENERATION_NAME_LOCALSTORAGE);

		// check if exist a generation saved.
		// force is used to replace the saved generation.
		if (!generation || force) {
			// board is transformed into a string to be stored in the localstorage
			localStorage.setItem(GENERATION_NAME_LOCALSTORAGE, JSON.stringify({ board, generation: count }));
			// show success message.
			enqueueSnackbar("Generación guardada con éxito.", { variant: "success" });
		} else {
			// show error message.
			enqueueSnackbar("Ya existe un juego guardado.", { variant: "error", action: actionButton });
		}
	};

	// load generation functions.
	const getSavedGeneration = () => {
		let storage = localStorage.getItem(GENERATION_NAME_LOCALSTORAGE);

		// check if exist a generation saved.
		if (storage) {
			// transform the saved generation in a matrix board.
			storage = JSON.parse(storage);
			// set life values and dimentions board. reset count.
			setColumns(storage.board[0].length);
			setRows(storage.board.length);
			setBoard(storage.board);
			setCount(storage.generation);
			// show success message.
			enqueueSnackbar("Generación cargada con éxito.", { variant: "success" });
		} else {
			// show error message.
			enqueueSnackbar("No hay ninguna generación guardada.", { variant: "error"});
		}
	};

	return (
		<SidebarWrapper open={!!openSidebar}>
			<CloseButton />

			{/* TODO: poner esto en otro componente */}
			{openSidebar === "settings" && (
				<Formik
					initialValues={{
						time: time,
						rows: rows,
						columns: columns
					}}
					validationSchema={settingsValidation}
					onSubmit={(values) => {
						setColumns(values.columns);
						setRows(values.rows);
						setTime(values.time);
					
						setOpenSidebar(null);
					//enqueueSnackbar("Configuraciones Modificadas con éxito.", { variant: "success" });
					}}
				>
					{({ errors, touched }) => (
						<Form>
							<TimeInput errors={errors} touched={touched}/>

							<RowsInput errors={errors} touched={touched}/>

							<ColumnsInput errors={errors} touched={touched}/>

							<Button type="submit">
								Guardar Cambios
							</Button>
						</Form>
					)}
				</Formik>
			)}

			{/* TODO: poner esto en otro componente */}
			{openSidebar === "simulations" && (
				<>
					<Button onClick={()=>saveGeneration(false)} disabled={isRunning}>
						Guardar
					</Button>

					<Button onClick={getSavedGeneration} disabled={isRunning}>
						Cargar
					</Button>
				</>
			)}
		</SidebarWrapper>
	);
};

export default  Sidebar;