import React, { useRef } from "react";
import { useScroll, motion } from "framer-motion";
import { LiIcon } from "./LiIcon";

const Details = ({ postion, company, companyLink, time, address, work }) => {
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
          {postion}&nbsp;
          <a
            href={companyLink}
            target="_blank"
            className=" text-primary capitalize dark:text-primaryDark"
          >
            @{company}
          </a>
        </h3>
        <span className="capitalize font-medium text-dark/75 dark:text-light/75 xs:text-sm">
          {time} | {address}
        </span>
        <p className="font-medium w-full md:text-sm">{work}</p>
      </motion.div>
    </li>
  );
};

const Experience = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  return (
    <div className="my-64">
      <h2 className="font-bold text-8xl mb-32 text-center md:text-6xl xs:text-4xl md:mb-16">
        Experience
      </h2>
      <div ref={ref} className="w-[75%] mx-auto relative lg:w-[90%] md:w-full">
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute left-9 top-0 w-[4px] h-full bg-dark origin-top dark:bg-light md:w-[2px] md:left-[30px] xs:left-[20px]"
        />

        <ul className="w-full flex flex-col items-start justify-between ml-4 xs:ml-2 ">
          <Details
            postion="CO-FOUNDER AND OPERATIONS MANAGER"
            time="May 2018 - Oct 2019"
            address="Greek Campus, Cairo, Egypt"
            work="Managed team of 30+ employees, secured 500k EGP funding
from Falak Startup Accelerator, and delivered 10k+ orders while
expanding business"
            companyLink="/"
            company="Wint"
          />

          <Details
            postion="FRONTEND DEVELOPER (REMOTE JOB)"
            time="Jan 2018 - April 2018"
            address="Riyadh, Saudi Arabia"
            work="Built UIs for 10+ projects using HTML, CSS, SASS, jQuery, and JS is a notable achievement that demonstrates a strong proficiency in front-end web development. HTML is the foundation of any web page, and CSS is used to style and layout the content. SASS is a CSS preprocessor that makes it easier to write and manage complex CSS code. jQuery is a popular JavaScript library that simplifies many common tasks and interactions on a web page. JavaScript (JS) is a programming language that allows for dynamic and interactive web pages."
            companyLink="https://www.linkedin.com/company/imkan-solutions/"
            company="Imakn"
          />
        </ul>
      </div>
    </div>
  );
};

export default Experience;
