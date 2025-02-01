"use client";
import { db } from "@/app/utils/db";
import { chatSession } from "@/app/utils/GeminiAIModel";
import { UserAnswer } from "@/app/utils/schema";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Mic, StopCircle } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { toast } from "sonner";

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useUser();

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) =>
      setUserAnswer((prevAns) => prevAns + result.transcript)
    );
  }, [results]);

  useEffect(() => {
    console.log("Updated interviewData:", interviewData);
  }, [interviewData]);

  const StartStopRecording = async () => {
    if (isRecording) {
      setLoading(true);
      stopSpeechToText();
      if (userAnswer.length < 10) {
        setLoading(false);
        toast("Error While saving your answer, Please Record Again.");
        return;
      }

      
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    const feedbackPrompt =
        "Question:" +
        mockInterviewQuestion[activeQuestionIndex]?.question +
        ", User Answer:" +
        userAnswer +
        ", Depending on the question and user answer for given interview question " +
        " please give us a rating for answer between 1 and 10, and feedback as the area of improvement, if any. " +
        "in just 3 to 5 lines to improve the user's answer, In JSON format with rating field and feedback field.";

      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = (result.response
        .text()
        .replace("```json", "")
        .replace("```", ""));
        console.log(mockJsonResp);

        const jsonFeedbackResp = JSON.parse(mockJsonResp);

        const resp = await db.insert(UserAnswer)
        .values({
          mockIdRef: interviewData?.mockId,
          question: mockInterviewQuestion[activeQuestionIndex]?.question,
          correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
          userAns: userAnswer,
          feedback: jsonFeedbackResp?.feedback,
          rating: jsonFeedbackResp?.rating,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-yyyy'),
        })

        console.log("Inserted Data: ", resp);

        if(resp){
          toast("Answer Saved Successfully.");
        }
        setUserAnswer('');
        setLoading(false);
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Image
          src={"/webcam.png"}
          height={200}
          width={200}
          className="absolute"
          alt="webcam"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>

      <Button diabled={toString(loading)} variant="outline" className="my-10" onClick={StartStopRecording}>
        {isRecording ? (
          <h2 className="flex gap-2 items-center text-red-600">
            <StopCircle />
            Stop Recording...
          </h2>
        ) : (
          <h2 className="flex gap-2 items-center text-primary">
            <Mic />
            Start Recording
          </h2>
        )}
      </Button>

      <Button onClick={() => console.log(userAnswer)}>Show User answer</Button>
    </div>
  );
}

export default RecordAnswerSection;
