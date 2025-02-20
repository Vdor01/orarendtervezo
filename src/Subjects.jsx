import React from 'react'
import 'primeicons/primeicons.css';
import Courses from './Courses';

const SubjectModal = ({ subject, updater }) => {

    let color = subject.status.color;
    let code = subject.code;
    let name = subject.name;

    let type = 'Típusunként egy kurzus';
    if (typeof subject.status.choosen !== 'object') {
        subject.status.choosen === -1 ? type = 'Minden kurzus ki van választva' : type = 'Egy kurzus';
    }

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

const CourseModal = ({ subject, course_id, updater }) => {

    let course = subject.courses.find(course => course.id === course_id)

    let code = course.course
    let type = course.type
    let instructor = course.instructor
    let location = course.location
    let day = course.day
    let startTime = course.startTime
    let endTime = course.endTime
    let notes = course.notes

    const handleSave = (e) => {
        e.preventDefault();
        var form = document.getElementById("subject_form_" + course.id);
        var formData = new FormData(form);
        updater(subject.id, course.id, formData.get('code'), formData.get('type'), formData.get('instructor'), formData.get('location'), formData.get('day'), formData.get('startTime'), formData.get('endTime'), formData.get('notes'));
        document.getElementById("course_modal_" + subject.id + "_" + course.id).close();
    };

    return (
        <dialog id={"course_modal_" + subject.id + "_" + course.id} className="modal">
            <div className="w-11/12 max-w-7xl modal-box">
                <h3 className="text-lg font-bold">Kurzus módosítása</h3>
                <form method="dialog" id={"subject_form_" + course.id} className='flex flex-col items-center justify-between gap-3'>
                    <div className="grid w-full grid-cols-12 gap-5 mt-5">
                        <label className="w-full col-span-2 form-control">
                            <div className="label">
                                <span className="label-text">Kód</span>
                            </div>
                            <input type="number" name='code' min={1} placeholder="#" defaultValue={code} className="w-full input input-bordered input-sm" />
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

const Subject = ({ subject, subjectUpdater, subjectRemover, subjectShow, courseAdder, courseRemover, courseUpdater, courseShow }) => {

    let id = subject.id;
    let code = subject.code;
    let name = subject.name;
    let show = subject.status.show;

    function updateButton(subject) { document.getElementById("subject_modal_" + subject.code).showModal() }

    function handleChange() {
        show = !show
        subjectShow(id, show)
    }

    function handleSubmit(e) {
        e.preventDefault();
        var form = document.getElementById("course_form_" + subject.code);
        var formData = new FormData(form);
        courseAdder(subject.id, formData.get('code'), formData.get('type'), formData.get('instructor'), formData.get('location'), formData.get('day'), formData.get('startTime'), formData.get('endTime'), formData.get('notes'));
    }

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
                                            show={courseShow} />
                                    ))}
                                    <tr>
                                        <th className='w-1/12'><input type="number" name='code' min={1} placeholder="#" className="w-full max-w-xs input input-bordered input-sm" /></th>
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
            {subject.courses.map((course) => (<CourseModal key={course.id} subject={subject} course_id={course.id} updater={courseUpdater} />))}
        </div>
    )
}

const Subjects = ({ subjects, subjectUpdater, subjectRemover, subjectShow, courseAdder, courseRemover, courseUpdater, courseShow }) => {

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
                    courseShow={courseShow} />
            ))}
        </div>
    )
}

export default Subjects