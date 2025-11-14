import React, { useEffect, useState } from 'react';

/**
 * Modal component displays a dialog for importing subjects and courses.
 * It allows users to select subjects and courses from a list, and import them into the application.
 * @param {object} props - Contains courses, subjects, dataIsLoaded, and importer function.
 * @returns {JSX.Element} A dialog element containing a table of subjects and courses with checkboxes for selection.
 */
const ImportModal = (props) => {
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);

    useEffect(() => {
        setSelectedSubjects([]);
        setSelectedCourses([]);
    }, [props.courses]);

    /**
     * Checks if a subject code already exists in the current eventsJSON.
     * 
     * @param {string} subjectCode - The code of the subject to check.
     * @returns {boolean} True if the subject code exists, false otherwise.
     */
    const subjectExists = (subjectCode) => {
        return props.existingSubjectCodes && props.existingSubjectCodes.includes(subjectCode);
    };

    /**
     * Gets all course IDs for a given subject code.
     * 
     * @param {string} subjectCode - The code of the subject for which to get course IDs.
     * @returns {Array} An array of course IDs prefixed with 'c'.
     */
    const getCourseIdsForSubject = (subjectCode) =>
        props.courses.filter(c => c.subject === subjectCode).map(c => 'c' + c.id);

    /**
     * Handles the change event for subject checkboxes.
     */
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

    /**
     * Handles the change event for course checkboxes.
     */
    const handleCourseChange = (courseId, subjectId, subjectCode, checked) => {
        if (checked) {
            setSelectedCourses(prev => [...prev, courseId]);
            if (!selectedSubjects.includes(subjectId)) {
                setSelectedSubjects(prev => [...prev, subjectId]);
            }
        } else {
            setSelectedCourses(prev => prev.filter(id => id !== courseId));
            const remaining = selectedCourses.filter(id => id !== courseId);
            const courseIds = getCourseIdsForSubject(subjectCode);
            if (!courseIds.some(id => remaining.includes(id))) {
                setSelectedSubjects(prev => prev.filter(id => id !== subjectId));
            }
        }
    };

    /**
     * Handles the import action when the user clicks the "Importálás" button.
     */
    const handleImport = () => {
        const selectedCoursesData = props.courses.filter(course =>
            selectedCourses.includes('c' + course.id)
        );

        const selectedSubjectsData = props.subjects.filter(subject =>
            selectedSubjects.includes('s' + subject.id)
        );

        props.importer(selectedSubjectsData, selectedCoursesData);

        document.getElementById('import_modal').close();
    };

    return (
        <dialog id="import_modal" className="modal">
            <div className="w-11/12 max-w-7xl modal-box">
                <h3 className="mb-3 text-lg font-bold">Tárgy importálása - {props.courses.length} találat</h3>
                <div className='flex flex-col h-full gap-3'>
                    {props.dataIsLoaded ? (
                        <div className='flex-1 w-full overflow-auto import-modal'>
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
                                                    {subjectExists(subject.code) ? (
                                                        <th colSpan="2" className='text-warning'>
                                                            Már létezik! <i className='pl-4 pi pi-question-circle' title='Felül fogja írni a már létező tárgyat!' style={{ fontSize: '1rem' }}></i>
                                                        </th>
                                                    ) : (
                                                        <th colSpan="2"></th>
                                                    )}
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
                    ) : (
                        <div className='flex items-center justify-center flex-1'>
                            <span className="loading loading-spinner loading-md"></span>
                        </div>
                    )}
                    <div className="shrink-0">
                        <form method="dialog" className='flex justify-center w-full gap-12'>
                            <button className="btn btn-error">Mégsem</button>
                            <button className="btn btn-success" onClick={handleImport}>Importálás</button>
                        </form>
                    </div>
                </div>
            </div>
        </dialog>
    );
};

export default ImportModal;
