import React from 'react';
import 'primeicons/primeicons.css';
import Courses from '../../Courses';
import SubjectModal from './SubjectModal';
import CourseModal from './CourseModal';
import { useTimetable, useSettings } from '../../contexts';

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
     * Handles the submission of the course form.
     * It collects the form data, validates the course code, and calls the addCourse function.
     * 
     * @param {Event} e - The event object from the form submission.
     */
    function handleSubmit(e) {
        e.preventDefault();
        const form = document.getElementById("course_form_" + subject.code);
        const formData = new FormData(form);

        let emptyFields = false;

        const dataNames = ['code', 'instructor', 'location', 'startTime', 'endTime'];
        dataNames.forEach(name => {
            const input = form.querySelector(`#course_form_${subject.code} input[name='${name}']`);
            if (!input.value) {
                input.setCustomValidity("Ennek a mezőnek a kitöltése kötelező!");
                input.reportValidity();
                emptyFields = true;
            } else {
                input.setCustomValidity("");
            }
        });

        const codeInput = document.querySelector(`#course_form_${subject.code} input[name='code']`);
        const codeInputValue = codeInput.value;
        const codeError = codeInputValue === "0" || codeInputValue === "-1";

        if (codeError) {
            codeInput.setCustomValidity("A kód nem lehet 0 vagy -1!");
            codeInput.reportValidity();
        } else if (emptyFields) {
            // Do nothing, as the individual fields have already reported their validity
        } else {
            codeInput.setCustomValidity("");
            addCourse(
                subject.id,
                formData.get('code'),
                formData.get('type'),
                formData.get('instructor'),
                formData.get('location'),
                formData.get('day'),
                formData.get('startTime'),
                formData.get('endTime'),
                formData.get('notes')
            );
        }
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
                    <div className="overflow-x-scroll">
                        <form id={"course_form_" + subject.code} onSubmit={(e) => e.preventDefault()}>
                            <table className="table table-auto xl:table-md table-sm table-pin-cols">
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
                                    <tr>
                                        <th className='w-1/12'>
                                            <input
                                                type="text"
                                                name='code'
                                                placeholder="#"
                                                className="w-full max-w-xs input input-bordered input-sm invalid:border-error"
                                            />
                                        </th>
                                        <th className='w-2/12'>
                                            <select name='type' className="w-full max-w-xs select select-bordered select-sm">
                                                <option>Gyakorlat</option>
                                                <option>Előadás</option>
                                            </select>
                                        </th>
                                        <th className='w-2/12'>
                                            <input
                                                type="text"
                                                name='instructor'
                                                placeholder="Példa Béla"
                                                className="w-full max-w-xs input input-bordered input-sm invalid:border-error"
                                            />
                                        </th>
                                        <th className='w-2/12'>
                                            <input
                                                type="text"
                                                name='location'
                                                placeholder="Északi Tömb 7.15 (PC11)"
                                                className="w-full max-w-xs input input-bordered input-sm invalid:border-error"
                                            />
                                        </th>
                                        <th className='w-2/12'>
                                            <select name='day' className="w-full max-w-xs select select-bordered select-sm">
                                                <option>Hétfő</option>
                                                <option>Kedd</option>
                                                <option>Szerda</option>
                                                <option>Csütörtök</option>
                                                <option>Péntek</option>
                                                {settings.saturday && <option>Szombat</option>}
                                            </select>
                                        </th>
                                        <th className='flex items-center w-2/12 h-24 gap-1'>
                                            <input
                                                type="time"
                                                name='startTime'
                                                className="input input-bordered input-sm invalid:border-error"
                                            />
                                            -
                                            <input
                                                type="time"
                                                name='endTime'
                                                className="input input-bordered input-sm invalid:border-error"
                                            />
                                        </th>
                                        <th className='w-2/12'>
                                            <input
                                                type="text"
                                                name='notes'
                                                placeholder="Megjegyzés"
                                                className="w-full max-w-xs input input-bordered input-sm"
                                            />
                                        </th>
                                        <th className='w-1/12 text-right'>
                                            <button className="btn btn-circle btn-success" onClick={handleSubmit}>
                                                <i className="pi pi-plus" style={{ fontSize: '1.5rem' }}></i>
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
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
