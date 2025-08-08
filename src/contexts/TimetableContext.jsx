import React, { createContext, useContext, useState, useMemo, createRef } from 'react';

const TimetableContext = createContext();

export const useTimetable = () => {
    const context = useContext(TimetableContext);
    if (!context) {
        throw new Error('useTimetable must be used within a TimetableProvider');
    }
    return context;
};

export const TimetableProvider = ({ children }) => {
    const [eventsJSON, setEventsJSON] = useState([]);
    const timetableRef = createRef();

    // Initialize from localStorage
    useMemo(() => {
        const savedEvents = localStorage.getItem('eventsJSON');
        if (savedEvents) {
            setEventsJSON(JSON.parse(savedEvents));
        }
    }, []);

    // Save to localStorage whenever eventsJSON changes
    useMemo(() => {
        localStorage.setItem('eventsJSON', JSON.stringify(eventsJSON));
    }, [eventsJSON]);

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
        ]);
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

    const value = {
        eventsJSON,
        setEventsJSON,
        timetableRef,
        addSubject,
        removeSubject,
        updateSubject,
        updateShowSubject,
        addCourse,
        removeCourse,
        updateCourse,
        updateShowCourse,
        setChoosenCourse,
        importFromArrays,
    };

    return (
        <TimetableContext.Provider value={value}>
            {children}
        </TimetableContext.Provider>
    );
};
