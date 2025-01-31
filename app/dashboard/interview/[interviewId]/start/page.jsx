'use client'
import { db } from '@/app/utils/db';
import { MockInterview } from '@/app/utils/schema';
import { eq } from 'drizzle-orm';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import QuestionSection from './_components/QuestionSection';

const StartInterview = () => {
    const params = useParams()
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();

    useEffect(() => {
        GetInterviewDetails();
    }, []);

    const GetInterviewDetails = async () => {
        const result = await db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.mockId, params.interviewId));
    
          const jsonMockResp = JSON.parse(result[0].jsonMockResp);
          console.log(jsonMockResp);
          setMockInterviewQuestion(jsonMockResp);
          console.log(mockInterviewQuestion)
          setInterviewData(result[0]);

    };

  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2'>
            {/* Questions */}
            <QuestionSection mockInterviewQuestion={mockInterviewQuestion}/>

            {/* A/V Recording Component */}
             
        </div>
    </div>
  )
}

export default StartInterview