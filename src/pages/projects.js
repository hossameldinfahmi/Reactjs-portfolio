import React from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import AnimatedText from "@/components/AnimatedText";
import Link from "next/link";
import Image from "next/image";
import project3 from "../../public/images/projects/ciseco.png";
import project2 from "../../public/images/projects/hekayat.png";
import project1 from "../../public/images/projects/ertyad.png";
import project4 from "../../public/images/projects/chatapp.jpg";
import project5 from "../../public/images/projects/bokary.png";
import project6 from "../../public/images/projects/maaleem.png";
import project7 from "../../public/images/projects/mnaafee.png";
import project8 from "../../public/images/projects/ounce.png";
import project9 from "../../public/images/projects/asaarnaa.png";

import { GithubIcon } from "@/components/Icons";
import { motion } from "framer-motion";
import TranstionEffect from "@/components/TranstionEffect";

const FramerImage = motion(Image);

const FeatureProject = ({ type, title, summary, img, link, githubLink }) => {
  return (
    <article className="w-full flex items-center justify-between rounded-3xl border border-solid border-dark bg-light shadow-2xl p-12 relative rounded-br-2xl dark:bg-dark  dark:border-light lg:flex-col lg:p-8 xs:rounded-2xl xs:rounded-br-3xl xs:p-4">
      <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2.5rem] bg-dark rounded-br-3xl dark:bg-light xs:-right-2 sm:h-[102%] xs:w-full xs:rounded-[1.5rem]" />

      <Link
        href={link}
        target="_blank"
        className="w-full cursor-pointer overflow-hidden rounded-lg lg:w-full "
      >
        <FramerImage
          src={img}
          alt={title}
          className="w-full h-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      </Link>

      <div className="w-full flex flex-col items-start justify-between pl-6 lg:w-full lg:pl-0 lg:pt-6">
        <span className="text-primary font-medium text-xl dark:text-primaryDark xs:text-base">
          {type}
        </span>
        <Link
          href={link}
          target="_blank"
          className="hover:underline underline-offset-2 "
        >
          <h2 className="my-2 w-full text-left font-bold text-4xl dark:text-light sm:text-sm">
            {title}
          </h2>
        </Link>
        <p className="my-2 font-medium text-dark dark:text-light"></p>
        <p className="font-medium text-dark dark:text-light sm:text-sm ">
          {summary}
        </p>
        <div className="mt-2 flex items-center ">
          <Link href={githubLink} target="_blank" className="w-10">
            <GithubIcon />
          </Link>
          <Link
            href={link}
            target="_blank"
            className="ml-4 rounded-lg bg-dark text-light p-2 px-6 text-lg font-semibold dark:bg-light dark:text-dark sm:px-4 sm:text-base "
          >
            Visit Project
          </Link>
        </div>
      </div>
    </article>
  );
};

const Project = ({ type, title, img, link, githubLink }) => {
  return (
    <article
      className="w-full flex flex-col items-center justify-center rounded-2xl border border-solid border-dark bg-light p-6 relative  dark:bg-dark
        dark:border-light xs:p-4 "
    >
      <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2rem] bg-dark rounded-br-3xl dark:bg-light md:-right-2 md:w-[101%] xs:h-[102%] xs:rounded-[1.5rem]" />

      <Link
        href={link}
        target="_blank"
        className="w-full cursor-pointer overflow-hidden rounded-lg"
      >
        <FramerImage
          src={img}
          alt={title}
          className="w-full h-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          property
          sizes="(max-width:768)100vw,
                (max-width:1200px)50vw,
                50vw"
        />
      </Link>

      <div className="w-full flex flex-col items-start justify-between mt-4 ">
        <span className="text-primary font-medium text-xl dark:text-primaryDark lg:text-lg md:text-base">
          {type}
        </span>
        <Link
          href={link}
          target="_blank"
          className="hover:underline underline-offset-2"
        >
          <h2 className="my-2 w-full text-left font-bold text-4xl lg:text-2xl">
            {title}
          </h2>
        </Link>
        <p className="my-2 font-medium text-dark"></p>

        <div className="w-full mt-2 flex items-center justify-between ">
          <Link
            href={link}
            target="_blank "
            className="  text-lg font-semibold underline md:text-base"
          >
            Visit
          </Link>
          <Link href={githubLink} target="_blank" className="w-8 md:w-6">
            <GithubIcon />
          </Link>
        </div>
      </div>
    </article>
  );
};

