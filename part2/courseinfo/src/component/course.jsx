import React from 'react'
import Header from './header'
import Total from './total';
function Course({course}) {
 return (
    <div>
        <Header title={course.name} />
        {course.parts.map(part => <p key={part.id}>{part.name} {part.exercises}</p>)}
        <Total course={course} />
    </div>
  )
}

export default Course;