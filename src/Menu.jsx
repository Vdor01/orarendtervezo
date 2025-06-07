import React, { useEffect, useState } from 'react'

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

const ServerQuerry = ({ importer }) => {

    const [subjectNameCode, setNameCode] = useState('')
    const [subjectInstructor, setInstructor] = useState('')

    const [courses, setCourses] = useState([])
    const [subjects, setSubjects] = useState([])
    const [dataIsLoaded, setDataIsLoaded] = useState(false)

    // Helper: parses and accumulates subjects into a given array
    const parseCourseData = (data, subjectsAccumulator) => {
        const parser = new DOMParser()
        const htmlDoc = parser.parseFromString(data, 'text/html')

        if (!htmlDoc || !htmlDoc.getElementById('resulttable')) {
            console.error('No result table found in response')
            return []
        }

        const rows = htmlDoc.querySelectorAll('#resulttable tbody tr')
        const courses = []

        rows.forEach((row, index) => {
            const timeInfo = row.querySelector('[data-label="Időpont"]').textContent;
            const codeInfo = row.querySelector('[data-label="Tárgykód-kurzuskód (típus)"]').textContent
            const courseName = row.querySelector('[data-label="Tárgynév"]').textContent
            const location = row.querySelector('[data-label="Helyszín"]').textContent
            const instructor = row.querySelector('[data-label="Oktató / Megjegyzés"]').textContent.trim()

            const dayMatch = timeInfo.match(/(Hétfő|Hétfo|Kedd|Szerda|Csütörtök|Péntek|Szombat|Vasárnap)/)
            const timeMatch = timeInfo.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/)

            if (dayMatch && timeMatch) {
                const day = dayMatch[1];
                const startHour = parseInt(timeMatch[1])
                const startMin = parseInt(timeMatch[2])
                const endHour = parseInt(timeMatch[3])
                const endMin = parseInt(timeMatch[4])

                const codeMatch = codeInfo.match(/(.*?)\s+\((.*?)\)/)
                let code = codeMatch ? codeMatch[1] : codeInfo
                const subjectMatch = code.match(/^(.*?)\s*-\s*\d+$/)
                let subject = subjectMatch ? subjectMatch[1] : code
                if (subject.includes(' ')) {
                    subject = subject.split(' ')[0]
                }
                const type = codeMatch ? codeMatch[2] : ''

                const numberMatch = code.match(/-(\d+)$/)
                code = numberMatch ? numberMatch[1] : code

                const courseCodeExists = subjectsAccumulator.some(s => s.code === subject);
                if (!courseCodeExists) {
                    subjectsAccumulator.push({
                        id: subjectsAccumulator.length,
                        code: subject,
                        name: courseName
                    });
                }

                const course = {
                    "id": index,
                    "subject": subject,
                    "name": courseName,
                    "course": code,
                    "type": type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
                    "instructor": instructor,
                    "location": location,
                    "day": day === 'Hétfo' ? 'Hétfő' : day,
                    "startTime": `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`,
                    "endTime": `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`,
                    "notes": "",
                    "show": true
                };

                courses.push(course)
            }
        });

        return courses;
    }

    const fetchData = () => {
        const currentDate = new Date()
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()

        let academicYear
        let semester

        if (month >= 7) {
            academicYear = `${year}-${year + 1}`
            semester = "1"
        } else if (month >= 0 && month < 7) {
            academicYear = `${year - 1}-${year}`
            semester = "2"
        }

        const semesterCode = `${academicYear}-${semester}`
        console.log(`Fetching data for semester: ${semesterCode}`)

        const subjectsAccumulator = []

        const API_BASE =
            window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
                ? "/tanrendnavigation.php"
                : "/api/tanrend";

        if (subjectNameCode !== '' && subjectInstructor !== '') {
            console.error('TODO : Implement search by subject name and instructor')
        }
        else if (subjectNameCode !== '') {
            fetch(`${API_BASE}?m=keres_kod_azon&f=${semesterCode}&k=${subjectNameCode}`)
                .then(response => response.text())
                .then(data => {
                    const firstCourses = parseCourseData(data, subjectsAccumulator);
                    setCourses(firstCourses);
                    return fetch(`${API_BASE}?m=keresnevre&f=${semesterCode}&k=${subjectNameCode}`)
                })
                .then(response => response.text())
                .then(data => {
                    const secondCourses = parseCourseData(data, subjectsAccumulator);
                    setCourses(prevItems => {
                        return [...prevItems, ...secondCourses];
                    });
                    setSubjects(subjectsAccumulator);
                    setDataIsLoaded(true);
                })
                .catch(error => console.error('Error fetching subjects:', error));
        }
        else if (subjectInstructor !== '') {
            fetch(`${API_BASE}?m=keres_okt&f=${semesterCode}&k=${subjectInstructor}`)
                .then(response => response.text())
                .then(data => {
                    const courses = parseCourseData(data, subjectsAccumulator);
                    setCourses(courses);
                    setSubjects(subjectsAccumulator);
                    setDataIsLoaded(true);
                })
                .catch(error => console.error('Error fetching subjects:', error));
        }
    };

    const onClick = (e) => {
        e.preventDefault()

        setCourses([])
        setSubjects([])
        setDataIsLoaded(false)
        fetchData();

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

            <Modal courses={courses} subjects={subjects} dataIsLoaded={dataIsLoaded} importer={importer} />
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
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);

    useEffect(() => {
        setSelectedSubjects([]);
        setSelectedCourses([]);
    }, [props.courses]);

    // Helper: get all course ids for a subject
    const getCourseIdsForSubject = (subjectCode) =>
        props.courses.filter(c => c.subject === subjectCode).map(c => 'c' + c.id);

    // Subject checkbox handler
    const handleSubjectChange = (subjectId, subjectCode, checked) => {
        if (checked) {
            setSelectedSubjects(prev => [...prev, subjectId]);
            setSelectedCourses(prev => [
                ...prev,
                ...getCourseIdsForSubject(subjectCode).filter(id => !prev.includes(id))
            ]);
        } else {
            setSelectedSubjects(prev => prev.filter(id => id !== subjectId));
            setSelectedCourses(prev =>
                prev.filter(id => !getCourseIdsForSubject(subjectCode).includes(id))
            );
        }
    };

    // Course checkbox handler
    const handleCourseChange = (courseId, subjectId, subjectCode, checked) => {
        if (checked) {
            setSelectedCourses(prev => [...prev, courseId]);
            // If any course is selected, select the subject
            if (!selectedSubjects.includes(subjectId)) {
                setSelectedSubjects(prev => [...prev, subjectId]);
            }
        } else {
            setSelectedCourses(prev => prev.filter(id => id !== courseId));
            // If no courses remain for this subject, unselect the subject
            const remaining = selectedCourses.filter(id => id !== courseId);
            const courseIds = getCourseIdsForSubject(subjectCode);
            if (!courseIds.some(id => remaining.includes(id))) {
                setSelectedSubjects(prev => prev.filter(id => id !== subjectId));
            }
        }
    };

    // Handle import action
    const handleImport = () => {
        const selectedCoursesData = props.courses.filter(course =>
            selectedCourses.includes('c' + course.id)
        );

        const selectedSubjectsData = props.subjects.filter(subject =>
            selectedSubjects.includes('s' + subject.id)
        );

        // Here you would typically send the selected data to your backend or process it further
        console.log('Selected Courses:', selectedCoursesData);
        console.log('Selected Subjects:', selectedSubjectsData);

        // Call the importer function with selected data
        props.importer(selectedSubjectsData, selectedCoursesData);

        // Close the modal after import
        document.getElementById('import_modal').close();
    };

    return (
        <dialog id="import_modal" className="modal">
            <div className="w-11/12 max-w-7xl modal-box">
                <h3 className="mb-3 text-lg font-bold">Tárgy importálása - {props.courses.length} találat</h3>
                <div className='flex flex-col items-center justify-between gap-3'>
                    {props.dataIsLoaded ? (
                        <div className='w-full overflow-x-auto import-modal'>
                            <table className='table w-full table-pin-rows bg-base-200'>
                                {props.subjects.map((subject) => {
                                    const subjectId = 's' + subject.id;
                                    const courseIds = getCourseIdsForSubject(subject.code);
                                    const subjectChecked = selectedSubjects.includes(subjectId);

                                    return (
                                        <React.Fragment key={subject.code}>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <input
                                                            type='checkbox'
                                                            className='checkbox'
                                                            id={subjectId}
                                                            checked={subjectChecked}
                                                            onChange={e =>
                                                                handleSubjectChange(subjectId, subject.code, e.target.checked)
                                                            }
                                                        />
                                                    </th>
                                                    <th colSpan="3" className='text-lg font-bold'>{subject.code}</th>
                                                    <th colSpan="3" className='text-lg font-bold'>{subject.name}</th>
                                                    <th></th>
                                                    <th></th>
                                                    <th>{courseIds.length} db</th>
                                                </tr>
                                            </thead>
                                            {props.courses
                                                .filter(course => course.subject === subject.code)
                                                .map((course) => {
                                                    const courseId = 'c' + course.id;
                                                    const checked = selectedCourses.includes(courseId);
                                                    return (
                                                        <tbody key={course.id}>
                                                            <tr className={checked ? 'text-success' : ''}>
                                                                <td></td>
                                                                <th>
                                                                    <input
                                                                        type='checkbox'
                                                                        className='checkbox'
                                                                        id={courseId}
                                                                        checked={checked}
                                                                        onChange={e =>
                                                                            handleCourseChange(
                                                                                courseId,
                                                                                subjectId,
                                                                                subject.code,
                                                                                e.target.checked
                                                                            )
                                                                        }
                                                                    />
                                                                </th>
                                                                <td>{course.course}</td>
                                                                <td>{course.name}</td>
                                                                <td>{course.type}</td>
                                                                <td>{course.instructor}</td>
                                                                <td>{course.location}</td>
                                                                <td>{course.day}</td>
                                                                <td>{course.startTime} - {course.endTime}</td>
                                                                <td>{course.notes}</td>
                                                            </tr>
                                                        </tbody>
                                                    );
                                                })}
                                        </React.Fragment>
                                    );
                                })}
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th>Kód</th>
                                        <th>Tárgy</th>
                                        <th>Típus</th>
                                        <th>Oktató</th>
                                        <th>Helyszín</th>
                                        <th>Nap</th>
                                        <th>Idő</th>
                                        <th>Megjegyzés</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : <span className="loading loading-spinner loading-md"></span>}
                    <div className="modal-action">
                        <form method="dialog" className='flex justify-between w-full gap-3'>
                            <button className="btn btn-error">Mégsem</button>
                            <button className="btn btn-success" onClick={handleImport}>Importálás</button>
                        </form>
                    </div>
                </div>
            </div>
        </dialog>
    );
};

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

const Menu = ({ adder, events, setter, settings, setSettings, importer }) => {

    const [mode, setMode] = useState('Hozzáadás')

    function modeSwitch(param) {
        switch (param) {
            case 'Hozzáadás':
                return <SubjectAdder adder={adder} />
            case 'Lekérés':
                return <ServerQuerry importer={importer} />
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
                <Button text={'Lekérés'} icon={'server'} mode={mode} set={setMode} />
                <Button text={'Import / Export'} icon={'file-import'} mode={mode} set={setMode} />
                <Button text={'Beállítások'} icon={'cog'} mode={mode} set={setMode} />
                <Button text={'Súgó'} icon={'question-circle'} mode={mode} set={setMode} />
            </div>
        </div>
    )
}

export default Menu