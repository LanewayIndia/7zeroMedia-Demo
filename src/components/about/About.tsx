// "use client"

// import { useEffect, useRef } from "react"
// import { gsap } from "@/lib/gsap"

// export default function About() {
//   const ref = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     gsap.fromTo(
//       ref.current,
//       { y: 100, opacity: 0 },
//       {
//         y: 0,
//         opacity: 1,
//         duration: 1,
//         scrollTrigger: {
//           trigger: ref.current,
//           start: "top 80%",
//         },
//       }
//     )
//   }, [])

//   return (
//     <section id="about" ref={ref} className="min-h-screen flex items-center justify-center">
//       <h2 className="text-5xl font-bold">About 7ZeroMedia</h2>
//     </section>
//   )
// }

// |||||||||||||| ---- ||||||||||||||||||||||||||| - |||||||||||||||||||||||||||||||||||

// "use client"

// import { useEffect, useRef } from "react"
// import { gsap } from "@/lib/gsap"

// export default function About() {
//   const sectionRef = useRef<HTMLDivElement>(null)
//   const imageRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     // Scroll reveal animation
//     gsap.fromTo(
//       sectionRef.current,
//       { y: 80, opacity: 0 },
//       {
//         y: 0,
//         opacity: 1,
//         duration: 1.2,
//         ease: "power4.out",
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 80%",
//         },
//       }
//     )

//     // Mouse interaction tilt
//     const image = imageRef.current
//     if (!image) return

//     const handleMouseMove = (e: MouseEvent) => {
//       const rect = image.getBoundingClientRect()
//       const x = e.clientX - rect.left
//       const y = e.clientY - rect.top

//       const rotateX = ((y - rect.height / 2) / rect.height) * 10
//       const rotateY = ((x - rect.width / 2) / rect.width) * -10

//       gsap.to(image, {
//         rotateX,
//         rotateY,
//         transformPerspective: 800,
//         transformOrigin: "center",
//         duration: 0.5,
//         ease: "power2.out",
//       })
//     }

//     const resetTilt = () => {
//       gsap.to(image, {
//         rotateX: 0,
//         rotateY: 0,
//         duration: 0.8,
//         ease: "power3.out",
//       })
//     }

//     image.addEventListener("mousemove", handleMouseMove)
//     image.addEventListener("mouseleave", resetTilt)

//     return () => {
//       image.removeEventListener("mousemove", handleMouseMove)
//       image.removeEventListener("mouseleave", resetTilt)
//     }
//   }, [])

//   return (
//     <section
//       id="about"
//       className="bg-[#F8F8F8] text-[#111111] py-28 px-8"
//     >
//       <div
//         ref={sectionRef}
//         className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center"
//       >
//         {/* LEFT SIDE */}
//         <div>
//           <p className="text-sm uppercase tracking-widest text-[#F97316] font-semibold mb-4">
//             About Us
//           </p>

//           <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
//             Building Modern Brands
//             <br />
//             Through Strategy & Performance
//           </h2>

//           <p className="text-lg text-gray-600 leading-relaxed mb-6">
//             7Zero Media is an AI-Powered, full-scale, next-generation media agency that goes far beyond traditional social media and Digital marketing. We operate as a complete media ecosystem, bringing together content creation, influencer development, storytelling, trend culture, and brand communication under one cohesive structure. Our core identity is defined by dynamism and cultural awareness, enabling us to create, manage, and scale digital narratives across multiple platforms
//           </p>

//           <p className="text-lg text-gray-600 leading-relaxed">
//             Our approach blends storytelling with performance intelligence —
//             combining creative execution with data-driven decision making to
//             build long-term digital authority.
//           </p>

//           <button className="mt-8 px-6 py-3 bg-[#F97316] text-white rounded-lg font-semibold hover:opacity-90 transition">
//             Learn More
//           </button>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="relative">
//           {/* Orange Glow Background */}
//           <div className="absolute inset-0 bg-[#F97316]/10 blur-3xl rounded-3xl"></div>

