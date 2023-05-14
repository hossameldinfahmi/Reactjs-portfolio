import AnimatedText from "@/components/AnimatedText";
import Layout from "@/components/Layout";
import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import article1 from "../../public/images/articles/article1.jpg";
import { motion, useMotionValue } from "framer-motion";
import article2 from "../../public/images/articles/article1.jpg";
import article3 from "../../public/images/articles/article1.jpg";
import article4 from "../../public/images/articles/article1.jpg";
import TranstionEffect from "@/components/TranstionEffect";

const FramerImage = motion(Image);

const MovingImage = ({ title, img, link }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const imgRef = useRef(null);

  function handleMouse(event) {
    imgRef.current.style.display = "inline-block";
    x.set(event.pageX);
    y.set(-10);
  }

  function handleMouseLeave(event) {
    imgRef.current.style.display = "none";
    x.set(0);
    y.set(0);
    console.log(event.pageX);
  }
  return (
    <Link
      href={link}
      target="_blank"
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className=" capitalize text-xl font-semibold hover:underline">
        {title}
      </h2>
      <FramerImage
        style={{ x: x, y: y }}
        whileInView={{ opacity: 1, transtion: { duration: 0.2 } }}
        initial={{ opacity: 0 }}
        ref={imgRef}
        src={img}
        alt={title}
        className="w-96 h-auto hidden absolute rounded-lg z-10 md:!hidden"
      />
    </Link>
  );
};
const Article = ({ img, title, date, link }) => {
  return (
    <motion.li
      initial={{ y: 200 }}
      whileInView={{ y: 0, transtion: { duration: 6000, ease: "easeInOut" } }}
      viewport={{ once: true }}
      className="relative w-full p-4 py-6 my-4 rounded-xl flex items-center justify-between bg-light text-dark first:mt-0 border border-solid border-dark border-r-4 border-b-4 dark:border-light dark:bg-dark dark:text-light sm:flex-col"
    >
      <MovingImage title={title} img={img} link={link} />
      <span className="text-primary font-semibold pl-4 dark:text-primaryDark sm:self-start sm:pl-0 xs:text-sm">
        {date}
      </span>
    </motion.li>
  );
};

const FeatureArticle = ({ img, title, time, summary, link }) => {
  return (
    <motion.li
      initial={{ y: 200 }}
      whileInView={{ y: 0, transtion: { duration: 6000, ease: "easeInOut" } }}
      viewport={{ once: true }}
      className="col-span-1 w-full p-4 bg-light border border-solid border-dark rounded-2xl relative  dark:border-light dark:bg-dark"
    >
      <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2rem] bg-dark rounded-br-3xl" />

      <Link
        href={link}
        target="_blank"
        className="w-full cursor-pointer overflow-hidden rounded-lg inline-block "
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
                33vw"
        />
      </Link>
      <Link href={link} target="_blank">
        <h2 className="capitalize text-2xl font-bold my-2 hover:underline  mt-4 xs:text-lg">
          {title}
        </h2>
      </Link>
      <p className="text-sm mb-2">{summary}</p>
      <span className="text-primary font-semibold dark:text-primaryDark">
        {time}
      </span>
    </motion.li>
  );
};
const Articles = () => {
  return (
    <>
      <Head>
        <title>Hossam Fahmy | About Page</title>
        <meta name="description" content="About Hossam Fahmy"></meta>
      </Head>
      <TranstionEffect />
      <main className="w-full mb-16 flex flex-col items-center justify-center overflow-hidden dark:text-light">
        <Layout className="pt-16">
          <AnimatedText
            text="Words Can Change The World!"
            className="mb-16  lg:!text-7xl sm:mb-8 sm:!text-6xl xs:!text-4xl "
          />
          <ul className="grid grid-cols-2 gap-16 md:grid-cols-1 lg:gap-8 md:gap-y-16">
            <FeatureArticle
              title="Introduction to TypeScript: Exploring the Benefits and Basics of Strongly Typed JavaScript
"
              summary="But what do you mean by superset? 🤔

A superset in programming is a language that inherits all the features and functionalities of another language, while also introducing new ones. TypeScript falls under this category, as it builds on top of JavaScript by adding new features like 'static typing'. Static typing helps detect errors in your code earlier and makes it easier to understand how different parts of your program work together. It's like a wrapper that enhances JavaScript's capabilities."
              time="- 9 min read"
              link="https://hossamfahmi.hashnode.dev/introduction-to-typescript-exploring-the-benefits-and-basics-of-strongly-typed-javascript"
              img={article1}
            />

            <FeatureArticle
              title="Introduction to TypeScript: Exploring the Benefits and Basics of Strongly Typed JavaScript
"
              summary="But what do you mean by superset? 🤔

A superset in programming is a language that inherits all the features and functionalities of another language, while also introducing new ones. TypeScript falls under this category, as it builds on top of JavaScript by adding new features like 'static typing'. Static typing helps detect errors in your code earlier and makes it easier to understand how different parts of your program work together. It's like a wrapper that enhances JavaScript's capabilities."
              time="- 9 min read"
              link="https://hossamfahmi.hashnode.dev/introduction-to-typescript-exploring-the-benefits-and-basics-of-strongly-typed-javascript"
              img={article2}
            />
          </ul>
          <h2 className="font-bold text-4xl w-full text-center mt-32">
            All Articales
          </h2>
          <Article
            title="Introduction to TypeScript: Exploring the Benefits and Basics of Strongly Typed JavaScript"
            img={article3}
            date="March 22, 2022"
            link="https://hossamfahmi.hashnode.dev/introduction-to-typescript-exploring-the-benefits-and-basics-of-strongly-typed-javascript"
          />
          <Article
            title="Introduction to TypeScript: Exploring the Benefits and Basics of Strongly Typed JavaScript"
            img={article4}
            date="March 22, 2022"
            link="https://hossamfahmi.hashnode.dev/introduction-to-typescript-exploring-the-benefits-and-basics-of-strongly-typed-javascript"
          />
        </Layout>
      </main>
    </>
  );
};

export default Articles;
