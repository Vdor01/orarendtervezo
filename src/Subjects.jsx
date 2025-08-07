import React from 'react';
import 'primeicons/primeicons.css';
import Courses from './Courses';
import Subject from './components/subjects/Subject';
import { useTimetable } from './contexts';

/**
 * Subjects component renders a list of subjects.
 * It maps through the subjects array and renders a Subject component for each subject.
 * Uses Context API to access the subjects list.
 * 
 * @returns {JSX.Element} A div element containing a list of Subject components.
 */
const Subjects = () => {
    const { eventsJSON } = useTimetable();

    return (
        <div className='flex flex-col gap-5 bg-base-300 card'>
            {eventsJSON.map((subject) => (
                <Subject
                    key={subject.id}
                    subject={subject}
                />
            ))}
        </div>
    );
};

export default Subjects;
