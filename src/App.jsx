import { useEffect, useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import huLocale from '@fullcalendar/core/locales/hu';
import './App.css'
import SubjectAdder from './SubjectAdder';
import Subjects from './Subjects';
import './assets/default.json';
import Menu from './Menu';

function App() {

    const [eventsJSON, setEventsJSON] = useState([
        {
            "id": 1,
            "code": "IP-18eKPROGEG",
            "name": "Konkurens programozás Ea+Gy",
            "courses": [
                {
                    "id": 1,
                    "course": 5,
                    "type": "Gyakorlat",
                    "instructor": "Kovács Norbert",
                    "location": "Déli Tömb 2-709 (PC 9)",
                    "day": "Péntek",
                    "startTime": "12:00",
                    "endTime": "13:00",
                    "notes": "",
                    "show": true
                }
            ],
            "status": {
                "color": "#0E2F90",
                "show": true,
                "choosen": 0
            }
        },
        {
            "id": 2,
            "code": "IP-18cSZTEG",
            "name": "Szoftvertechnológia Ea+GY (F)",
            "courses": [
                {
                    "id": 1,
                    "course": 10,
                    "type": "Előadás",
                    "instructor": "Nemes László",
                    "location": "Északi Tömb 7.15 (PC11)",
                    "day": "Péntek",
                    "startTime": "10:00",
                    "endTime": "12:00",
                    "notes": "",
                    "show": true
                },
                {
                    "id": 2,
                    "course": 11,
                    "type": "Gyakorlat",
                    "instructor": "Nemes László",
                    "location": "Északi Tömb 7.15 (PC11)",
                    "day": "Csütörtök",
                    "startTime": "10:00",
                    "endTime": "12:00",
                    "notes": "",
                    "show": true
                },
                {
                    "id": 3,
                    "course": 12,
                    "type": "Gyakorlat",
                    "instructor": "Nemes László",
                    "location": "Északi Tömb 7.15 (PC11)",
                    "day": "Szerda",
                    "startTime": "08:00",
                    "endTime": "10:00",
                    "notes": "",
                    "show": true
                }
            ],
            "status": {
                "color": "#C31313",
                "show": true,
                "choosen": {
                    "Gyakorlat": 0,
                    "Előadás": 0,
                    "Egyéb": 0
                }
            }
        }
    ])

    // useMemo(() => {
    //     const savedEvents = localStorage.getItem('eventsJSON');
    //     if (savedEvents) {
    //         setEventsJSON(JSON.parse(savedEvents));
    //         console.log('Loaded events from local storage');
    //     }
    // }, []);

    // useMemo(() => {
    //     localStorage.setItem('eventsJSON', JSON.stringify(eventsJSON));
    //     console.log('Saved events to local storage');
    // }, [eventsJSON]);

    function getNewSubjectId() {
        if (eventsJSON.length === 0) return 1;
        return eventsJSON[eventsJSON.length - 1].id + 1;
    }

    function getNewCourseId(subject) {
        if (subject.courses.length === 0) return 1;
        return subject.courses[subject.courses.length - 1].id + 1;
    }

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
                    "choosen": 0
                }
            }
        ])
    }

    function removeSubject(id) {
        setEventsJSON(prevEvents => prevEvents.filter(event => event.id !== id));
    }

    function updateSubject(id, newCode, newName, newColor) {
        const updatedEvents = eventsJSON.map(event =>
            event.id === id ? { ...event, code: newCode, name: newName, status: { ...event.status, color: newColor } } : event
        );
        console.log(updatedEvents); // Log the updated events
        setEventsJSON(updatedEvents);
    }

    function updateShowSubject(id, show) {
        const updatedEvents = eventsJSON.map(event =>
            event.id === id ? { ...event, status: { ...event.status, show: show } } : event
        );
        console.log(updatedEvents); // Log the updated events
        setEventsJSON(updatedEvents);
    }

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
        const currentDayIndex = (today.getDay() + 6) % 7;
        const diff = dayIndex - currentDayIndex;

        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);

        return targetDate;
    }

    let events = eventsJSON.flatMap(subject => setCourses(subject));

    function isDisplayed(subject, course) {
        if (typeof subject.status.choosen === 'object') {
            if (subject.status.choosen[course.type] === 0) return true;
            if (subject.status.choosen[course.type] === course.course) return true;
        }
        if (subject.status.choosen === -1) return true;
        if ((subject.status.choosen === course.course || subject.status.choosen === 0) && course.show !== false) return true;
    }

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
                type: course.type
            }
        }))
    }

    function setChoosenCourse(subjectId, courseId, type) {
        const subject = eventsJSON.find(event => event.id === subjectId);
        if (typeof subject.status.choosen === 'object') {
            const updatedEvents = eventsJSON.map(event =>
                event.id === subjectId ? { ...event, status: { ...event.status, choosen: { ...event.status.choosen, [type]: event.status.choosen[type] === courseId ? 0 : courseId } } } : event
            );
            console.log(updatedEvents); // Log the updated events
            setEventsJSON(updatedEvents);
        } else if (subject.status.choosen !== -1) {

            const updatedEvents = eventsJSON.map(event =>
                event.id === subjectId ? { ...event, status: { ...event.status, choosen: event.status.choosen === courseId ? 0 : courseId } } : event
            );
            console.log(updatedEvents); // Log the updated events
            setEventsJSON(updatedEvents);
        }
    }

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
        console.log(updatedEvents); // Log the updated events
        setEventsJSON(updatedEvents);
    }

    function removeCourse(subjectId, courseId) {
        const updatedEvents = eventsJSON.map(event =>
            event.id === subjectId ? { ...event, courses: event.courses.filter(course => course.id !== courseId) } : event
        );
        console.log(updatedEvents); // Log the updated events
        setEventsJSON(updatedEvents);
    }

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
        console.log(updatedEvents); // Log the updated events
        setEventsJSON(updatedEvents);
    }

    function updateShowCourse(subjectId, courseId, show) {
        const updatedEvents = eventsJSON.map(event =>
            event.id === subjectId ? {
                ...event, courses: event.courses.map(course =>
                    course.id === courseId ? { ...course, show: show } : course
                )
            } : event
        );
        console.log(updatedEvents); // Log the updated events
        setEventsJSON(updatedEvents);
    }

    function getRandomHexColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function onEventClick(info) {
        setChoosenCourse(info.event.extendedProps.subjectId, info.event.extendedProps.course, info.event.extendedProps.type);
        console.log(info.event.title, info.event.extendedProps.course)
    }

    return (
        <div className='flex flex-col w-full gap-5'>
            <Menu adder={addSubject} events={eventsJSON} setter={setEventsJSON} />
            <div className='w-full'>
                <Subjects
                    subjects={eventsJSON}
                    subjectRemover={removeSubject}
                    subjectUpdater={updateSubject}
                    subjectShow={updateShowSubject}
                    courseAdder={addCourse}
                    courseRemover={removeCourse}
                    courseUpdater={updateCourse}
                    courseShow={updateShowCourse} />
            </div>
            <FullCalendar
                plugins={[timeGridPlugin, momentTimezonePlugin]}
                initialView="timeGridWeek"
                weekends={false}
                events={events}
                slotMinTime={'08:00:00'}
                slotMaxTime={'22:00:00'}
                slotLabelFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                }}
                slotDuration={'00:20:00'}
                height={'auto'}
                headerToolbar={false}
                stickyHeaderDates={false}
                allDaySlot={false}
                dayHeaderFormat={{ weekday: 'long' }}
                locale={huLocale}
                timeZone='Europe/Budapest'
                eventClick={onEventClick}
                eventContent={(arg) => (
                    <div className='flex flex-col gap-1'>
                        <div>{arg.timeText}</div>
                        <div>{arg.event.extendedProps.instructor}</div>
                        <div>{arg.event.extendedProps.location}</div>
                    </div>
                )}
            />
        </div>
    )
}

export default App
