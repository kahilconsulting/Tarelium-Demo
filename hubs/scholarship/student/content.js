/* ============================================================
   Scholarship Hub — Student
   Demo Content

   HOW TO EDIT:
   - Update step titles and descriptions below.
   - To add a screenshot: drop the file in
       assets/screenshots/scholarship/student/
     then set  file: "your-filename.png"  in the step.
   - To add a step: copy one object and add it to the array.
   - To reorder steps: move the objects in the array.
   ============================================================ */

const DEMO = {
  hub:         "Scholarship Hub",
  hubSlug:     "scholarship",
  persona:     "Student",
  personaSlug: "student",
  color:       "#1A6644",

  steps: [
    {
      title: "Login to the Student Portal",
      description: "Students access the Scholarship Hub by logging in to the student portal using their university credentials. The portal provides a single, secure entry point for all scholarship-related activities.",
      screenshots: [
        { file: "step-01-login.png", caption: "Student Portal login screen" }
      ]
    },
    {
      title: "Navigate to My Applications",
      description: "After logging in, students navigate to the 'My Applications' section from the main menu. This dashboard provides a clear overview of all current and past scholarship applications along with their real-time statuses.",
      screenshots: [
        // { file: "step-02-my-applications.png", caption: "My Applications overview dashboard" }
      ]
    },
    {
      title: "Start a New Application",
      description: "Students click 'New Application' to begin the process. They are presented with a curated list of scholarships they are eligible for, filtered automatically based on their profile, course, and enrolment status.",
      screenshots: [
        // { file: "step-03-new-application.png", caption: "Available scholarships list" }
      ]
    },
    {
      title: "Fill in Application Details",
      description: "The guided form walks students through each required section: personal details, academic history, scholarship-specific questions, supporting documents, and referee nominations. Progress is automatically saved at every step.",
      screenshots: [
        // { file: "step-04a-form-details.png", caption: "Application form — personal and academic details" },
        // { file: "step-04b-documents.png",    caption: "Application form — supporting documents upload" }
      ]
    },
    {
      title: "Submit and Track Application Status",
      description: "Once all sections are complete, students review a summary and submit their application. The dashboard immediately reflects the submission with a 'Submitted' status, and an automated confirmation notification is sent to the student.",
      screenshots: [
        // { file: "step-05-status.png", caption: "Application submitted — real-time status tracking view" }
      ]
    }
  ]
};
