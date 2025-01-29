"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/app/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { db } from "@/app/utils/db";
import { MockInterview } from "@/app/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [JsonResp, setJsonResp] = useState();
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience);

    const InputPrompt =
      "Job Position: " +
      jobPosition +
      ", Job Description: " +
      jobDesc +
      ", Years of experience: " +
      jobExperience +
      ". Based on these parameters, give me " +
      process.env.NEXT_PUBLIC_NO_OF_QUESTIONS +
      " interview questions and answers in json format. Give questions and answers as field in json format";

    const result = await chatSession.sendMessage(InputPrompt);
    const MockJSONResp = result.response
      .text()
      .replace('```json', '')
      .replace('```', '');
    console.log(JSON.parse(MockJSONResp));
    setJsonResp(MockJSONResp);

    if (MockJSONResp) {
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJSONResp,
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
        })
        .returning({ mockId: MockInterview.mockId });

      console.log("Inserted ID: ", resp);

      if(resp){
        setOpenDialog(false);
        router.push('/dashboard/interview/' + resp[0]?.mockId);
      }
    } else {
      console.log("ERROR")
    }

    setLoading(false);
  };
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary
            hover:scale-105 hover:shadow-md cursor-pointer transition-all
        "
        onClick={() => {
          setOpenDialog(!openDialog);
        }}
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about yout job interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add details about your Job Position/Role, Job description
                    and years of experience
                  </h2>
                  <div className="mt-7 my-3">
                    <label>Job Role / Job Position</label>
                    <Input
                      placeholder="Ex. Fullstack Developer"
                      required
                      onChange={(e) => setJobPosition(e.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label>Job Description / Tech Stack (In Short)</label>
                    <Textarea
                      placeholder="Ex. ReactJs, NodeJs, Framer-Motion, etc."
                      required
                      onChange={(e) => setJobDesc(e.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label>Years of experience</label>
                    <Input
                      placeholder="Ex. 5"
                      type="number"
                      max="100"
                      required
                      onChange={(e) => setJobExperience(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => setOpenDialog(!openDialog)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        'Generating from AI'
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
