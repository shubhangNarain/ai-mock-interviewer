"use client";
import { db } from "@/app/utils/db";
import { UserAnswer } from "@/app/utils/schema";
import { eq } from "drizzle-orm";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function Feedback() {
  const params = useParams();
  const router = useRouter();

  const [feedbackList, setFeedbackList] = useState([]);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetFeedback();
  }, []);

  useEffect(() => {
    console.log("Updated feedback List:", feedbackList);
    
    if (feedbackList &&feedbackList.length > 0) {
      const total = feedbackList.reduce((acc, curr) => {
        const rate = Number(curr.rating);
        return acc + (isNaN(rate) ? 0 : rate);
      }, 0);

      setRating((total /feedbackList.length).toFixed(0));
    }
  }, [feedbackList]);

  const GetFeedback = async () => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewId))
        .orderBy(UserAnswer.id);

      console.log("Fetched Feedback:", result);
      setFeedbackList(result);
    } catch (error) {
      console.error("Error fetching feedback", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-green-500">Congratulations!</h2>

      <h2 className="font-bold text-2xl">Here is your interview feedback</h2>

      <h2 className="text-primary text-lg my-3">
        Your overall Interview rating: <strong className={`${rating < 4 ? "text-red-600" : (rating < 8 ? "text-yellow-600" : "text-green-600")}`}>{rating}</strong>
      </h2>

      <h2 className="text-sm text-gray-500">
        Find below interview questions with correct answer, your answer and
        feedback for improvement
      </h2>

      <div className="p-5 rounded-lg">
        {loading ? ( // Show loader while fetching data
          <div className="text-center">
            <LoaderCircle size={50} className="animate-spin mx-auto" />
            <p>Loading...</p>
          </div>
        ) : feedbackList.length > 0 ? (
          feedbackList.map((item, index) => (
            <Collapsible key={index} className="mt-7">
              <CollapsibleTrigger className="w-full flex justify-between p-2 bg-secondary rounded-lg my-2 text-left gap-7 hover:bg-gray-300 transition-all">
                {item.question} <ChevronsUpDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="">
                <div className="flex flex-col gap-2">
                  <h2 className="text-red-500 p-2 border rounded-lg">
                    <strong>Rating: </strong>
                    {item.rating}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                    <strong>Your Answer: </strong>
                    {item.userAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                    <strong>Correct Answer: </strong>
                    {item.correctAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary">
                    <strong>Feedback: </strong>
                    {item.feedback}
                  </h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        ) : (
          <p className="text-center text-gray-600">No feedback available.</p>
        )}
      </div>
      <Button onClick={() => router.replace("/dashboard")}>Go Home</Button>
    </div>
  );
}

export default Feedback;
