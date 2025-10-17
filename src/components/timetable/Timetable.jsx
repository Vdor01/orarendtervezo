import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import huLocale from '@fullcalendar/core/locales/hu';
import { useTimetable, useSettings } from '../../contexts';
import { getDateOfThisWeeksDay, isDisplayed, isChoosen, isColorDark } from '../../utils/timetableUtils';

/**
 * Timetable component that handles calendar display and event interaction.
 * 
 * @returns {JSX.Element} The calendar component.
 */
const Timetable = () => {
    const { eventsJSON, timetableRef, setChoosenCourse } = useTimetable();
    const { settings } = useSettings();

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
            // Create ISO datetime string: YYYY-MM-DDTHH:MM:SS format for FullCalendar
            start: getDateOfThisWeeksDay(course.day).toISOString().split('T')[0] + 'T' + course.startTime + ':00',
            end: getDateOfThisWeeksDay(course.day).toISOString().split('T')[0] + 'T' + course.endTime + ':00',
            borderColor: subject.status.color,
            // Chosen courses get subject color, non-chosen get black (#000000)
            backgroundColor: isChoosen(subject, course) ? subject.status.color : '#000000',
            // Hide events that shouldn't be displayed based on selection rules
            display: isDisplayed(subject, course) ? '' : 'none',
            // Add CSS classes: cursor pointer for all, dashed border for lectures
            classNames: ['cursor-pointer', (course.type === 'Előadás') ? 'border-dashed' : ''],
            extendedProps: {
                title: subject.name,
                subjectId: subject.id,
                instructor: course.instructor,
                location: course.location,
                course: course.course,
                type: course.type,
                notes: course.notes,
            }
        }));
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

    const events = eventsJSON.flatMap(subject => setCourses(subject));

    return (
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
                        {settings.show.name && <div>{arg.event.extendedProps.title}</div>}
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
    );
};

export default Timetable;
