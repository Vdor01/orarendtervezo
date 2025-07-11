import { useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import huLocale from '@fullcalendar/core/locales/hu';
import Subjects from './Subjects';
import Menu from './Menu';
import Footer from './Footer';

/**
 * The main application component that manages the calendar and subjects.
 * 
 * @returns {JSX.Element} The main application component that renders the calendar and subjects.
 */
function App() {

    const [eventsJSON, setEventsJSON] = useState([])

    const [settings, setSettings] = useState({
        "show": {
            "code": false,
            "time": true,
            "type": false,
            "instructor": true,
            "location": true,
            "notes": false
        },
        "saturday": false,
        "slot": 20
    })

    useMemo(() => {
        const savedEvents = localStorage.getItem('eventsJSON');
        if (savedEvents) {
            setEventsJSON(JSON.parse(savedEvents));
        }

        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    useMemo(() => {
        localStorage.setItem('eventsJSON', JSON.stringify(eventsJSON));

        localStorage.setItem('settings', JSON.stringify(settings));
    }, [eventsJSON, settings]);

    /**
     * Gives a new subject ID based on the last subject ID in the eventsJSON array.
     * If the array is empty, it returns 1.
     * 
     * @returns {number} The new subject ID.
     */
    function getNewSubjectId() {
        if (eventsJSON.length === 0) return 1;
        return eventsJSON[eventsJSON.length - 1].id + 1;
    }

    /**
     * Gives a new course ID based on the last course ID in the subject's courses array.
     * If the courses array is empty, it returns 1.
     * 
     * @param {Object} subject - The subject object containing the courses array.
     * @returns {number} The new course ID.
     */
    function getNewCourseId(subject) {
        if (subject.courses.length === 0) return 1;
        return subject.courses[subject.courses.length - 1].id + 1;
    }

    /**
     * Adds a new subject to the eventsJSON state.
     * The new subject is initialized with a unique ID, code, name, empty courses array,
     * and a status object with a random color and default choices.
     * 
     * @param {string} code - The code of the subject.
     * @param {string} name - The name of the subject.
     */
    function addSubject(code, name) {
        setEventsJSON(prevEvents => [
            ...prevEvents,
            {
                "id": getNewSubjectId(),
                "code": code,
                "name": name,
                "courses": [],
                "status": {
                    "color": getRandomHexColor(),
                    "show": true,
                    "choosen": {
                        "Gyakorlat": 0,
                        "Előadás": 0,
                        "Egyéb": 0
                    }
                }
            }
        ])
    }

    /** 
     * Removes a subject from the eventsJSON state by filtering out the subject with the given ID.
     * 
     * @param {number} id - The ID of the subject to be removed.
     */
    function removeSubject(id) {
        setEventsJSON(prevEvents => prevEvents.filter(event => event.id !== id));
    }

    /**
     * Updates a subject's code, name, color, and type in the eventsJSON state.
     * The type determines how the choosen status is set.
     * 
     * @param {number} id - The ID of the subject to be updated.
     * @param {string} newCode - The new code for the subject.
     * @param {string} newName - The new name for the subject.
     * @param {string} newColor - The new color for the subject's status.
     * @param {string} type - The type of the subject (e.g., 'Egy kurzus', 'Minden kurzus ki van választva', 'Típusunként egy kurzus').
     */
    function updateSubject(id, newCode, newName, newColor, type) {

        function typeInsert() {
            switch (type) {
                case 'Egy kurzus': return 0;
                case 'Minden kurzus ki van választva': return -1;
                case 'Típusunként egy kurzus': return { "Gyakorlat": 0, "Előadás": 0, "Egyéb": 0 };
            }
        }

        const updatedEvents = eventsJSON.map(event =>
            event.id === id ? { ...event, code: newCode, name: newName, status: { ...event.status, color: newColor, choosen: typeInsert() } } : event
        );
        setEventsJSON(updatedEvents);
    }

    /**
     * Updates the visibility of a subject in the eventsJSON state.
     * 
     * @param {number} id - The ID of the subject to be updated.
     * @param {boolean} show - The new visibility status of the subject.
     */
    function updateShowSubject(id, show) {
        const updatedEvents = eventsJSON.map(event =>
            event.id === id ? { ...event, status: { ...event.status, show: show } } : event
        );
        setEventsJSON(updatedEvents);
    }

    /**
     * Gets the date of the next occurrence of a specific day of the week (e.g., 'Hétfő', 'Kedd').
     * 
     * @param {string} dayName - The name of the day of the week.
     * @returns {Date} The date of the next occurrence of the specified day.
     */
    function getDateOfThisWeeksDay(dayName) {
        const daysOfWeek = {
            'Hétfő': 1,
            'Kedd': 2,
            'Szerda': 3,
            'Csütörtök': 4,
            'Péntek': 5,
            'Szombat': 6,
            'Vasárnap': 0
        };

        const today = new Date();
        const dayIndex = daysOfWeek[dayName];
        const currentDayIndex = today.getDay() === 0 ? 7 : today.getDay(); // Adjust for Sunday being 0
        const diff = dayIndex - currentDayIndex;

        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);

        return targetDate;
    }

    let events = eventsJSON.flatMap(subject => setCourses(subject));

    /**
     * Checks if a course should be displayed based on the subject's status and the course's properties.
     * 
     * @param {Object} subject - The subject object containing the status and courses.
     * @param {Object} course - The course object to check for display conditions.
     * @returns {boolean} True if the course should be displayed, false otherwise.
     */
    function isDisplayed(subject, course) {
        if (typeof subject.status.choosen === 'object') {
            if (subject.status.choosen[course.type] === 0 && course.show !== false) return true;
            if (subject.status.choosen[course.type] === course.course && course.show !== false) return true;
        }
        if (subject.status.choosen === -1) return true;
        if ((subject.status.choosen === course.course || subject.status.choosen === 0) && course.show !== false) return true;
    }

    /**
     * Checks if a course is chosen based on the subject's status and the course's properties.
     * 
     * @param {Object} subject - The subject object containing the status and courses.
     * @param {Object} course - The course object to check for chosen status.
     * @returns {boolean} True if the course is chosen, false otherwise.
     */
    function isChoosen(subject, course) {
        if (typeof subject.status.choosen === 'object') {
            if (subject.status.choosen[course.type] === course.course) return true;
            if (subject.status.choosen[course.type] !== course.course) return false;
            return false;
        }

        if (subject.status.choosen === course.course) return true;
        if (subject.status.choosen == -1) return true;
        return false;
    }

    /**
     * Sets the courses for a subject, transforming each course into an event object.
     * 
     * @param {Object} subject - The subject object containing the courses.
     * @returns {Array} An array of event objects representing the courses.
     */
    function setCourses(subject) {
        if (!subject.status.show) return [];
        return subject.courses.map(course => ({
            title: subject.name,
            start: getDateOfThisWeeksDay(course.day).toISOString().split('T')[0] + 'T' + course.startTime + ':00',
            end: getDateOfThisWeeksDay(course.day).toISOString().split('T')[0] + 'T' + course.endTime + ':00',
            borderColor: subject.status.color,
            backgroundColor: isChoosen(subject, course) ? subject.status.color : '#000000',
            display: isDisplayed(subject, course) ? '' : 'none',
            classNames: ['cursor-pointer', (course.type === 'Előadás') ? 'border-dashed' : ''],
            extendedProps: {
                subjectId: subject.id,
                instructor: course.instructor,
                location: course.location,
                course: course.course,
                type: course.type,
                notes: course.notes,
            }
        }))
    }

    /**
     * Sets the chosen course for a subject based on the subject ID, course ID, and type.
     * If the subject's status.choosen is an object, it updates the specific type.
     * If the subject's status.choosen is not an object, it toggles the course ID.
     * If the course ID is already chosen, it sets it to 0 (unchoosen).
     * 
     * @param {number} subjectId - The ID of the subject.
     * @param {number} courseId - The ID of the course to be chosen.
     * @param {string} type - The type of the course (e.g., 'Gyakorlat', 'Előadás', 'Egyéb').
     */
    function setChoosenCourse(subjectId, courseId, type) {
        const subject = eventsJSON.find(event => event.id === subjectId);
        if (typeof subject.status.choosen === 'object') {
            const updatedEvents = eventsJSON.map(event =>
                event.id === subjectId ? { ...event, status: { ...event.status, choosen: { ...event.status.choosen, [type]: event.status.choosen[type] === courseId ? 0 : courseId } } } : event
            );
            setEventsJSON(updatedEvents);
        } else if (subject.status.choosen !== -1) {

            const updatedEvents = eventsJSON.map(event =>
                event.id === subjectId ? { ...event, status: { ...event.status, choosen: event.status.choosen === courseId ? 0 : courseId } } : event
            );
            setEventsJSON(updatedEvents);
        }
    }

    /**
     * Adds a new course to a subject's courses array in the eventsJSON state.
     * The new course is initialized with a unique ID, code, type, instructor, location, day, start time, end time, notes, and a show property set to true.
     * 
     * @param {number} subjectId - The ID of the subject to which the course will be added.
     * @param {string} code - The code of the course.
     * @param {string} type - The type of the course (e.g., 'Gyakorlat', 'Előadás', 'Egyéb').
     * @param {string} instructor - The instructor of the course.
     * @param {string} location - The location of the course.
     * @param {string} day - The day of the week when the course occurs (e.g., 'Hétfő').
     * @param {string} startTime - The start time of the course in HH:mm format.
     * @param {string} endTime - The end time of the course in HH:mm format.
     * @param {string} notes - Additional notes for the course.
     */
    function addCourse(subjectId, code, type, instructor, location, day, startTime, endTime, notes) {
        const updatedEvents = eventsJSON.map(event =>
            event.id === subjectId ? {
                ...event, courses: [
                    ...event.courses,
                    {
                        "id": getNewCourseId(event),
                        "course": code,
                        "type": type,
                        "instructor": instructor,
                        "location": location,
                        "day": day,
                        "startTime": startTime,
                        "endTime": endTime,
                        "notes": notes,
                        "show": true
                    }
                ]
            } : event
        );
        setEventsJSON(updatedEvents);
    }

    /**
     * Removes a course from a subject's courses array in the eventsJSON state.
     * It filters out the course with the specified courseId from the courses array of the subject with the specified subjectId.
     * 
     * @param {number} subjectId - The ID of the subject from which the course will be removed.
     * @param {number} courseId - The ID of the course to be removed.
     */
    function removeCourse(subjectId, courseId) {
        const updatedEvents = eventsJSON.map(event =>
            event.id === subjectId ? { ...event, courses: event.courses.filter(course => course.id !== courseId) } : event
        );
        setEventsJSON(updatedEvents);
    }

    /**
     * Updates a course's properties in a subject's courses array in the eventsJSON state.
     * It finds the course with the specified courseId and updates its properties such as code, type, instructor, location, day, start time, end time, and notes.
     *
     * @param {number} subjectId - The ID of the subject containing the course to be updated.
     * @param {number} courseId - The ID of the course to be updated.
     * @param {string} code - The new code for the course.
     * @param {string} type - The new type for the course (e.g., 'Gyakorlat', 'Előadás', 'Egyéb').
     * @param {string} instructor - The new instructor for the course.
     * @param {string} location - The new location for the course.
     * @param {string} day - The new day of the week for the course (e.g., 'Hétfő').
     * @param {string} startTime - The new start time for the course in HH:mm format.
     * @param {string} endTime - The new end time for the course in HH:mm format.
     * @param {string} notes - The new notes for the course.
     */
    function updateCourse(subjectId, courseId, code, type, instructor, location, day, startTime, endTime, notes) {
        const updatedEvents = eventsJSON.map(event =>
            event.id === subjectId ? {
                ...event, courses: event.courses.map(course =>
                    course.id === courseId ? {
                        ...course,
                        course: code,
                        type: type,
                        instructor: instructor,
                        location: location,
                        day: day,
                        startTime: startTime,
                        endTime: endTime,
                        notes: notes
                    } : course
                )
            } : event
        );
        setEventsJSON(updatedEvents);
    }

    /**
     * Updates the visibility of a course in a subject's courses array in the eventsJSON state.
     * It finds the course with the specified courseId and updates its show property to the specified value.
     * 
     * @param {number} subjectId - The ID of the subject containing the course to be updated.
     * @param {number} courseId - The ID of the course to be updated.
     * @param {boolean} show - The new visibility status for the course (true for visible, false for hidden).
     */
    function updateShowCourse(subjectId, courseId, show) {
        const updatedEvents = eventsJSON.map(event =>
            event.id === subjectId ? {
                ...event, courses: event.courses.map(course =>
                    course.id === courseId ? { ...course, show: show } : course
                )
            } : event
        );
        setEventsJSON(updatedEvents);
    }

    /**
     * Updates the settings state based on the type and event.
     * If type is 'show', it updates the show settings for the specified event.
     * Otherwise, it updates the general settings for the specified event.
     * 
     * @param {string} type - The type of settings to update ('show' or general).
     * @param {string} event - The specific setting to update (e.g., 'code', 'time').
     * @param {boolean} value - The new value for the specified setting.
     */
    function updateSettings(type, event, value) {
        if (type === 'show') {
            setSettings({
                ...settings,
                "show": {
                    ...settings.show,
                    [event]: value
                },
            })
        } else {
            setSettings({
                ...settings,
                [event]: value
            })
        }
    }

    /**
     * Generates a random hex color code.
     * 
     * @returns {string} A random hex color code in the format '#RRGGBB'.
     */
    function getRandomHexColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    /**
     * Handles the click event on a calendar event.
     * It sets the chosen course for the clicked event based on its extended properties.
     * 
     * @param {Object} info - The event information object containing the clicked event's details.
     */
    function onEventClick(info) {
        setChoosenCourse(info.event.extendedProps.subjectId, info.event.extendedProps.course, info.event.extendedProps.type);
    }

    /**
     * Imports subjects and courses from arrays into the eventsJSON state.
     * It checks for existing subjects to avoid duplicates, assigns new IDs, and organizes courses under their respective subjects.
     * 
     * @param {Array} subjects - An array of subject objects to be imported.
     * @param {Array} courses - An array of course objects to be imported.
     */
    function importFromArrays(subjects, courses) {
        setEventsJSON(prevEvents => {
            const existingSubjectCodes = prevEvents.map(subject => subject.code);
            let nextSubjectId = prevEvents.length > 0 ? Math.max(...prevEvents.map(s => s.id)) + 1 : 1;

            const newSubjects = subjects
                .filter(subject => !existingSubjectCodes.includes(subject.code))
                .map(subject => {
                    const relevantCourses = courses.filter(course => course.subject === subject.code);

                    let nextCourseId = 1;
                    const courseArr = relevantCourses.map(course => ({
                        id: nextCourseId++,
                        course: course.course,
                        type: course.type,
                        instructor: course.instructor,
                        location: course.location,
                        day: course.day,
                        startTime: course.startTime,
                        endTime: course.endTime,
                        notes: course.notes,
                        show: true
                    }));

                    return {
                        id: nextSubjectId++,
                        code: subject.code,
                        name: subject.name,
                        courses: courseArr,
                        status: {
                            color: getRandomHexColor(),
                            show: true,
                            choosen: {
                                "Gyakorlat": 0,
                                "Előadás": 0,
                                "Egyéb": 0
                            }
                        }
                    };
                });

            return [...prevEvents, ...newSubjects];
        });
    }

    /**
     * Checks if a color is dark based on its hex value.
     * It calculates the perceived brightness using the relative luminance formula and returns true if the color is dark.
     * 
     * @param {string} hexColor - The hex color code (e.g., '#RRGGBB').
     * @returns {boolean} True if the color is dark, false otherwise.
     */
    function isColorDark(hexColor) {
        hexColor = hexColor.replace('#', '');

        const r = parseInt(hexColor.substr(0, 2), 16);
        const g = parseInt(hexColor.substr(2, 2), 16);
        const b = parseInt(hexColor.substr(4, 2), 16);

        const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

        return brightness < 128;
    }

    return (
        <>
            <div className='flex flex-col gap-5 m-8 w-fit'>
                <Menu adder={addSubject} events={eventsJSON} setter={setEventsJSON} settings={settings} setSettings={updateSettings} importer={importFromArrays} />
                <div className='w-full'>
                    <Subjects
                        subjects={eventsJSON}
                        subjectRemover={removeSubject}
                        subjectUpdater={updateSubject}
                        subjectShow={updateShowSubject}
                        courseAdder={addCourse}
                        courseRemover={removeCourse}
                        courseUpdater={updateCourse}
                        courseShow={updateShowCourse}
                        settings={settings}
                        setter={setChoosenCourse} />
                </div>
                <div className='h-0 divider'></div>
                <FullCalendar
                    plugins={[timeGridPlugin, momentTimezonePlugin]}
                    initialView="timeGridWeek"
                    hiddenDays={settings.saturday ? [0] : [0, 6]}
                    events={events}
                    slotMinTime={'08:00:00'}
                    slotMaxTime={'22:00:00'}
                    slotLabelFormat={{
                        hour: 'numeric',
                        minute: '2-digit',
                    }}
                    slotDuration={'00:' + settings.slot + ':00'}
                    height={'auto'}
                    headerToolbar={false}
                    stickyHeaderDates={false}
                    allDaySlot={false}
                    dayHeaderFormat={{ weekday: 'long' }}
                    locale={huLocale}
                    timeZone='Europe/Budapest'
                    firstDay={1}
                    eventClick={onEventClick}
                    eventContent={(arg) => {
                        const backgroundColor = arg.event.backgroundColor;
                        const textColor = isColorDark(backgroundColor) ? '#FFFFFF' : '#000000';

                        return (
                            <div className='flex flex-col gap-1' style={{ color: textColor }}>
                                {settings.show.code && <div>{arg.event.extendedProps.course}</div>}
                                {settings.show.time && <div>{arg.timeText}</div>}
                                {settings.show.type && <div>{arg.event.extendedProps.type}</div>}
                                {settings.show.instructor && <div>{arg.event.extendedProps.instructor}</div>}
                                {settings.show.location && <div>{arg.event.extendedProps.location}</div>}
                                {settings.show.notes && <div>{arg.event.extendedProps.notes}</div>}
                            </div>
                        );
                    }}
                />
            </div>
            <Footer />
        </>
    )
}

export default App
