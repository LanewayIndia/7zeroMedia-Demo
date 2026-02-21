// "use client"

// import { useState, useRef, useEffect } from "react"
// import { gsap } from "gsap"
// import { ScrollTrigger } from "gsap/ScrollTrigger"
// import { ArrowLeft } from "lucide-react"

// gsap.registerPlugin(ScrollTrigger)

// const jobs = [
//   {
//     id: 1,
//     title: "Social Media Strategist",
//     type: "Full-Time",
//     location: "Remote / On-Site",
//     description:
//       "We are looking for a strategic thinker who understands platform-native growth systems. You will design content roadmaps, growth loops, and performance-driven strategies.",
//   },
//   {
//     id: 2,
//     title: "Video Editor & Content Producer",
//     type: "Full-Time",
//     location: "On-Site",
//     description:
//       "Edit high-performance short-form and long-form content. Work closely with our growth team to build creative assets optimized for engagement and conversion.",
//   },
//   {
//     id: 3,
//     title: "Performance Marketing Specialist",
//     type: "Full-Time",
//     location: "Remote",
//     description:
//       "Own paid media systems across Meta and Google. Build testing frameworks, optimize campaigns, and scale ROI-positive ad systems.",
//   },
// ]

// export default function Careers() {
//   const [selectedJob, setSelectedJob] = useState<any>(null)
//   const listRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     if (!listRef.current) return

//     gsap.fromTo(
//       Array.from(listRef.current.children),
//       { y: 60, opacity: 0 },
//       {
//         y: 0,
//         opacity: 1,
//         stagger: 0.15,
//         duration: 0.8,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: listRef.current,
//           start: "top 80%",
//         },
//       }
//     )
//   }, [])

//   return (
//     <section className="bg-white min-h-screen px-6 md:px-16 lg:px-24 py-32 text-[#111111]">

//       {!selectedJob ? (
//         <div className="max-w-5xl mx-auto">

//           <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#F97316] mb-4 block">
//             Careers
//           </span>

//           <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
//             Join The Growth Engine
//           </h1>

//           <p className="text-[#111111]/45 text-lg max-w-xl mb-20 leading-relaxed">
//             We’re building a team of operators, strategists, and creators.
//             Explore open roles below and become part of the system.
//           </p>

//           {/* Job List */}
//           <div ref={listRef} className="flex flex-col gap-6">
//             {jobs.map((job) => (
//               <div
//                 key={job.id}
//                 onClick={() => setSelectedJob(job)}
//                 className="cursor-pointer bg-[#F8F8F8] border border-[#111111]/6 rounded-2xl p-8 hover:border-[#F97316]/30 hover:shadow-[0_8px_40px_rgba(249,115,22,0.08)] transition-all duration-300"
//               >
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h3 className="text-2xl font-bold">{job.title}</h3>
//                     <p className="text-sm text-[#111111]/45 mt-1">
//                       {job.type} • {job.location}
//                     </p>
//                   </div>

//                   <span className="text-[#F97316] font-semibold text-sm">
//                     View Role →
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         // ===========================
//         // JOB DETAIL + FORM VIEW
//         // ===========================
//         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">

//           {/* LEFT SIDE — Job Details */}
//           <div>
//             <button
//               onClick={() => setSelectedJob(null)}
//               className="flex items-center gap-2 text-sm text-[#F97316] mb-10"
//             >
//               <ArrowLeft size={16} />
//               Back to openings
//             </button>

//             <h2 className="text-4xl font-bold mb-4">
//               {selectedJob.title}
//             </h2>

//             <p className="text-sm text-[#111111]/45 mb-6">
//               {selectedJob.type} • {selectedJob.location}
//             </p>

//             <p className="text-lg text-[#111111]/60 leading-relaxed">
//               {selectedJob.description}
//             </p>
//           </div>

//           {/* RIGHT SIDE — Application Form */}
//           <div className="bg-[#F8F8F8] border border-[#111111]/6 rounded-2xl p-10 shadow-sm">

//             <h3 className="text-2xl font-bold mb-6">
//               Apply for this position
//             </h3>

//             <form className="flex flex-col gap-5">

//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 className="p-4 rounded-lg border border-[#111111]/10 focus:outline-none focus:border-[#F97316]"
//               />

//               <input
//                 type="email"
//                 placeholder="Email Address"
//                 className="p-4 rounded-lg border border-[#111111]/10 focus:outline-none focus:border-[#F97316]"
//               />

//               <input
//                 type="url"
//                 placeholder="Portfolio / LinkedIn Link"
//                 className="p-4 rounded-lg border border-[#111111]/10 focus:outline-none focus:border-[#F97316]"
//               />

//               <select
//                 className="p-4 rounded-lg border border-[#111111]/10 focus:outline-none focus:border-[#F97316]"
//               >
//                 <option value="">Experience Level</option>
//                 <option>Fresher</option>
//                 <option>Experienced</option>
//                 <option>Currently Attending College</option>
//               </select>

//               <textarea
//                 rows={4}
//                 placeholder="Tell us a bit about yourself..."
//                 className="p-4 rounded-lg border border-[#111111]/10 focus:outline-none focus:border-[#F97316]"
//               />

