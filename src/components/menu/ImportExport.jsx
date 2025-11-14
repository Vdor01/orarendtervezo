import { useTimetable, useSettings } from '../../contexts';

/**
 * ImportExport component allows users to import and export the current schedule as a JSON file.
 * It also provides functionality to download the current schedule as a PNG file.
 * 
 * @param {function} exportTimetable - Function to export the timetable as PNG.
 * @return {JSX.Element} A card containing buttons for exporting and importing the schedule.
 */
const ImportExport = ({ exportTimetable }) => {
    const { eventsJSON, setEventsJSON } = useTimetable();
    const { settings } = useSettings();

    /**
     * Downloads the current file as a JSON file.
     */
    const downloadJSON = () => {
        const blob = new Blob([JSON.stringify(eventsJSON)], { type: 'application/json' });

        const url = document.createElement('a');
        url.href = URL.createObjectURL(blob);
        url.download = 'orarend.json';

        document.body.appendChild(url);
        url.click();
    };

    /**
     * Handles the file upload event.
     */
    const uploadJSON = (e) => {
        e.preventDefault();

        const fileInput = document.querySelector('input[name="file"]');
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const json = JSON.parse(event.target.result);
                setEventsJSON(json);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="w-full shadow-xl card bg-base-300 card-compact">
            <div className="card-body">
                <h2 className="card-title">Órarend importálása / exportálása</h2>
                <div className='flex flex-row grow'>
                    <div className='flex flex-col w-full gap-2'>
                        <div className='flex justify-center gap-5'>
                            <button
                                className={"justify-start btn btn-lg btn-outline"}
                                onClick={() => exportTimetable()}
                            >
                                <i className={"pi pi-image"}></i>
                                PNG Exportálása
                            </button>
                        </div>
                        <div className="divider">JSON</div>
                        <form id='importer'>
                            <div className='flex flex-col items-center justify-center gap-5'>
                                <button
                                    className={"justify-start btn btn-lg btn-outline w-fit"}
                                    onClick={() => downloadJSON()}
                                >
                                    <i className={"pi pi-file-export"}></i>
                                    Exportálás
                                </button>
                                <div className='flex gap-2'>
                                    <input
                                        type="file"
                                        name='file'
                                        className="w-full max-w-lg file-input file-input-lg file-input-bordered"
                                        accept='.json'
                                    />
                                    <button
                                        className={"justify-start btn btn-lg btn-outline"}
                                        onClick={(e) => uploadJSON(e)}
                                    >
                                        <i className={"pi pi-file-import"}></i>
                                        Importálás
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    {(settings.tips ?? true) && (
                        <>
                            <div className="divider divider-horizontal"></div>
                            <div className="grid w-1/4 gap-3 text-sm place-content-start">
                                <p>Az órarendedet exportálhatod PNG vagy JSON formátumban.</p>
                                <p>A PNG formátum képként menti el az órarendet, míg a JSON formátum lehetővé teszi az adatok későbbi importálását.</p>
                                <p>Importáláskor válaszd ki a kívánt JSON fájlt a számítógépedről.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImportExport;
