import React, { useState } from 'react';
import { useTimetable } from '../../contexts';
import { getSemesters, searchCoursesBySubject, searchCoursesByInstructor } from '../../utils/serverApi';
import ImportModal from './ImportModal';

/**
 * ServerQuery component allows users to search for subjects by name or instructor.
 * 
 * @returns {JSX.Element} A form for searching subjects with input fields for name/code and instructor.
 */
const ServerQuery = () => {
    const { importFromArrays } = useTimetable();

    const [subjectNameCode, setNameCode] = useState('');
    const [subjectInstructor, setInstructor] = useState('');
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [dataIsLoaded, setDataIsLoaded] = useState(false);

    const [semester, setSemester] = useState(getSemesters()[0]);

    /**
     * Fetches course data based on the current semester and subject name or instructor.
     */
    const fetchData = async () => {
        console.log(`Fetching data for semester: ${semester}`);

        try {
            if (subjectNameCode !== '' && subjectInstructor !== '') {
                console.error('TODO : Implement search by subject name and instructor');
            }
            else if (subjectNameCode !== '') {
                const { courses: fetchedCourses, subjects: fetchedSubjects } = await searchCoursesBySubject(subjectNameCode, semester);
                setCourses(fetchedCourses);
                setSubjects(fetchedSubjects);
                setDataIsLoaded(true);
            }
            else if (subjectInstructor !== '') {
                const { courses: fetchedCourses, subjects: fetchedSubjects } = await searchCoursesByInstructor(subjectInstructor, semester);
                setCourses(fetchedCourses);
                setSubjects(fetchedSubjects);
                setDataIsLoaded(true);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    /**
     * Handles the click event for searching subjects.
     */
    const onClick = (e) => {
        e.preventDefault();

        if (subjectNameCode === '' && subjectInstructor === '') {
            alert('Kérlek adj meg legalább egy keresési feltételt!');
            return;
        }
        setCourses([]);
        setSubjects([]);
        setDataIsLoaded(false);
        fetchData();

        document.getElementById('import_modal').showModal();
    };

    return (
        <div className="w-full shadow-xl card bg-base-300 card-compact">
            <form className="card-body" id='subject_search_form'>
                <h2 className="card-title">Tárgy importálása ELTE Tanrend adatbázisból</h2>
                <label className="w-full form-control">
                    <div className="label">
                        <span className="label-text">Tárgy neve / kódja</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Tárgy neve / kódja"
                        value={subjectNameCode}
                        onChange={(e) => setNameCode(e.target.value)}
                        className="w-full input input-bordered"
                    />
                </label>
                <label className="w-full form-control">
                    <div className="label">
                        <span className="label-text">Oktató neve</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Oktató neve"
                        value={subjectInstructor}
                        onChange={(e) => setInstructor(e.target.value)}
                        className="w-full input input-bordered"
                    />
                </label>
                <div className="justify-center mt-5 card-actions">
                    <select
                        className="select"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                    >
                        {semester && getSemesters().map((sem, index) => (
                            <option key={index} value={sem}>{sem}</option>
                        ))}
                    </select>
                    <button className="btn btn-primary" onClick={(e) => onClick(e)}>
                        Keresés
                    </button>
                </div>
            </form>

            <ImportModal
                courses={courses}
                subjects={subjects}
                dataIsLoaded={dataIsLoaded}
                importer={importFromArrays}
            />
        </div>
    );
};

export default ServerQuery;
