import { useTimetable } from './contexts'

/**
 * Courses component displays a list of courses for a specific subject.
 * It allows users to choose a course, toggle its visibility, and remove it.
 * Uses Context API to access timetable functions.
 * 
 * @param {number} subjectId - The ID of the subject to which the courses belong.
 * @param {string|object} choosen - The currently selected course or an object containing the type of the chosen course.
 * @param {object} course - The course object containing details like course name, type, instructor, location, day, start time, end time, and notes.
 * @param {string} type - The type of the course (e.g., 'lecture', 'lab').
 * 
 * @returns {JSX.Element} A table row containing course details and action buttons.
 */
const Courses = ({ subjectId, choosen, course, type }) => {
    const { removeCourse, updateShowCourse, setChoosenCourse } = useTimetable();

    let show = course.show;

    /**
     * Handles the change event for toggling course visibility.
     */
    function handleChange() {
        show = !show
        updateShowCourse(subjectId, course.id, show)
    }

    /**
     * Checks if the current course is the one chosen by the user.
     * Handles both single-course selection and type-based selection modes.
     * 
     * @returns {boolean} True if the course is chosen, false otherwise.
     */
    function isChoosen() {
        // Type-based selection: check if this course is selected for its type
        if (typeof choosen === 'object') {
            return choosen[type] === course.course // Compare course code with selected course for this type
        }
        // Single course selection: direct comparison with chosen course
        else if (choosen === course.course) {
            return true
        }
        // Default: not chosen
        return false;
    }

    /**
     * Sets the course as the chosen course for the subject.
     */
    function setCourse() {
        setChoosenCourse(subjectId, course.course, course.type)
    }

    return (
        <tr className={isChoosen() ? 'ring-4 ring-success ring-inset' : ''}>
            <th>{course.course}</th>
            <td>{course.type}</td>
            <td>{course.instructor}</td>
            <td>{course.location}</td>
            <td>{course.day}</td>
            <td>{course.startTime}-{course.endTime}</td>
            <td>{course.notes}</td>
            <th className='flex justify-end gap-2'>
                <label className={`btn btn-circle swap swap-rotate ${isChoosen() ? 'btn-success' : 'btn-neutral'}`} title={isChoosen() ? 'Ejtés' : 'Kiválasztás'}>
                    <input type="checkbox" onChange={() => setCourse()} checked={isChoosen()} />

                    <div className="swap-on pi pi-times" style={{ fontSize: '1.5rem' }}></div>
                    <div className="swap-off pi pi-check" style={{ fontSize: '1.5rem' }}></div>
                </label>
                <label className="btn btn-circle swap swap-rotate" title={show ? 'Elrejtés' : 'Mutatás'}>
                    <input type="checkbox" onChange={handleChange} checked={!show} />

                    <div className="swap-on pi pi-eye-slash text-error" style={{ fontSize: '1.5rem' }}></div>
                    <div className="swap-off pi pi-eye" style={{ fontSize: '1.5rem' }}></div>
                </label>
                <button className="btn btn-circle btn-warning" onClick={() => document.getElementById("course_modal_" + subjectId + "_" + course.id).showModal()} title='Szerkesztés'>
                    <i className="pi pi-pen-to-square" style={{ fontSize: '1.5rem' }}></i>
                </button>
                <button className="btn btn-circle btn-error" onClick={() => removeCourse(subjectId, course.id)} title='Törlés'>
                    <i className="pi pi-trash" style={{ fontSize: '1.5rem' }}></i>
                </button>
            </th>
        </tr>
    )
}

export default Courses