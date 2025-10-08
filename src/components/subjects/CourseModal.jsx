import React, { useState } from 'react';
import { useTimetable, useSettings } from '../../contexts';

/**
 * CourseModal component allows users to modify the details of a course within a subject.
 * It includes fields for course code, type, instructor, location, day, start time, end time, and notes.
 * Uses Context API to access timetable and settings functions.
 * 
 * @param {Object} subject - The subject object containing details like courses.
 * @param {string} course_id - The ID of the course to be modified.
 * @returns {JSX.Element} A dialog element containing the form for course modification.
 */
const CourseModal = ({ subject, course_id }) => {
    const { updateCourse } = useTimetable();
    const { settings } = useSettings();

    const [errors, setErrors] = useState({
        code: false,
        instructor: false,
        location: false,
        startTime: false,
        endTime: false
    });

    const course = subject.courses.find(course => course.id === course_id);

    const {
        course: code,
        type,
        instructor,
        location,
        day,
        startTime,
        endTime,
        notes
    } = course;

    /**
     * Handles the save action when the user submits the course modification form.
     * It collects the form data, validates the course code, and calls the updateCourse function.
     * 
     * @param {Event} e - The event object from the form submission.
     */
    const handleSave = (e) => {
        e.preventDefault();
        const form = document.getElementById("subject_form_" + subject.id + "_" + course.id);
        const formData = new FormData(form);

        let emptyFields = false;

        const dataNames = ['code', 'instructor', 'location', 'startTime', 'endTime'];
        dataNames.forEach(name => {
            const input = form.querySelector(`#subject_form_${subject.id}_${course.id} input[name='${name}']`);
            if (!input.value) {
                setErrors(prev => ({ ...prev, [name]: true }));
                emptyFields = true;
            } else {
                setErrors(prev => ({ ...prev, [name]: false }));
            }
        });

        const codeInput = document.querySelector(`#subject_form_${subject.id}_${course.id} input[name='code']`);
        const codeInputValue = codeInput.value;
        const codeError = codeInputValue === "0" || codeInputValue === "-1";

        if (codeError) {
            codeInput.setCustomValidity("A kód nem lehet 0 vagy -1!");
            codeInput.reportValidity();
        } else if (emptyFields) {
            // Do nothing, as the individual fields have already reported their validity
        } else if (formData.get('startTime') >= formData.get('endTime')) {
            const endTimeInput = document.querySelector(`#subject_form_${subject.id}_${course.id} input[name='endTime']`);
            endTimeInput.reportValidity();
        } else {
            codeInput.setCustomValidity("");
            document.getElementById("course_modal_" + subject.id + "_" + course.id).close();
            updateCourse(
                subject.id,
                course.id,
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
    };

    const handleCancel = (e) => {
        e.preventDefault();

        const form = document.getElementById("subject_form_" + subject.id + "_" + course.id);
        form.querySelector('input[name="code"]').value = code;
        form.querySelector('select[name="type"]').value = type;
        form.querySelector('input[name="instructor"]').value = instructor;
        form.querySelector('input[name="location"]').value = location;
        form.querySelector('select[name="day"]').value = day;
        form.querySelector('input[name="startTime"]').value = startTime;
        form.querySelector('input[name="endTime"]').value = endTime;
        form.querySelector('input[name="notes"]').value = notes;

        setErrors({
            code: false,
            instructor: false,
            location: false,
            startTime: false,
            endTime: false
        });

        document.getElementById("course_modal_" + subject.id + "_" + course.id).close();
    };

    return (
        <dialog id={"course_modal_" + subject.id + "_" + course.id} className="modal">
            <div className="w-11/12 max-w-7xl modal-box">
                <h3 className="text-lg font-bold">Kurzus módosítása</h3>
                <form method="dialog" id={"subject_form_" + subject.id + "_" + course.id} className='flex flex-col items-center justify-between gap-3'>
                    <div className="grid w-full grid-cols-12 gap-5 mt-5">
                        <label className="w-full h-16 col-span-2 form-control">
                            <div className="label">
                                <span className="label-text">Kód</span>
                            </div>
                            <input
                                type="text"
                                name='code'
                                placeholder="#"
                                defaultValue={code}
                                className={`w-full input input-bordered input-sm ${errors.code ? "border-error" : ""}`}
                            />
                            {errors.code && <p className="text-sm label text-error">Kötelező</p>}
                        </label>
                        <label className="w-full h-16 col-span-5 form-control">
                            <div className="label">
                                <span className="label-text">Típus</span>
                            </div>
                            <select name='type' defaultValue={type} className="w-full select select-bordered select-sm">
                                <option id='Gyakorlat'>Gyakorlat</option>
                                <option id='Előadás'>Előadás</option>
                            </select>
                        </label>
                        <label className="w-full h-16 col-span-5 form-control">
                            <div className="label">
                                <span className="label-text">Oktató</span>
                            </div>
                            <input
                                type="text"
                                name='instructor'
                                defaultValue={instructor}
                                placeholder="Példa Béla"
                                className={`w-full input input-bordered input-sm ${errors.instructor ? "border-error" : ""}`}
                            />
                            {errors.instructor && <p className="text-sm label text-error">Kötelező</p>}
                        </label>
                        <label className="w-full h-16 col-span-6 form-control">
                            <div className="label">
                                <span className="label-text">Nap</span>
                            </div>
                            <select name='day' defaultValue={day} className="w-full select select-bordered select-sm">
                                <option id='Hétfő'>Hétfő</option>
                                <option id='Kedd'>Kedd</option>
                                <option id='Szerda'>Szerda</option>
                                <option id='Csütörtök'>Csütörtök</option>
                                <option id='Péntek'>Péntek</option>
                                {settings.saturday && <option id='Szombat'>Szombat</option>}
                            </select>
                        </label>
                        <label className="w-full h-16 col-span-6 form-control">
                            <div className="label">
                                <span className="label-text">Idő</span>
                            </div>
                            <div className='flex w-full gap-3'>
                                <input
                                    type="time"
                                    name='startTime'
                                    defaultValue={startTime}
                                    className={`input input-bordered input-sm ${errors.startTime ? "border-error" : ""}`}
                                />
                                -
                                <input
                                    type="time"
                                    name='endTime'
                                    defaultValue={endTime}
                                    className={`input input-bordered input-sm ${errors.endTime ? "border-error" : ""}`}
                                />
                            </div>
                            {(errors.endTime || errors.startTime) && <p className="text-sm label text-error">Kötelező</p>}
                        </label>
                        <label className="w-full h-16 col-span-6 form-control">
                            <div className="label">
                                <span className="label-text">Helyszín</span>
                            </div>
                            <input
                                type="text"
                                name='location'
                                defaultValue={location}
                                placeholder="Északi Tömb 7.15 (PC11)"
                                className={`w-full input input-bordered input-sm ${errors.location ? "border-error" : ""}`}
                            />
                            {errors.location && <p className="text-sm label text-error">Kötelező</p>}
                        </label>
                        <label className="w-full h-16 col-span-6 form-control">
                            <div className="label">
                                <span className="label-text">Megjegyzés</span>
                            </div>
                            <input
                                type="text"
                                name='notes'
                                defaultValue={notes}
                                placeholder="Megjegyzés"
                                className="w-full col-span-6 input input-bordered input-sm"
                            />
                        </label>
                    </div>
                    <div className="modal-action">
                        <button className="btn btn-error" onClick={handleCancel}>Mégsem</button>
                        <button className="btn btn-success" onClick={handleSave}>Mentés</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default CourseModal;
