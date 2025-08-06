import React from 'react'
import { exportTimetableWithCanvas } from './CanvasExport'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import huLocale from '@fullcalendar/core/locales/hu';
import Subjects from './Subjects';
import Menu from './Menu';
import Footer from './Footer';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { AppProviders, useTimetable, useSettings } from './contexts';

/**
 * The main timetable component that handles calendar display and event interaction.
 * 
 * @returns {JSX.Element} The calendar and related UI components.
 */
function TimetableApp() {
    const { eventsJSON, timetableRef, setChoosenCourse } = useTimetable();
    const { settings } = useSettings();

    /**
     * Exports the timetable as a PNG image using different export methods.
     */
    async function exportTimetableAsPNGHandler() {
        try {
            console.log("Export handler called");

            const calendarElement = timetableRef.current?.elRef?.current?.querySelector('.fc') ||
                timetableRef.current?.el?.querySelector('.fc') ||
                timetableRef.current?.querySelector?.('.fc') ||
                document.querySelector('.fc');

            if (calendarElement) {
                console.log("Exporting with Canvas...");
                await exportTimetableWithCanvas(calendarElement);
                console.log("Canvas export completed");
            } else {
                console.error("Calendar element not found for Canvas export");
                console.log("Available elements with fc class:", document.querySelectorAll('.fc'));
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed: ' + error.message);
        }
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
     * Handles the click event on a calendar event.
     * It sets the chosen course for the clicked event based on its extended properties.
     * 
     * @param {Object} info - The event information object containing the clicked event's details.
     */
    function onEventClick(info) {
        setChoosenCourse(info.event.extendedProps.subjectId, info.event.extendedProps.course, info.event.extendedProps.type);
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

    let events = eventsJSON.flatMap(subject => setCourses(subject));

    return (
        <>
            <div className="justify-center px-5 shadow-sm navbar bg-info">
                <p>Az oldal jelenleg aktív fejlesztés alatt van, türelmeteket kérem. Bármilyen észrevétel és javaslat a fejlesztéshez fontos számomra!</p>
            </div>
            <div className='flex flex-col gap-5 m-8 w-fit'>
                <Menu exportTimetable={exportTimetableAsPNGHandler} />
                <div className='w-full'>
                    <Subjects />
                </div>
                <div className='h-0 divider'></div>
                <FullCalendar
                    ref={timetableRef}
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
            <Analytics />
            <SpeedInsights />
        </>
    )
}

/**
 * The main application component that provides context to all child components.
 * 
 * @returns {JSX.Element} The main application wrapped with context providers.
 */
function App() {
    return (
        <AppProviders>
            <TimetableApp />
        </AppProviders>
    );
}

export default App
