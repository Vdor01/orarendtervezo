import React from 'react';
import 'primeicons/primeicons.css';
import Courses from '../../Courses';
import SubjectModal from './SubjectModal';
import CourseModal from './CourseModal';
import { useTimetable, useSettings } from '../../contexts';
import CourseAdder from './CourseAdder';
import CourseTable from './CourseTable';

/**
 * Subject component represents a single subject with its courses.
 * It includes functionality to update, remove, and show/hide the subject and its courses.
 * Uses Context API to access all timetable and settings functions.
 * 
 * @param {Object} subject - The subject object containing details like code, name, courses, and status.
 * @returns {JSX.Element} A div element containing the subject details and its courses.
 */
const Subject = ({ subject }) => {
    const { removeSubject, updateShowSubject, addCourse } = useTimetable();
    const { settings } = useSettings();

    const { id, code, name } = subject;
    let { show } = subject.status;

    /**
     * Updates the subject modal to allow editing of the subject details.
     * 
     * @param {Object} subject - The subject object containing details like code and name.
     */
    function updateButton(subject) {
        document.getElementById("subject_modal_" + subject.code).showModal();
    }

    /**
     * Handles the change event for toggling subject visibility.
     * It updates the visibility state and calls the updateShowSubject function.
     */
    function handleChange() {
        show = !show;
        updateShowSubject(id, show);
    }

    /**
     * Determines the status of the subject based on the chosen courses.
     * 
     * @returns {string} A string representing the CSS class for the subject status.
     */
    function getStatus() {
        if (typeof subject.status.choosen === 'object') {
            const courseTypes = subject.courses.map(course => course.type);
            const types = [...new Set(courseTypes)];

            let choosen = 0;
            types.forEach(type => {
                if (subject.status.choosen[type] !== 0) { choosen++; }
            });

            if (choosen === types.length) {
                return 'bg-success text-base-300';
            } else if (choosen > 0) {
                return 'bg-info text-base-300';
            }
        } else if (subject.status.choosen !== 0) {
            return 'bg-success text-base-300';
        }
        return '';
    }

    /**
     * Determines the icon to display based on the subject's status.
     * 
     * @return {string} A string representing the icon class for the subject status.
     */
    function getIcon() {
        if (typeof subject.status.choosen === 'object') {
            return 'list';
        } else if (subject.status.choosen >= 0) {
            return 'check-circle';
        } else {
            return 'lock';
        }
    }

    return (
        <div className='flex items-center justify-between gap-3'>
            <div className="collapse bg-base-200 collapse-arrow shrink">
                <input type="checkbox" />
                <div className={"flex items-center gap-4 text-xl font-medium collapse-title " + getStatus()}>
                    <span className="w-6 h-6 btn-circle" style={{ backgroundColor: subject.status.color }}></span>
                    <i className={'pi pi-' + getIcon()}></i>
                    <span className="w-2/12 min-w-fit">{code}</span>
                    <span className='pl-3'>{name}</span>
                </div>
                <div className="overflow-auto collapse-content">
                    <div>
                        {/* <table className="table overflow-x-scroll table-auto xl:table-md table-sm table-pin-cols">
                            <thead>
                                <tr>
                                    <th>Kurzus</th>
                                    <th>Típus</th>
                                    <th>Oktató</th>
                                    <th>Hely</th>
                                    <th>Nap</th>
                                    <th>Időpont</th>
                                    <th>Megjegyzés</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {subject.courses.map((course, index) => (
                                    <Courses
                                        key={index}
                                        subjectId={id}
                                        choosen={subject.status.choosen}
                                        course={course}
                                        type={course.type}
                                    />
                                ))}
                            </tbody>
                        </table> */}
                        <CourseTable subject={subject} />
                        <CourseAdder subject={subject} />
                    </div>
                </div>
            </div>
            <div className='flex self-start gap-2 mt-1'>
                <label className="btn btn-circle swap swap-rotate">
                    <input type="checkbox" onChange={handleChange} checked={!show} />

                    <div className="swap-on pi pi-eye-slash text-error" style={{ fontSize: '1.5rem' }}></div>
                    <div className="swap-off pi pi-eye" style={{ fontSize: '1.5rem' }}></div>
                </label>
                <button className="btn btn-circle btn-info" onClick={() => updateButton(subject)}>
                    <i className="pi pi-pen-to-square" style={{ fontSize: '1.5rem' }}></i>
                </button>
                <button className="btn btn-circle btn-error" onClick={() => removeSubject(id)}>
                    <i className="pi pi-trash" style={{ fontSize: '1.5rem' }}></i>
                </button>
            </div>
            <SubjectModal subject={subject} />
            {subject.courses.map((course) => (
                <CourseModal key={course.id} subject={subject} course_id={course.id} />
            ))}
        </div>
    );
};

export default Subject;
