import React, { useState } from 'react';
import { useTimetable } from '../../contexts';
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

    /**
     * Generates a list of semesters based on the current date.
     * 
     * @returns {Array} An array of semester strings in the format "YYYY-YYYY-X", where X is the semester number.
     */
    const getSemesters = () => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const semesters = [];

        if (currentMonth >= 6) {
            semesters.push(`${currentYear}-${currentYear + 1}-1`);
            semesters.push(`${currentYear - 1}-${currentYear}-2`);
            semesters.push(`${currentYear - 1}-${currentYear}-1`);
        } else {
            semesters.push(`${currentYear - 1}-${currentYear}-2`);
            semesters.push(`${currentYear - 1}-${currentYear}-1`);
            semesters.push(`${currentYear - 2}-${currentYear - 1}-2`);
        }

        return semesters;
    };

    const [semester, setSemester] = useState(getSemesters()[0]);

    /**
     * Parses the course data from the HTML response and extracts relevant information.
     * 
     * @param {string} data - The HTML response containing course data.
     * @param {Array} subjectsAccumulator - An array to accumulate unique subjects found in the response.
     * @returns {Array} An array of course objects with parsed details.
     */
    const parseCourseData = (data, subjectsAccumulator) => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, 'text/html');

        if (!htmlDoc || !htmlDoc.getElementById('resulttable')) {
            console.error('No result table found in response');
            return [];
        }

        const rows = htmlDoc.querySelectorAll('#resulttable tbody tr');
        const courses = [];

        rows.forEach((row, index) => {
            const timeInfo = row.querySelector('[data-label="Időpont"]').textContent;
            const codeInfo = row.querySelector('[data-label="Tárgykód-kurzuskód (típus)"]').textContent;
            const courseName = row.querySelector('[data-label="Tárgynév"]').textContent;
            const location = row.querySelector('[data-label="Helyszín"]').textContent;
            const instructor = row.querySelector('[data-label="Oktató / Megjegyzés"]').textContent.trim();

            const dayMatch = timeInfo.match(/(Hétfő|Hétfo|Kedd|Szerda|Csütörtök|Péntek|Szombat|Vasárnap)/);
            const timeMatch = timeInfo.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);

            if (dayMatch && timeMatch) {
                const day = dayMatch[1];
                const startHour = parseInt(timeMatch[1]);
                const startMin = parseInt(timeMatch[2]);
                const endHour = parseInt(timeMatch[3]);
                const endMin = parseInt(timeMatch[4]);

                const codeMatch = codeInfo.match(/(.*?)\s+\((.*?)\)/);
                let code = codeMatch ? codeMatch[1] : codeInfo;
                const subjectMatch = code.match(/^(.*?)\s*-\s*\d+$/);
                let subject = subjectMatch ? subjectMatch[1] : code;

                if (subject.includes(' ')) {
                    subject = subject.split(' ')[0];
                }

                const type = codeMatch ? codeMatch[2] : '';
                const numberMatch = code.match(/-(\d+)$/);
                code = numberMatch ? numberMatch[1] : code;

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

                courses.push(course);
            }
        });

        return courses;
    };

    /**
     * Fetches course data based on the current semester and subject name or instructor.
     */
    const fetchData = () => {
        console.log(`Fetching data for semester: ${semester}`);

        const subjectsAccumulator = [];

        const API_BASE =
            window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
                ? "/tanrendnavigation.php"
                : "/api/tanrend";

        if (subjectNameCode !== '' && subjectInstructor !== '') {
            console.error('TODO : Implement search by subject name and instructor');
        }
        else if (subjectNameCode !== '') {
            fetch(`${API_BASE}?m=keres_kod_azon&f=${semester}&k=${subjectNameCode}`)
                .then(response => response.text())
                .then(data => {
                    const firstCourses = parseCourseData(data, subjectsAccumulator);
                    setCourses(firstCourses);
                    return fetch(`${API_BASE}?m=keresnevre&f=${semester}&k=${subjectNameCode}`);
                })
                .then(response => response.text())
                .then(data => {
                    const secondCourses = parseCourseData(data, subjectsAccumulator);
                    setCourses(prevItems => {
                        const allCourses = [...prevItems, ...secondCourses];

                        const uniqueCourses = allCourses.filter((course, index, self) => {
                            return index === self.findIndex(c =>
                                c.subject === course.subject &&
                                c.course === course.course &&
                                c.type === course.type &&
                                c.day === course.day &&
                                c.startTime === course.startTime &&
                                c.endTime === course.endTime &&
                                c.instructor === course.instructor &&
                                c.location === course.location
                            );
                        });

                        return uniqueCourses.map((course, index) => ({
                            ...course,
                            id: index
                        }));
                    });

                    setSubjects(subjectsAccumulator);
                    setDataIsLoaded(true);
                })
                .catch(error => console.error('Error fetching subjects:', error));
        }
        else if (subjectInstructor !== '') {
            fetch(`${API_BASE}?m=keres_okt&f=${semester}&k=${subjectInstructor}`)
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

    /**
     * Handles the click event for searching subjects.
     */
    const onClick = (e) => {
        e.preventDefault();

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
