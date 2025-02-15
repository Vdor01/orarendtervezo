import React from 'react'

const Courses = ({ subjectId, choosen, course, remover, updater, show: showF }) => {

    let show = course.show;

    function handleChange() {
        show = !show
        showF(subjectId, course.id, show)
    }

    return (
        <tr className={course.course === choosen ? 'border-success border-2 rounded-lg' : ''}>
            <th>{course.course}</th>
            <td>{course.type}</td>
            <td>{course.instructor}</td>
            <td>{course.location}</td>
            <td>{course.day}</td>
            <td>{course.startTime}-{course.endTime}</td>
            <td>{course.notes}</td>
            <td className='flex justify-end gap-2'>
                <label className="btn btn-circle swap swap-rotate">
                    <input type="checkbox" onChange={handleChange} />

                    <div className="swap-on pi pi-eye-slash text-error" style={{ fontSize: '1.5rem' }}></div>
                    <div className="swap-off pi pi-eye" style={{ fontSize: '1.5rem' }}></div>
                </label>
                <button className="btn btn-circle btn-info" onClick={() => document.getElementById("course_modal_" + subjectId + "_" + course.id).showModal()}>
                    <i className="pi pi-pen-to-square" style={{ fontSize: '1.5rem' }}></i>
                </button>
                <button className="btn btn-circle btn-error" onClick={() => remover(subjectId, course.id)}>
                    <i className="pi pi-trash" style={{ fontSize: '1.5rem' }}></i>
                </button>
            </td>
        </tr>
    )
}

export default Courses