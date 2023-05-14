import React, { useRef } from "react";
import { useScroll, motion } from "framer-motion";
import { LiIcon } from "./LiIcon";

const Details = ({ type, time, place, info }) => {
  const ref = useRef(null);
  return (
    <li
      ref={ref}
      className="my-8 first:mt-0 last:mb-0 w-[60%] mx-auto flex[flex-col items-center justify-between md:w-[80%]"
    >
      <LiIcon reference={ref} />
      <motion.div
        initial={{ y: 50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <h3 className="capitalize font-bold text-2xl sm:text-xl xs:text-lg">
          {type}&nbsp;
        </h3>
        <span className="capitalize font-medium text-dark/75 dark:text-light/75 xs:text-sm">
          {time} | {place}
        </span>
        <p className="font-medium w-full md:text-sm">{info}</p>
      </motion.div>
    </li>
  );
};

const Education = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });
  console.log(scrollYProgress);
  return (
    <div className="my-64">
      <h2 className="font-bold text-8xl mb-32 text-center md:text-6xl xs:text-4xl md:mb-16">
        Education
      </h2>
      <div ref={ref} className="w-[75%] mx-auto relative  lg:w-[90%] md:w-full">
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute left-9 top-0 w-[4px] h-full bg-dark origin-top dark:bg-light md:w-[2px] md:left-[30px] xs:left-[20px]"
        />

        <ul className="w-full flex flex-col items-start justify-between ml-4 xs:ml-2">
          <Details
            type="9-Months Open Source Application Development Scholarship"
            time="Oct 2022 - Present"
            place="Information Technology Institute (ITI)"
            info="I had the opportunity to gain valuable skills in open source application development and web development (9 Month). Through a rigorous curriculum and hands-on projects, I developed proficiency in programming languages such as Java and Python, and gained experience with modern web development frameworks such as React and Angular."
          />
          <Details
            type="Licentiate In Law"
            time="Jan 2016 - Oct 2020"
            place="Helwan University"
            info="Licentiate in Law is an academic degree that denotes the completion of a specialized undergraduate program in law. In the case of Helwan University, this degree program likely included coursework in various legal subjects such as civil law, criminal law, commercial law, constitutional law, and international law."
          />
        </ul>
      </div>
    </div>
  );
};

export default Education;