//               <div>
//                 <label className="text-sm text-[#111111]/50 block mb-2">
//                   Upload CV
//                 </label>
//                 <input
//                   type="file"
//                   className="w-full text-sm"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="mt-4 bg-[#F97316] text-white py-4 rounded-xl font-semibold hover:bg-[#ea6c0a] transition-all duration-200 hover:shadow-[0_8px_40px_rgba(249,115,22,0.3)]"
//               >
//                 Submit Application
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </section>
//   )
// }


"use client"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowLeft, UploadCloud } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const jobs = [
    {
        id: 1,
        title: "Performance Marketing Specialist",
        type: "Full-Time",
        location: "Remote",
        intro:
            "We are building a performance-first growth infrastructure. This role is critical in designing, optimizing, and scaling ROI-positive acquisition systems across paid media channels.",
        tech: [
            "Meta Ads Manager",
            "Google Ads",
            "Google Analytics 4",
            "Conversion Tracking & Pixel Setup",
            "A/B Testing Frameworks",
        ],
        responsibilities: [
            "Plan and execute paid campaigns across platforms",
            "Build structured testing frameworks",
            "Optimize CPA, ROAS, and funnel performance",
            "Analyze data and generate actionable insights",
        ],
        expectations: [
            "Strong analytical thinking",
            "Bias toward experimentation",
            "Ownership mentality",
            "Clear communication skills",
        ],
    },

    {
        id: 2,
        title: "Social Media Strategist",
        type: "Full-Time",
        location: "Remote",
        intro:
            "A Social Media Strategist develops and executes strategies to grow a brand’s presence across digital platforms. This role focuses on audience engagement, content planning, performance analysis, and trend monitoring to increase reach, conversions, and brand awareness.",
        tech: [
            "📊 Analytics Tools: Google Analytics, Meta Business Suite",
            "📅 Scheduling Tools: Hootsuite, Buffer",
            "🎨 Design Tools: Canva, Adobe Photoshop",
            "📱 Platforms: Instagram, Facebook, LinkedIn, TikTok",
        ],
        responsibilities: [
            "Develop and implement social media content strategies.",
            "Create and manage content calendars.",
            "Analyze performance metrics and optimize campaigns.",
            "Engage with followers and manage online communities.",
            "Track trends, competitors, and emerging platform features.",
        ],
        expectations: [
            "Strong understanding of social media algorithms and trends.",
            "Data-driven mindset with analytical skills.",
            "Creative thinking and brand storytelling ability.",
            "Excellent communication and copywriting skills.",
            "Consistency, adaptability, and strategic planning skills.",
        ],
    },

    {
        id: 3,
        title: "Video Editor & Content Producer",
        type: "Full-Time",
        location: "Remote",
        intro:
            "A Video Editor & Content Producer is responsible for transforming raw footage into engaging visual stories that align with a brand’s goals. This role combines creative storytelling, technical editing skills, and production planning to create high-quality video content for digital platforms, advertisements, YouTube, events, and social media.",
        tech: [
            "🎞️ Editing Software: Adobe Premiere Pro, Final Cut Pro, DaVinci Resolve",
            "🎨 Graphics & Motion: Adobe After Effects, Canva",
            "🎧 Audio Editing: Adobe Audition",
            "📷 Equipment: DSLR/Mirrorless cameras, lighting setups, microphones",
            "☁️ Collaboration Tools: Frame.io, Google Drive",
        ],
        responsibilities: [
            "Edit and assemble recorded raw material into polished final videos.",
            "Add motion graphics, sound design, color correction, and visual effects.",
            "Plan and execute video shoots (script, storyboard, production coordination).",
            "Optimize videos for different platforms (YouTube, Instagram, ads, etc.).",
            "Manage video archives and ensure timely delivery of projects.",
        ],
        expectations: [
            "Strong storytelling and visual sense.",
            "Proficiency in editing and motion graphics tools.",
            "Ability to meet tight deadlines and manage multiple projects.",
            "Attention to detail in audio, visuals, and transitions.",
            "Good communication and collaboration skills.",
        ],
    },
]

