import React from 'react'
import 'primeicons/primeicons.css';
import Courses from './Courses';

/**
 * SubjectModal component allows users to modify the details of a subject.
 * It includes fields for color, code, name, and course type.
 * @param {Object} subject - The subject object containing details like code, name, and status.
 * @param {function} updater - Function to update the subject details.
 * @returns {JSX.Element} A dialog element containing the form for subject modification.
 */
const SubjectModal = ({ subject, updater }) => {

    let color = subject.status.color;
    let code = subject.code;
    let name = subject.name;

    let type = 'Típusunként egy kurzus';
    if (typeof subject.status.choosen !== 'object') {
        subject.status.choosen === -1 ? type = 'Minden kurzus ki van választva' : type = 'Egy kurzus';
    }

    /**
     * Handles the save action when the user submits the form.
     * It collects the form data, calls the updater function, and closes the modal.
     * 
     * @param {Event} e - The event object from the form submission.
     */
    const handleSave = (e) => {
        e.preventDefault();
        var form = document.getElementById("subject_form_" + subject.code);
        var formData = new FormData(form);
        updater(subject.id, formData.get('code'), formData.get('name'), formData.get('color'), formData.get('type'));
        code = formData.get('code');
        name = formData.get('name');
        document.getElementById("subject_modal_" + subject.code).close();
    };

    return (
        <dialog id={"subject_modal_" + subject.code} className="modal">
            <div className="w-11/12 max-w-7xl modal-box">
                <h3 className="text-lg font-bold">Tárgy módosítása</h3>
                <form method="dialog" id={"subject_form_" + subject.code} className='flex flex-col items-center justify-between gap-3'>
                    <div className="flex w-full gap-3 mt-5">
                        <label className="w-1/12 form-control">
                            <div className="label">
                                <span className="label-text">Szín</span>
                            </div>
                            <input name='color' type="color" defaultValue={color} className="w-full p-0 input input-bordered" />
                        </label>
                        <label className="w-3/12 form-control">
                            <div className="label">
                                <span className="label-text">Kód</span>
                            </div>
                            <input name='code' type="text" placeholder="Kód" defaultValue={code} className="w-full input input-bordered" />
                        </label>
                        <label className="w-5/12 form-control">
                            <div className="label">
                                <span className="label-text">Név</span>
                            </div>
                            <input name='name' type="text" placeholder="Név" defaultValue={name} className="w-full input input-bordered" />
                        </label>
                        <label className="w-3/12 max-w-xs form-control">
                            <div className="label">
                                <span className="label-text">Kurzus típusa</span>
                            </div>
                            <select name='type' defaultValue={type} className="select select-bordered">
                                <option id='egy'>Egy kurzus</option>
                                <option id='tipusonkent'>Típusunként egy kurzus</option>
                                <option id='fix'>Minden kurzus ki van választva</option>
                            </select>
                        </label>
                    </div>
                    <div className="modal-action">
                        <button className="btn btn-error">Mégsem</button>
                        <button className="btn btn-success" onClick={handleSave}>Mentés</button>
                    </div>
                </form>
            </div>
        </dialog>
    )
}

/**
 * CourseModal component allows users to modify the details of a course within a subject.
 * It includes fields for course code, type, instructor, location, day, start time, end time, and notes.
 * 
 * @param {Object} subject - The subject object containing details like courses.
 * @param {string} course_id - The ID of the course to be modified.
 * @param {function} updater - Function to update the course details.
 * @param {Object} settings - Settings object containing configuration options.
 * @returns {JSX.Element} A dialog element containing the form for course modification.
 */
