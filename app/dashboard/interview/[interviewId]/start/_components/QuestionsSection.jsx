import { Lightbulb, LoaderCircle, Volume2 } from "lucide-react";
import React, { useEffect } from "react";

const QuestionsSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
  useEffect(() => {
    console.log("Updated mockInterviewQuestion:", mockInterviewQuestion);
  }, [mockInterviewQuestion]); // ✅ Added dependency to track changes

  const textToSpeech = (text) => {
    if('speechSynthesis' in window){
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry, Your browser does not support text-to-speech')
    }
  }

  return (
    mockInterviewQuestion && (
      <div className="p-5 border rounded-lg my-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {mockInterviewQuestion?.length > 0 ? (
            mockInterviewQuestion.map((question, index) => (
              <h2 key={index}
                className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${
                  activeQuestionIndex === index ? "bg-secondary text-white" : "bg-primary"
                }
            `}
              >
                Question no. {index + 1}
              </h2>
            ))
          ) : (
            <div className="flex gap-12">
              <LoaderCircle className="animate-spin" />
              <p>Loading...</p>
            </div>
          )}
        </div>
        <h2 className="my-5 text-md md:text-lg font-bold">{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
        <Volume2 className="cursor-pointer" onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}/>

        <div className="border rounded-lg p-5 bg-blue-100 mt-20">
            <h2 className="flex gap-2 items-center text-primary">
                <Lightbulb/>
                <strong>Note:</strong>
            </h2>
            <h2 className="text-sm my-2 text-primary">{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
        </div>
      </div>
    )
  );
};

export default QuestionsSection;
