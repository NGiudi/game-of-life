import React, { useContext , useEffect, useState} from "react";

/* import context */
import { BoardContext } from "../../../../context/BoardContext";

/* import components */
import { RandomBoardButton } from "../../../Common/Buttons";

/* ds components */
import { Button } from "../../../../design_system";

/* import utils */
import { getLocalStorage, setLocalStorage } from "../../../../utils/storage";
import produce from "immer";

/* import constants */
import { MAX_GENERATINS_STORAGED } from "../../../../constants/settings";

const SimulationSidebarTab = () => {
	const { board, count, isRunning, setBoard, setColumns, setCount, setRows } = useContext(BoardContext);
	
	const [savedGenerations, setSavedGenerations] = useState([]);

	/* get saved generations */
	useEffect(() => {
		let generations = getLocalStorage("simulation");
		
		if (generations) {
			generations = JSON.parse(generations);
			setSavedGenerations(generations);		
		}
	}, []);

	const saveGeneration = () => {
		if (savedGenerations.length < MAX_GENERATINS_STORAGED) {
			setSavedGenerations((prevGenerations) => {
				const newArray = produce(prevGenerations, draft => {
					const data = { 
						board, 
						id: savedGenerations.length, 
						generation: count
					};

					draft.push(data);
					return draft;
				});
				
				setLocalStorage("simulation", JSON.stringify(newArray));
				return newArray;
			});
		} else {
			// TODO: agregar mensaje de espacios completados. 
		}
	};

	const loadGeneration = (generation) => { 
		setColumns(generation.board[0].length);
		setRows(generation.board.length);
		setBoard(generation.board);
		setCount(generation.generation);
	};

	const deleteGeneration = (generation) => {
		setSavedGenerations((prevGenerations) => {
			const newArray = produce(prevGenerations, draft => {
				draft.splice(generation.id, "1");
				return draft;
			});

			setLocalStorage("simulation", JSON.stringify(newArray));
			return newArray;
		});
	};

	return (
		<>
			<RandomBoardButton />

			<Button onClick={() => saveGeneration()} disabled={isRunning}>
				Guardar
			</Button>

			{/* TODO:  acomodar la informacion */ }
			{savedGenerations && savedGenerations.length > 0 ? (
				savedGenerations.map((generation, i) => (
					<div key={`saved-generation-${i}`}>
						<p>{i+1}</p>
						<p>Generaci??n: {generation.generation}</p>
						<button onClick={() => loadGeneration(generation)}>Cargar</button>
						<button onClick={() => deleteGeneration(generation)}>Eliminar</button>
					</div>
				))) : (
				<p>Sin generaciones guardadas</p>
			)}
		</>
	);
};

export default SimulationSidebarTab;