//           {/* Tilt Card */}
//           <div
//             ref={imageRef}
//             className="relative bg-white rounded-2xl shadow-xl overflow-hidden transition-transform"
//             style={{ transformStyle: "preserve-3d" }}
//           >
//             <img
//               src="/about-visual.jpg" // replace with your image
//               alt="7ZeroMedia"
//               className="w-full h-125 object-cover"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }


// |||||||||||| ---- ||||||||||||||||||||||||||| - |||||||||||||||||||||||||||||||||||

"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"
import SplitType from "split-type"

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!headingRef.current || !videoRef.current) return

    // 🔥 Split heading into lines
    const split = new SplitType(headingRef.current, {
      types: "lines",
      lineClass: "line",
    })

    // Wrap lines for masking
    split.lines?.forEach((line) => {
      const wrapper = document.createElement("div")
      wrapper.classList.add("line-mask")
      line.parentNode?.insertBefore(wrapper, line)
      wrapper.appendChild(line)
    })

    // Initial states
    gsap.set(".line", { yPercent: 100 })
    gsap.set(sectionRef.current, { opacity: 0, y: 60 })

    // Scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
    })

    tl.to(sectionRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
    }).to(
      ".line",
      {
        yPercent: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: "power4.out",
      },
      "-=0.6"
    )

    // 🎥 Mouse tilt interaction for video card
    const videoCard = videoRef.current

    const handleMouseMove = (e: MouseEvent) => {
      const rect = videoCard.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const rotateX = ((y - rect.height / 2) / rect.height) * 8
      const rotateY = ((x - rect.width / 2) / rect.width) * -8

      gsap.to(videoCard, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        duration: 0.4,
        ease: "power2.out",
      })
    }

    const resetTilt = () => {
      gsap.to(videoCard, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "power3.out",
      })
    }

    videoCard.addEventListener("mousemove", handleMouseMove)
    videoCard.addEventListener("mouseleave", resetTilt)

    return () => {
      split.revert()
      videoCard.removeEventListener("mousemove", handleMouseMove)
      videoCard.removeEventListener("mouseleave", resetTilt)
    }
  }, [])

  return (
    <section
      id="about"
      className="bg-[#F8F8F8] text-[#111111] py-28 px-8"
    >
      <div
        ref={sectionRef}
        className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center"
      >
        {/* LEFT SIDE */}
        <div>
          <p className="text-sm uppercase tracking-widest text-[#F97316] font-semibold mb-4">
            About 7ZeroMedia
          </p>

          <h2
            ref={headingRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            Building Modern Brands
            <br />
            Through Strategy & Performance
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            7Zero Media is an AI-Powered, full-scale, next-generation media agency that goes far beyond traditional social media and Digital marketing. We operate as a complete media ecosystem, bringing together content creation, influencer development, storytelling, trend culture, and brand communication under one cohesive structure. Our core identity is defined by dynamism and cultural awareness, enabling us to create, manage, and scale digital narratives across multiple platforms.
          </p>

          <p className="text-lg text-gray-600 leading-relaxed">
            Our approach blends storytelling with performance intelligence —
            combining creative execution with data-driven decision making to
            build long-term digital authority.
          </p>

          <button className="mt-8 px-6 py-3 bg-[#F97316] text-white rounded-lg font-semibold hover:opacity-90 transition">
            Learn More
          </button>
        </div>

        {/* RIGHT SIDE - VIDEO */}
        <div className="relative">
          {/* Orange glow */}
          <div className="absolute inset-0 bg-[#F97316]/10 blur-3xl rounded-3xl"></div>

          <div
            ref={videoRef}
            className="relative rounded-2xl overflow-hidden shadow-xl"
            style={{ transformStyle: "preserve-3d" }}
          >
            <video
              src="/about-video.mp4"  // 🔥 Put your video in public folder
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-125 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}