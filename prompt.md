# 1.0 Overview 
Build a fast, lightweight, single-page web application to coordinate December test schedules for a class.
for now this should work just for class 2D, later it will be adopted by the whole school.

> for everything you work on you must only do up to the point
i tell you to and also tell me all the commands i should run before inserting the code.

## 1.1 Tech Stack
(the proejct is named 2d6767)
- **Framework:** Next.js (App Router) + React
- **Styling:** Tailwind CSS
- **Icons:** Lucide React (`lucide-react`)
- **Deployment Target:** vercel 

#### **Calendar**:


> **NOTE**: every command you run outside of editing files(which youll tell me precisely so i can replicate)
> you need to ask for my permission before doing anything(installing other packages, etc..).

## Core Architecture & Data Management
- **No Backend/Database:** All dynamic content is powered by embedded Google services controlled via a single local configuration file (`src/data/subjects.ts`).
- **Central Config (`subjects.ts`):** Export an array of subject objects containing:
  - `id` (string)
  - `name` (string, e.g., "History", "Biology", "Literature")
  - `calendarEmbedUrl` (string — Google Calendar public iframe URL)
  - `driveFolderId` (string — Google Drive folder ID for `https://drive.google.com/embeddedfolderview?id=${driveFolderId}#list`)
  - `driveUploadUrl` (string — direct link to the shared Drive folder so students with Editor permissions can upload their slides)

## UI & Features Required
1. **Header & Navigation:**
   - Clean, modern header with the site title (e.g., "Class Hub — December Schedule & Slides") and a quick "How to Book / Upload" helper modal or collapsible banner explaining how classmates add their `Name - Topic` event to the shared calendar and upload files to Drive.
2. **Subject Selector Tabs:**
   - Horizontal pill tabs (with Lucide icons) allowing students to switch between subjects (plus an optional "All Subjects" overview).
   - Switching tabs dynamically updates both the Calendar view and the Presentations view for that subject.
3. **Interactive Calendar Section (View Mode):**
   - Responsive container embedding the selected subject's Google Calendar `<iframe>` in clean view mode, defaulted to December 2026.
   - Include a direct external button (`ExternalLink` icon) to "Open in Google Calendar to Book a Slot" for students with edit access.
4. **Presentations & Resources Section:**
   - Responsive container embedding the selected subject's Google Drive folder (`embeddedfolderview?id=...#list`) so classmates can preview and download PPTs/PDFs directly inside the website.
   - Include an "Upload Your PPT/PDF" button (`Upload` icon) linking to the shared Drive folder.
5. **Responsive & Clean Design:**
   - Mobile-friendly layout (stacked on mobile, clean grid or tabbed workspace on desktop).
   - Subtle borders, clean typography, and smooth loading skeleton states while iframes load.

## Deliverables
1. Project file structure.
2. `src/data/subjects.ts` with 3 placeholder subjects ready for me to paste my real Google Calendar URLs and Drive Folder IDs.
3. Complete, production-ready React components and main page (`src/app/page.tsx`) styled with Tailwind CSS and Lucide icons.