const CourseModal = ({ subject, course_id, updater, settings }) => {

    let course = subject.courses.find(course => course.id === course_id)

    let code = course.course
    let type = course.type
    let instructor = course.instructor
    let location = course.location
    let day = course.day
    let startTime = course.startTime
    let endTime = course.endTime
    let notes = course.notes

    /**
     * Handles the save action when the user submits the course modification form.
     * It collects the form data, validates the course code, and calls the updater function.
     * 
     * @param {Event} e - The event object from the form submission.
     */
    const handleSave = (e) => {
        e.preventDefault();
        var form = document.getElementById("subject_form_" + subject.id + "_" + course.id);
        var formData = new FormData(form);

        let error = formData.get('code') === "0" || formData.get('code') === "-1"
        var codeInput = document.querySelector(`#subject_form_${subject.id}_${course.id} input[name='code']`);
        if (error) {
            codeInput.setCustomValidity("A kód nem lehet 0 vagy -1!");
        } else {
            codeInput.setCustomValidity("");
            document.getElementById("course_modal_" + subject.id + "_" + course.id).close();
            updater(subject.id, course.id, formData.get('code'), formData.get('type'), formData.get('instructor'), formData.get('location'), formData.get('day'), formData.get('startTime'), formData.get('endTime'), formData.get('notes'));
        }
        codeInput.reportValidity();
    };

    return (
        <dialog id={"course_modal_" + subject.id + "_" + course.id} className="modal">
            <div className="w-11/12 max-w-7xl modal-box">
                <h3 className="text-lg font-bold">Kurzus módosítása</h3>
                <form method="dialog" id={"subject_form_" + subject.id + "_" + course.id} className='flex flex-col items-center justify-between gap-3'>
                    <div className="grid w-full grid-cols-12 gap-5 mt-5">
                        <label className="w-full col-span-2 form-control">
                            <div className="label">
                                <span className="label-text">Kód</span>
                            </div>
                            <input type="text" name='code' placeholder="#" defaultValue={code} className="w-full input input-bordered input-sm invalid:border-error" />
                        </label>
                        <label className="w-full col-span-5 form-control">
                            <div className="label">
                                <span className="label-text">Típus</span>
                            </div>
                            <select name='type' defaultValue={type} className="w-full select select-bordered select-sm">
                                <option id='Gyakorlat'>Gyakorlat</option>
                                <option id='Előadás'>Előadás</option>
                            </select>
                        </label>
                        <label className="w-full col-span-5 form-control">
                            <div className="label">
                                <span className="label-text">Oktató</span>
                            </div>
                            <input type="text" name='instructor' defaultValue={instructor} placeholder="Példa Béla" className="w-full input input-bordered input-sm" />
                        </label>
                        <label className="w-full col-span-6 form-control">
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
                        <label className="w-full col-span-6 form-control">
                            <div className="label">
                                <span className="label-text">Idő</span>
                            </div>
                            <div className='flex w-full gap-3'>
                                <input type="time" name='startTime' defaultValue={startTime} className="input input-bordered input-sm" />
                                -
                                <input type="time" name='endTime' defaultValue={endTime} className="input input-bordered input-sm" />
                            </div>
                        </label>
                        <label className="w-full col-span-6 form-control">
                            <div className="label">
                                <span className="label-text">Helyszín</span>
                            </div>
                            <input type="text" name='location' defaultValue={location} placeholder="Északi Tömb 7.15 (PC11)" className="w-full input input-bordered input-sm" />
                        </label>
                        <label className="w-full col-span-6 form-control">
                            <div className="label">
                                <span className="label-text">Megjegyzés</span>
                            </div>
                            <input type="text" name='notes' defaultValue={notes} placeholder="Megjegyzés" className="w-full col-span-6 input input-bordered input-sm" />
                        </label>
                    </div>
                    <div className="modal-action">
                        <button className="btn btn-error">Mégsem</button>
                        <button className="btn btn-success" onClick={handleSave}>Mentés</button>
                    </div>
                </form>
            </div>
        </dialog>
    )
}

/**
 * Subject component represents a single subject with its courses.
 * It includes functionality to update, remove, and show/hide the subject and its courses.
 * 
 * @param {Object} subject - The subject object containing details like code, name, courses, and status.
 * @param {function} subjectUpdater - Function to update the subject details.
 * @param {function} subjectRemover - Function to remove the subject.
 * @param {function} subjectShow - Function to toggle the visibility of the subject.
 * @param {function} courseAdder - Function to add a new course to the subject.
 * @param {function} courseRemover - Function to remove a course from the subject.
 * @param {function} courseUpdater - Function to update the course details.
 * @param {function} courseShow - Function to toggle the visibility of a course.
 * @param {Object} settings - Settings object containing configuration options.
 * @param {function} setter - Function to set the selected course for the subject.
 * @returns {JSX.Element} A div element containing the subject details and its courses.
 */
