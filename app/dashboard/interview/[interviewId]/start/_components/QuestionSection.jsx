import React, { useEffect } from 'react'

const QuestionSection = ({mockInterviewQuestion}) => {
    useEffect(() => {
        console.log(mockInterviewQuestion);
    }, []);
  return (
    <div className='p-5 border rounded-lg'>
        <div>
            {mockInterviewQuestion && mockInterviewQuestion?.map((question, i) => {
                <>
                    <h2>Question No. {i+1}</h2>
                    <span>{question}</span>
                </>
            })}
        </div> ̰
    </div>
  )
}

export default QuestionSection