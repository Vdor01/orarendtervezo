import React, { useState } from 'react'

const SubjectAdder = ({ adder }) => {

    const [subjectName, setName] = useState('')
    const [subjectCode, setCode] = useState('')

    const onClick = (e) => {
        e.preventDefault()
        let code = subjectCode
        let name = subjectName
        if (name === '') { name = code }
        if (code === '') { code = name }
        adder(code, name)
    }

    return (
        <div className="w-full shadow-xl card bg-base-300 card-compact">
            <div className="card-body">
                <h2 className="card-title">Tárgy hozzáadása</h2>
                <label className="w-full form-control">
                    <div className="label">
                        <span className="label-text">Tárgy neve</span>
                    </div>
                    <input type="text" placeholder="Tárgy neve" value={subjectName} onChange={(e) => setName(e.target.value)} className="w-full input input-bordered" />
                </label>
                <label className="w-full form-control">
                    <div className="label">
                        <span className="label-text">Tárgy kódja</span>
                    </div>
                    <input type="text" placeholder="Tárgy kódja" value={subjectCode} onChange={(e) => setCode(e.target.value)} className="w-full input input-bordered" />
                </label>
                <div className="justify-center mt-5 card-actions">
                    <button className="btn btn-primary" onClick={(e) => onClick(e)}>Hozzáadás</button>
                </div>
            </div>
        </div>
    )
}

const ServerQuerry = ({ adder }) => {

    const [subjectNameCode, setNameCode] = useState('')
    const [subjectInstructor, setInstructor] = useState('')

    const onClick = (e) => {
        e.preventDefault()
        document.getElementById('import_modal').showModal()
    }

    return (
        <div className="w-full shadow-xl card bg-base-300 card-compact">
            <div className="card-body">
                <h2 className="card-title">Tárgy importálása ELTE TO szerverről</h2>
                <label className="w-full form-control">
                    <div className="label">
                        <span className="label-text">Tárgy neve / kódja</span>
                    </div>
                    <input type="text" placeholder="Tárgy neve / kódja" value={subjectNameCode} onChange={(e) => setNameCode(e.target.value)} className="w-full input input-bordered" />
                </label>
                <label className="w-full form-control">
                    <div className="label">
                        <span className="label-text">Oktató neve</span>
                    </div>
                    <input type="text" placeholder="Oktató neve" value={subjectInstructor} onChange={(e) => setInstructor(e.target.value)} className="w-full input input-bordered" />
                </label>
                <div className="justify-center mt-5 card-actions">
                    <button className="btn btn-primary" onClick={(e) => onClick(e)}>Keresés</button>
                </div>
            </div>

            <Modal firstText={subjectNameCode} secondText={subjectInstructor} />
        </div>
    )
}