const Subject = ({ subject, subjectUpdater, subjectRemover, subjectShow, courseAdder, courseRemover, courseUpdater, courseShow, settings, setter }) => {

    let id = subject.id;
    let code = subject.code;
    let name = subject.name;
    let show = subject.status.show;

    /**
     * Updates the subject modal to allow editing of the subject details.
     * 
     * @param {Object} subject - The subject object containing details like code and name.
     */
    function updateButton(subject) { document.getElementById("subject_modal_" + subject.code).showModal() }

    /**
     * Handles the change event for toggling subject visibility.
     * It updates the visibility state and calls the subjectShow function.
     */
    function handleChange() {
        show = !show
        subjectShow(id, show)
    }

    /**
     * Handles the submission of the course form.
     * It collects the form data, validates the course code, and calls the courseAdder function.
     * 
     * @param {Event} e - The event object from the form submission.
     */
    function handleSubmit(e) {
        e.preventDefault();
        var form = document.getElementById("course_form_" + subject.code);
        var formData = new FormData(form);

        let error = formData.get('code') === "0" || formData.get('code') === "-1"
        var codeInput = document.querySelector(`#course_form_${subject.code} input[name='code']`);
        if (error) {
            codeInput.setCustomValidity("A kód nem lehet 0 vagy -1!");
        } else {
            codeInput.setCustomValidity("");
            courseAdder(subject.id, formData.get('code'), formData.get('type'), formData.get('instructor'), formData.get('location'), formData.get('day'), formData.get('startTime'), formData.get('endTime'), formData.get('notes'));
        }
        codeInput.reportValidity();
    }

    /**
     * Determines the status of the subject based on the chosen courses.
     * 
     * @returns {string} A string representing the CSS class for the subject status.
     */
    function getStatus() {
        if (typeof subject.status.choosen === 'object') {
            let courseTypes = subject.courses.map(course => course.type);
            let types = [...new Set(courseTypes)];

            let choosen = 0
            types.forEach(type => {
                if (subject.status.choosen[type] !== 0) { choosen++ }
            });
            if (choosen === types.length) { return 'bg-success text-base-300' } else if (choosen > 0) { return 'bg-info text-base-300' }
        } else if (subject.status.choosen !== 0) { return 'bg-success text-base-300' }
    }

    /**
     * Determines the icon to display based on the subject's status.
     * 
     * @return {string} A string representing the icon class for the subject status.
     */
    function getIcon() {
        if (typeof subject.status.choosen === 'object') {
            return 'list'
        } else if (subject.status.choosen >= 0) {
            return 'check-circle'
        } else {
            return 'lock'
        }
    }

    return (
        <div className='flex items-center justify-between gap-3'>
            <div className="collapse bg-base-200 collapse-arrow">
                <input type="checkbox" />
                <div className={"flex items-center gap-4 text-xl font-medium collapse-title " + (getStatus())}>
                    <span className="w-6 h-6 btn-circle" style={{ backgroundColor: subject.status.color }}></span>
                    <i className={'pi pi-' + getIcon()}></i>
                    <span className="w-2/12 min-w-fit">{code}</span>
                    <span className='pl-3'>{name}</span>
                </div>
                <div className="collapse-content">
                    <div className="overflow-x-auto">
                        <form id={"course_form_" + subject.code} onSubmit={(e) => e.preventDefault()}>
                            <table className="table table-auto table-zebra">
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
                                            remover={courseRemover}
                                            type={course.type}
                                            show={courseShow}
                                            setter={setter} />
                                    ))}
                                    <tr>
                                        <th className='w-1/12'><input type="text" name='code' placeholder="#" className="w-full max-w-xs input input-bordered input-sm invalid:border-error" /></th>
                                        <th className='w-2/12'>
                                            <select name='type' className="w-full max-w-xs select select-bordered select-sm">
                                                <option>Gyakorlat</option>
                                                <option>Előadás</option>
                                            </select>
                                        </th>
                                        <th className='w-2/12'><input type="text" name='instructor' placeholder="Példa Béla" className="w-full max-w-xs input input-bordered input-sm" /></th>
                                        <th className='w-2/12'><input type="text" name='location' placeholder="Északi Tömb 7.15 (PC11)" className="w-full max-w-xs input input-bordered input-sm" /></th>
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
                                            <input type="time" name='startTime' className="input input-bordered input-sm" />
                                            -
                                            <input type="time" name='endTime' className="input input-bordered input-sm" />
                                        </th>
                                        <th className='w-2/12'><input type="text" name='notes' placeholder="Megjegyzés" className="w-full max-w-xs input input-bordered input-sm" /></th>
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
                <button className="btn btn-circle btn-error" onClick={() => subjectRemover(id)}>
                    <i className="pi pi-trash" style={{ fontSize: '1.5rem' }}></i>
                </button>
            </div>
            <SubjectModal subject={subject} updater={subjectUpdater} />
            {subject.courses.map((course) => (<CourseModal key={course.id} subject={subject} course_id={course.id} updater={courseUpdater} settings={settings} />))}
        </div>
    )
}

/**
 * Subjects component renders a list of subjects.
 * It maps through the subjects array and renders a Subject component for each subject.
 * 
 * @param {Array} subjects - An array of subject objects.
 * @param {function} subjectUpdater - Function to update the subject details.
 * @param {function} subjectRemover - Function to remove a subject.
 * @param {function} subjectShow - Function to toggle the visibility of a subject.
 * @param {function} courseAdder - Function to add a new course to a subject.
 * @param {function} courseRemover - Function to remove a course from a subject.
 * @param {function} courseUpdater - Function to update the course details.
 * @param {function} courseShow - Function to toggle the visibility of a course.
 * @param {Object} settings - Settings object containing configuration options.
 * @param {function} setter - Function to set the selected course for the subject.
 * @returns {JSX.Element} A div element containing a list of Subject components.
 */
const Subjects = ({ subjects, subjectUpdater, subjectRemover, subjectShow, courseAdder, courseRemover, courseUpdater, courseShow, settings, setter }) => {

    return (
        <div className='flex flex-col gap-5 bg-base-300 card'>
            {subjects.map((subject) => (
                <Subject
                    key={subject.id}
                    subject={subject}
                    subjectRemover={subjectRemover}
                    subjectUpdater={subjectUpdater}
                    subjectShow={subjectShow}
                    courseAdder={courseAdder}
                    courseRemover={courseRemover}
                    courseUpdater={courseUpdater}
                    courseShow={courseShow}
                    settings={settings}
                    setter={setter} />
            ))}
        </div>
    )
}

export default Subjects