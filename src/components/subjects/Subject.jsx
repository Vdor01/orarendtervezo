import { useState } from 'react';
import 'primeicons/primeicons.css';
import SubjectModal from './SubjectModal';
import CourseModal from './CourseModal';
import { useTimetable, useSettings } from '../../contexts';
import CourseAdder from './CourseAdder';
import CourseTable from './CourseTable';
import SubjectTimetable from '../timetable/SubjectTimetable';

/**
 * Subject component represents a single subject with its courses.
 * It includes functionality to update, remove, and show/hide the subject and its courses.
 * Uses Context API to access all timetable and settings functions.
 * 
 * @param {Object} subject - The subject object containing details like code, name, courses, and status.
 * @returns {JSX.Element} A div element containing the subject details and its courses.
 */
const Subject = ({ subject }) => {
    const { removeSubject, updateShowSubject, refreshSubjectCourses } = useTimetable();
    const [isOpen, setIsOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { settings } = useSettings();

    const { id, code, name } = subject;
    let { show } = subject.status;

    /**
     * Refreshes the subject's courses by fetching the latest data from the server.
     * Shows a loading state while refreshing.
     */
    async function updateButton() {
        setIsRefreshing(true);
        try {
            await refreshSubjectCourses(id);
        } catch (error) {
            console.error('Failed to refresh courses:', error);
        } finally {
            setIsRefreshing(false);
        }
    }

    /**
     * Updates the subject modal to allow editing of the subject details.
     * 
     * @param {Object} subject - The subject object containing details like code and name.
     */
    function editButton(subject) {
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
     * Returns CSS classes to visually indicate completion status:
     * - bg-success: All courses selected (fully completed)
     * - bg-info: Partially completed (some courses selected)
     * - Empty string: No courses selected
     * 
     * @returns {string} A string representing the CSS class for the subject status.
     */
    function getStatus() {
        // For subjects with "type-based" course selection (object-type choosen)
        if (typeof subject.status.choosen === 'object') {
            const courseTypes = subject.courses.map(course => course.type);
            const types = [...new Set(courseTypes)]; // Get unique course types (Gyakorlat, Előadás, Egyéb)

            let choosen = 0; // Counter for selected course types
            types.forEach(type => {
                // Count non-zero selections (0 means no course selected for this type)
                if (subject.status.choosen[type] !== 0) { choosen++; }
            });

            // All course types have selections - fully completed (green)
            if (choosen === types.length) {
                return 'bg-success text-base-300';
            }
            // Some course types have selections - partially completed (blue)
            else if (choosen > 0) {
                return 'bg-info text-base-300';
            }
        }
        // For subjects with single course selection (non-zero means selected)
        else if (subject.status.choosen !== 0) {
            return 'bg-success text-base-300'; // Course selected - completed (green)
        }

        // No courses selected - default appearance
        return '';
    }

    /**
     * Determines the icon to display based on the subject's course selection mode.
     * Icons represent different selection strategies:
     * - 'list': Multiple course types can be selected independently
     * - 'check-circle': Single course selection mode
     * - 'lock': All courses are automatically selected (locked mode)
     * 
     * @return {string} A string representing the PrimeIcons icon class for the subject status.
     */
    function getIcon() {
        // Object-type choosen = "Type-based selection" (Gyakorlat, Előadás, etc.)
        if (typeof subject.status.choosen === 'object') {
            return 'list'; // List icon for multiple independent selections
        }
        // Non-negative number = "Single course selection" or "No selection"
        else if (subject.status.choosen >= 0) {
            return 'check-circle'; // Check circle for single course mode
        }
        // Negative number (-1) = "All courses selected" mode
        else {
            return 'lock'; // Lock icon indicates all courses are automatically selected
        }
    }

    return (
        <div className='flex items-center justify-between gap-3'>
            <div className="collapse bg-base-200 collapse-arrow shrink">
                <input type="checkbox" onClick={() => setIsOpen(!isOpen)} />
                <div className={"flex justify-between items-center collapse-title after:start-5 after:top-8 pe-4 ps-12 " + getStatus()}>
                    <div className='flex items-center w-full gap-3 text-xl font-medium'>
                        <span className="w-6 h-6 px-3 btn-circle" style={{ backgroundColor: subject.status.color }}></span>
                        <i className={'pi pi-' + getIcon()}></i>
                        <span className="w-2/12 min-w-fit">{code}</span>
                        <span className='pl-3'>{name}</span>
                    </div>
                    <div className={`flex  gap-2 mt-1 z-10 group`}>
                        <label className={`btn btn-circle swap swap-rotate`} title={show ? 'Elrejtés' : 'Mutatás'}>
                            <input type="checkbox" onChange={handleChange} checked={!show} />

                            <div className="swap-on pi pi-eye-slash text-error" style={{ fontSize: '1.5rem' }}></div>
                            <div className="swap-off pi pi-eye" style={{ fontSize: '1.5rem' }}></div>
                        </label>
                        <button className="btn btn-circle btn-info" onClick={() => updateButton(subject)} title='Frissítés' disabled={isRefreshing}>
                            <i className={`${isRefreshing ? 'loading' : 'pi pi-sync'}`} style={{ fontSize: '1.5rem' }}></i>
                        </button>
                        <button className={`btn btn-circle btn-warning`} onClick={() => editButton(subject)} title='Szerkesztés'>
                            <i className="pi pi-pen-to-square" style={{ fontSize: '1.5rem' }}></i>
                        </button>
                        <button className={`btn btn-circle btn-error`} onClick={() => removeSubject(id)} title='Törlés'>
                            <i className="pi pi-trash" style={{ fontSize: '1.5rem' }}></i>
                        </button>
                    </div>
                </div>
                <div className="overflow-auto collapse-content">
                    <div>
                        {(settings.subjectView === 'list' || settings.subjectView == null) && <CourseTable subject={subject} />}
                        {settings.subjectView === 'timetable' && <SubjectTimetable subject={subject} />}
                        <CourseAdder subject={subject} />
                    </div>
                </div>
            </div>
            <SubjectModal subject={subject} />
            {subject.courses.map((course) => (
                <CourseModal key={course.id} subject={subject} course_id={course.id} />
            ))}
        </div>
    );
};

export default Subject;
