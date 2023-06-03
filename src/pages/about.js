/* eslint-disable react/no-unescaped-entities */
import AnimatedText from "@/components/AnimatedText";
import Layout from "@/components/Layout";
import Head from "next/head";
import Image from "next/image";
import React, { useRef, useEffect } from "react";
import profilePic from "../../public/images/profile/developer-pic-2.jpg";
import { useMotionValue, useSpring, useInView } from "framer-motion";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import TranstionEffect from "@/components/TranstionEffect";
import Certificates from "@/components/Certificates";

const AnimatedNumbers = ({ value }) => {
  const ref = useRef(null);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 3000 });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current && latest.toFixed(0) <= value) {
        ref.current.textContent = latest.toFixed(0);
      }
    });
  }, [springValue, value]);

  return <span ref={ref}></span>;
};

const about = () => {
  return (
    <>
      <Head>
        <title>Hossam Fahmy | About Page</title>
        <meta name="description" content="About Hossam Fahmy"></meta>
      </Head>
      <TranstionEffect />

      <main className="flex w-full flex-col items-center justify-center dark:text-light relative ">
        <Layout className="pt-16  ">
          <div className=" w-44 overflow-hidden rounded-full mb-6">
            <Image src={profilePic} alt="" />
          </div>
          <AnimatedText
            text="Code with passion, create purpose."
            className="mb-16 lg:!text-7xl sm:!text-6xl xs:!text-2xl sm:mb-8"
          />
          <div className="grid w-full grid-cols-8 gap-16 sm:gap-8">
            <div className="col-span-12 flex flex-col items-start justify-start xl:col-span-4  md:order-2 md:col-span-8">
              <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">
                About Me
              </h2>
              <p className="font-medium">
                - I am a passionate Software Engineer who is currently learning
                on a Software Engineer scholarship at ITI. I have always been
                fascinated by the power of the web to connect people and provide
                access to information. As a result, I decided to pursue a career
                in web development, with a focus on creating intuitive and
                engaging user experiences.
              </p>
              <p className="font-medium my-4">
                - At ITI, I am gaining valuable skills and knowledge in open
                source application development and web development. I am
                particularly excited to learn modern web development frameworks
                such as React and Angular, and to explore the latest trends and
                best practices in the field.
              </p>
            </div>
          </div>
          <Skills />
          <Experience />
          <Education />
          <Certificates />
        </Layout>
      </main>
    </>
  );
};

export default about;
