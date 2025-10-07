import React from 'react'
import Courses from '../../Courses';

const TableBody = ({ data, columns, subject }) => {
    return (
        <tbody>
            {data.map((course) => {
                return <Courses key={course.id} subjectId={subject.id} choosen={subject.status.choosen} course={course} type={course.type} />;
            })}
        </tbody>
    )
}

export default TableBody