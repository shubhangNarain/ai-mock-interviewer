"use client";
import { db } from "@/app/utils/db";
import { MockInterview } from "@/app/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";
import { LoaderCircle } from "lucide-react";

function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      GetInterviewList();
    }
  }, [user]);

  useEffect(() => {
    console.log("Updated Interview List:", interviewList);
  }, [interviewList]);

  const GetInterviewList = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(
          eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
        .orderBy(desc(MockInterview.id));

      console.log("Fetched Interviews:", result);
      setInterviewList(result);
    } catch (error) {
      console.error("Error fetching interview list", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  return (
    <div>
      <h2 className="font-medium text-xl">Previous Mock Interviews:</h2>

      {loading ? (
        <div className="text-center">
          <LoaderCircle size={50} className="animate-spin mx-auto" />
          <p>Loading...</p>
        </div>
      ) : interviewList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
          {interviewList.map((interview, index) => (
            <InterviewItemCard
              key={interview.id || index}
              interview={interview}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No mock interviews found.</p>
      )}
    </div>
  );
}

export default InterviewList;