export default function Careers() {
    const [selectedJob, setSelectedJob] = useState<any>(null)
    const [aboutText, setAboutText] = useState("")
    const [fileName, setFileName] = useState("")
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!listRef.current) return

        gsap.fromTo(
            Array.from(listRef.current.children),
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.15,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: listRef.current,
                    start: "top 80%",
                },
            }
        )
    }, [])

    return (
        <section className="bg-white min-h-screen px-6 md:px-16 lg:px-24 py-32 text-[#111111]">

            {!selectedJob ? (
                <div className="max-w-5xl mx-auto">

                    <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#F97316] mb-4 block">
                        Careers
                    </span>

                    <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                        Join The Growth Engine
                    </h1>

                    <p className="text-[#111111]/45 text-lg max-w-xl mb-20 leading-relaxed">
                        We’re building a team of operators, strategists, and creators.
                        Explore open roles below and become part of the system.
                    </p>

                    <div ref={listRef} className="flex flex-col gap-6">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                onClick={() => setSelectedJob(job)}
                                className="cursor-pointer bg-[#F8F8F8] border border-[#111111]/6 rounded-2xl p-8 hover:border-[#F97316]/30 hover:shadow-[0_8px_40px_rgba(249,115,22,0.08)] transition-all duration-300"
                            >
                                <h3 className="text-2xl font-bold">{job.title}</h3>
                                <p className="text-sm text-[#111111]/45 mt-1">
                                    {job.type} • {job.location}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* LEFT SIDE */}
                    <div>
                        <button
                            onClick={() => setSelectedJob(null)}
                            className="flex items-center gap-2 text-sm text-[#F97316] mb-10"
                        >
                            <ArrowLeft size={16} />
                            Back to openings
                        </button>

                        <h2 className="text-4xl font-bold mb-3">
                            {selectedJob.title}
                        </h2>

                        <p className="text-sm text-[#111111]/45 mb-8">
                            {selectedJob.type} • {selectedJob.location}
                        </p>

                        <div className="space-y-8 text-[#111111]/60 leading-relaxed">

                            <p>{selectedJob.intro}</p>

                            <div>
                                <h4 className="font-semibold text-[#111111] mb-3">
                                    Tech Stack Required
                                </h4>
                                <ul className="list-disc ml-6 space-y-1">
                                    {selectedJob.tech.map((item: string, i: number) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-[#111111] mb-3">
                                    Key Responsibilities
                                </h4>
                                <ul className="list-disc ml-6 space-y-1">
                                    {selectedJob.responsibilities.map((item: string, i: number) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-[#111111] mb-3">
                                    What We Expect From You
                                </h4>
                                <ul className="list-disc ml-6 space-y-1">
                                    {selectedJob.expectations.map((item: string, i: number) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT SIDE FORM */}
                    <div className="bg-[#F8F8F8] border border-[#111111]/6 rounded-2xl p-10 shadow-sm">

                        <h3 className="text-2xl font-bold mb-8">
                            Apply for this position
                        </h3>

                        <form className="flex flex-col gap-6">

                            <input
                                type="text"
                                placeholder="Full Name"
                                className="p-4 rounded-lg border border-[#111111]/10 focus:outline-none focus:border-[#F97316]"
                            />

                            <input
                                type="email"
                                placeholder="Email Address"
                                className="p-4 rounded-lg border border-[#111111]/10 focus:outline-none focus:border-[#F97316]"
                            />

                            <input
                                type="url"
                                placeholder="Portfolio Link"
                                className="p-4 rounded-lg border border-[#111111]/10 focus:outline-none focus:border-[#F97316]"
                            />

                            <input
                                type="url"
                                placeholder="LinkedIn Profile URL"
                                className="p-4 rounded-lg border border-[#111111]/10 focus:outline-none focus:border-[#F97316]"
                            />

                            <input
                                type="url"
                                placeholder="GitHub Profile URL"
                                className="p-4 rounded-lg border border-[#111111]/10 focus:outline-none focus:border-[#F97316]"
                            />

                            <select className="p-4 rounded-lg border border-[#111111]/10 focus:outline-none focus:border-[#F97316]">
                                <option value="">Experience Level</option>
                                <option>Fresher</option>
                                <option>1-3 Years</option>
                                <option>3-5 Years</option>
                                <option>5+ Years</option>
                                <option>Currently Attending College</option>
                            </select>

                            {/* About with counter */}
                            <div>
                                <textarea
                                    maxLength={1000}
                                    rows={5}
                                    value={aboutText}
                                    onChange={(e) => setAboutText(e.target.value)}
                                    placeholder="Tell us a bit about yourself (Max 1000 characters)..."
                                    className="w-full p-4 rounded-lg border border-[#111111]/10 focus:outline-none focus:border-[#F97316]"
                                />
                                <p className="text-xs text-[#111111]/40 mt-1 text-right">
                                    {aboutText.length}/1000
                                </p>
                            </div>

                            {/* Drag & Drop CV Upload */}
                            <div>
                                <label className="text-sm text-[#111111]/60 block mb-3">
                                    Upload Your CV
                                </label>

                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#111111]/15 rounded-xl p-8 cursor-pointer hover:border-[#F97316]/40 transition-all">
                                    <UploadCloud size={28} className="text-[#F97316] mb-3" />
                                    <span className="text-sm text-[#111111]/50">
                                        Drag & drop your CV here or click to upload
                                    </span>
                                    <span className="text-xs text-[#111111]/40 mt-1">
                                        PDF, DOC, DOCX
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e: any) =>
                                            setFileName(e.target.files[0]?.name || "")
                                        }
                                    />
                                </label>

                                {fileName && (
                                    <p className="text-sm text-[#111111]/60 mt-3">
                                        Selected: {fileName}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="mt-6 bg-[#F97316] text-white py-4 rounded-xl font-semibold hover:bg-[#ea6c0a] transition-all duration-200 hover:shadow-[0_10px_40px_rgba(249,115,22,0.3)]"
                            >
                                Submit Application
                            </button>

                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}