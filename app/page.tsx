"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center py-6 px-4">
      {/* Main Content Card Container */}
      <div className="w-full max-w-4xl bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Instructor Profile */}
          <div className="md:col-span-5 flex flex-col">
            <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              {/* Instructor Photo */}
              <div className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden">
                <Image
                  src="/me.jpg"
                  alt="Tanut Phunkong"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Instructor Details */}
              <div className="p-4 text-xs text-neutral-700 leading-relaxed">
                <h3 className="font-bold text-neutral-900 text-sm">
                  Tanut Phunkong
                </h3>
                <p className="mt-1.5 text-neutral-600">student ID : 68028322</p>
                <p className="mt-1.5 text-neutral-600">
                  Computer Science and Software Development
                </p>
                <p className="text-neutral-600">
                  Innovation Dept.
                  <span className="font-semibold text-neutral-800">(CSI)</span>
                </p>
                <p className="text-neutral-600">
                  School of Information Technology
                  <span className="font-semibold text-neutral-800">(SIT)</span>
                </p>
                <p className="text-neutral-600">
                  Sripatum University
                  <span className="font-semibold text-neutral-800">(SPU)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Course Coverage & Hero Illustration */}
          <div className="md:col-span-7 flex flex-col justify-between h-full">
            <div>
              {/* Course Header */}
              <h2 className="text-sm sm:text-base font-bold text-neutral-900 mb-3.5">
                About Me :
              </h2>

              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                Hello , I&apos;m Tanut Phunkong or you can call me Nut.
              </p>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                I&apos;m a student in Computer Science and Software Development
                Department, School of Information Technology, Sripatum
                University
              </p>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                I&apos;m studying CSI205 this term, so I&apos;ll create a
                website for lerning how to make a website.
              </p>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                My Goal for studying this major is to be a Software Engineer who
                is able to develope application that can help people in daily
                life.
              </p>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                I&apos;m very welcome to know more about Programming or AI to
                improve my skills and knowledge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
