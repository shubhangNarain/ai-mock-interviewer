"use client";
import { db } from "@/app/utils/db";
import { MockInterview } from "@/app/utils/schema";
import { Button } from "@/components/ui/button";
import { eq } from "drizzle-orm";
import { WebcamIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

const Interview = () => {
  const params = useParams();
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  useEffect(() => {
    console.log(params.interviewId);
    GetInterviewDetails();
  },[]);
  // used to get interview details by mockId/interviewId
  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    setInterviewData(result[0]);
  };
  return (
    <div className="my-10 flex justify-center flex-col items-center">
      <h2 className="font-bold text-2xl">Let's get started</h2>
      <div className="">
        {webCamEnabled ? (
          <Webcam
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
            style={{
              height: 300,
              width: 300,
            }}
          />
        ) : (
          <>
            <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
            <Button onClick={() => setWebCamEnabled(true)}>
              Enable Web Cam and Microphone
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Interview;