const projects = () => {
  return (
    <>
      <Head>
        <title>Hossam Fahmy | Projects Page</title>
        <meta name="description" content="About Hossam Fahmy"></meta>
      </Head>
      <TranstionEffect />
      <main className="w-full mb-16 flex flex-col items-center justify-center dark:text-light">
        <Layout className="pt-16">
          <AnimatedText
            text="Code beyond knowledge limits."
            className="mb-16 lg:!text-7xl sm:mb-8 sm:!text-6xl xs:!text-4xl "
          />

          <div className="grid grid-cols-12 gap-24 gap-y-32 xl:gap-16 lg:gap-x-8 md:gap-y-24 sm:gap-x-0 ">
            <div className="col-span-12">
              {" "}
              <FeatureProject
                title="E-commerce Web App - Django, Reactjs"
                img={project3}
                summary="A
           An ecommerce app built with Django, ReactJS, and Tailwind CSS is a powerful solution for building an online store that is both functional and visually appealing. "
                link="https://ciseco-e.netlify.app"
                githubLink="https://github.com/hossameldinfahmi/ReactJS-Ecommerce-FrontEnd.git"
                type="FullStack Web App"
              />
            </div>
            <div className="col-span-12">
              {" "}
              <FeatureProject
                title="Topsonmessages - MERN WEB APP"
                img={project4}
                summary="Chat application using the MERN stack (Mongo, Express, React, Node) and Web Sockets! The app features both direct messaging and group conversation capabilities, as well as notifications thanks to Web Sockets."
                link="https://www.linkedin.com/feed/update/urn:li:activity:7061271568454234112/"
                githubLink="https://github.com/hossameldinfahmi/ChattingApp--server"
                type="MERN Web App"
              />
            </div>
            <div className="col-span-12">
              {" "}
              <FeatureProject
                title="Goodreads Clone Web App - MEAN Stack"
                img={project5}
                summary="
Goodreads Clone App built using the MEAN stack and hosted on GitHub. This app allows users to create an account, search and add books to their reading list, view and review books, and interact with other users through comments and book recommendations."
                link="https://bookary.netlify.app/"
                githubLink="https://github.com/hossameldinfahmi/MEAN-Good-Reads-App"
                type="MEAN Web App"
              />
            </div>
            <div className="col-span-6 sm:col-span-12">
              <Project
                title="Hekayat"
                img={project2}
                link="https://hekayat.netlify.app"
                githubLink="https://github.com/hossameldinfahmi"
                type="Frontend Web App"
              />
            </div>
            <div className="col-span-6 sm:col-span-12">
              <Project
                title="Ertiad "
                img={project1}
                link="https://ertiad.netlify.app"
                githubLink="https://github.com/hossameldinfahmi"
                type="Frontend Web App"
              />
            </div>
            <div className="col-span-6 sm:col-span-12">
              <Project
                title="manafae"
                img={project7}
                link="https://manafae.netlify.app/"
                githubLink="https://github.com/hossameldinfahmi"
                type="Frontend Web App"
              />
            </div>{" "}
            <div className="col-span-6 sm:col-span-12">
              <Project
                title="maleem"
                img={project6}
                link="https://maleem.netlify.app/"
                githubLink="https://github.com/hossameldinfahmi"
                type="Frontend Web App"
              />
            </div>{" "}
            <div className="col-span-6 sm:col-span-12">
              <Project
                title="Asaarna"
                img={project9}
                link="https://asaarna.netlify.app"
                githubLink="https://github.com/hossameldinfahmi"
                type="Frontend Web App"
              />
            </div>{" "}
            <div className="col-span-6 sm:col-span-12">
              <Project
                title="Ounce"
                img={project8}
                link="https://ounce.netlify.app/"
                githubLink="https://github.com/hossameldinfahmi"
                type="Frontend Web App"
              />
            </div>
          </div>
        </Layout>
      </main>
    </>
  );
};

export default projects;
