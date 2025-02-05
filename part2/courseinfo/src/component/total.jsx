function Total({course}) {
    return ( 
        <div>
          <h5> Total of exercises : {course.parts.reduce((total, part) => total + part.exercises, 0)}</h5>
        </div>
      );
}

export default Total;