const ImportExport = ({ file, setter }) => {

    const downloadJSON = () => {
        const blob = new Blob([JSON.stringify(file)], { type: 'application/json' })

        const url = document.createElement('a')
        url.href = URL.createObjectURL(blob)
        url.download = 'orarend.json'

        document.body.appendChild(url)
        url.click()
    }

    const uploadJSON = (e) => {
        e.preventDefault()

        const fileInput = document.querySelector('input[name="file"]');
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const json = JSON.parse(event.target.result);
                setter(json);
            };
            reader.readAsText(file);
        }
    }

    return (
        <div className="w-full shadow-xl card bg-base-300 card-compact">
            <div className="card-body">
                <h2 className="card-title">Órarend importálása / exportálása</h2>
                <div className='flex justify-center gap-5'>
                    <button className={"justify-start btn btn-lg btn-outline"} onClick={() => downloadJSON()}>
                        <i className={"pi pi-file-export"}></i>
                        Exportálás
                    </button>
                </div>
                <div className="divider"></div>
                <form id='importer'>
                    <div className='flex justify-center gap-5'>
                        <input type="file" name='file' className="w-full max-w-lg file-input file-input-lg file-input-bordered" accept='.json' />
                        <button className={"justify-start btn btn-lg btn-outline"} onClick={(e) => uploadJSON(e)}>
                            <i className={"pi pi-file-import"}></i>
                            Importálás
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const Settings = ({ settings, setSettings }) => {

    let code = settings.show.code
    let time = settings.show.time
    let type = settings.show.type
    let instructor = settings.show.instructor
    let location = settings.show.location
    let notes = settings.show.notes

    let saturday = settings.saturday
    let interval = settings.slot

    function setShowSettings(event, value) {
        setSettings('show', event, value)
    }

    return (
        <div className="w-full shadow-xl card bg-base-300 card-compact">
            <div className="card-body">
                <h2 className="card-title">Beállítások</h2>
                <div className='flex flex-row gap-8 pt-3'>
                    <div className='grid w-1/4 grid-cols-2 gap-2 form-control'>
                        <h3 className='col-span-2 mb-5 font-bold'>Megjelenő információk</h3>
                        <label className="cursor-pointer label">
                            <span className="label-text">Kód</span>
                            <input type="checkbox" checked={code} onChange={() => setShowSettings('code', !code)} className="checkbox" />
                        </label>
                        <label className="cursor-pointer label">
                            <span className="label-text">Idő</span>
                            <input type="checkbox" checked={time} onChange={() => setShowSettings('time', !time)} className="checkbox" />
                        </label>
                        <label className="cursor-pointer label">
                            <span className="label-text">Típus</span>
                            <input type="checkbox" checked={type} onChange={() => setShowSettings('type', !type)} className="checkbox" />
                        </label>
                        <label className="cursor-pointer label">
                            <span className="label-text">Oktató</span>
                            <input type="checkbox" checked={instructor} onChange={() => setShowSettings('instructor', !instructor)} className="checkbox" />
                        </label>
                        <label className="cursor-pointer label">
                            <span className="label-text">Helyszín</span>
                            <input type="checkbox" checked={location} onChange={() => setShowSettings('location', !location)} className="checkbox" />
                        </label>
                        <label className="cursor-pointer label">
                            <span className="label-text">Megjegyzés</span>
                            <input type="checkbox" checked={notes} onChange={() => setShowSettings('notes', !notes)} className="checkbox" />
                        </label>
                    </div>
                    <div className='flex w-1/4 gap-2 form-control'>
                        <h3 className='mb-5 font-bold'>Naptár</h3>
                        <label className="cursor-pointer label">
                            <span className="label-text">Szombat</span>
                            <input type="checkbox" checked={saturday} onChange={() => setSettings('misc', 'saturday', !saturday)} className="checkbox" />
                        </label>
                        <label className="cursor-pointer label">
                            <span className="label-text">Időintervallum (perc)</span>
                            <input type="number" step={5} min={10} value={interval} onChange={(e) => setSettings('misc', 'slot', e.target.value)} className="w-16 input input-sm" />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Help = () => {

    return (
        <div className="w-full shadow-xl card bg-base-300 card-compact">
            <div className="card-body">
                <h2 className="card-title">Súgó</h2>
                <div className='flex flex-row pt-3'>
                    <div className='flex flex-col flex-wrap justify-start w-2/3'>
                        <h3 className='mb-5 font-bold'>Az oldal</h3>
                        <p>A weboldal célja, hogy a felhasználó egyszerre láthassa az összes lehetséges óráját és így dönthessen azok felvételéről.</p>
                        <p>Ezt egyszerűen, a kívánt kurzusra való kattintással megteheti.</p>
                        <p>Minden alkalommal, amikor kiválaszt egy kurzust, a többi eltűnik, beállítástól függően.</p>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div>
                        <h3 className='font-bold '>Tárgyak típusai</h3>
                        <div className='flex flex-row items-center gap-5 mt-5 mb-2'>
                            <i className='pi pi-check-circle' style={{ fontSize: '2rem' }}></i>
                            <p className='text-lg'>Egy kurzus</p>
                        </div>
                        <p className='ml-8'>A tárgyból csak egy kurzust választhatunk, típusától (pl. Gyakorlat) függetlenül.</p>
                        <div className='flex flex-row items-center gap-5 mt-5 mb-2'>
                            <i className='pi pi-list' style={{ fontSize: '2rem' }}></i>
                            <p className='text-lg'>Típusunként egy kurzus</p>
                        </div>
                        <p className='ml-8'>A tárgyból típusonként egy-egy kurzust választhatunk.</p>
                        <div className='flex flex-row items-center gap-5 mt-5 mb-2'>
                            <i className='pi pi-lock' style={{ fontSize: '2rem' }}></i>
                            <p className='text-lg'>Minden kurzus ki van választva</p>
                        </div>
                        <p className='ml-8'>A tárgyból automatikusan minden kurzus ki van választva.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Modal = (props) => {

    return (
        <dialog id="import_modal" className="modal">
            <div className="w-11/12 max-w-7xl modal-box">
                <h3 className="text-lg font-bold">Hello!</h3>
                <p className="py-4">Press ESC key or click the button below to close</p>
                <p className="py-4">{props.firstText}</p>
                <p className="py-4">{props.secondText}</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

const Button = ({ text, icon, mode, set, isDisabled }) => {
    return (
        <button
            className={"justify-start w-full btn btn-lg hover:border-primary flex-1 " + (mode == text ? "bg-primary text-base-300 hover:bg-primary" : "hover:bg-base-100")}
            onClick={() => set(text)}
            disabled={isDisabled}>
            <i className={"pi pi-" + icon}></i>
            {text}
        </button>
    )
}

const Menu = ({ adder, events, setter, settings, setSettings }) => {

    const [mode, setMode] = useState('Hozzáadás')

    function modeSwitch(param) {
        switch (param) {
            case 'Hozzáadás':
                return <SubjectAdder adder={adder} />
            case 'Lekérés':
                return <ServerQuerry adder={adder} />
            case 'Import / Export':
                return <ImportExport file={events} setter={setter} />
            case 'Beállítások':
                return <Settings settings={settings} setSettings={setSettings} />
            case 'Súgó':
                return <Help />
        }
    }

    return (
        <div className='flex content-between'>
            {modeSwitch(mode)}
            <div className="divider divider-horizontal"></div>
            <div className='flex flex-col justify-between w-64 gap-3 buttons'>
                <Button text={'Hozzáadás'} icon={'plus'} mode={mode} set={setMode} />
                <Button text={'Lekérés'} icon={'server'} mode={mode} set={setMode} isDisabled={true} />
                <Button text={'Import / Export'} icon={'file-import'} mode={mode} set={setMode} />
                <Button text={'Beállítások'} icon={'cog'} mode={mode} set={setMode} />
                <Button text={'Súgó'} icon={'question-circle'} mode={mode} set={setMode} />
            </div>
        </div>
    )
}

export default Menu