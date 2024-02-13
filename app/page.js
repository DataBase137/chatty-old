"use client"

import { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";
import Navbar from "./navbar";
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import supabase from "../utils/supabase";
import Loading from "./loading";

const Page = () => {
  const router = useRouter();
  const scroll = useRef();
  const [noUser, setNoUser] = useState(false);
  const typewriterElement = useRef();

  const TypeWriter = function (txtElement, words, wait = 5000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  };

  TypeWriter.prototype.type = function () {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    };

    this.txtElement.innerHTML = `<span>${this.txt}<span></span></span>`;

    let typeSpeed = 250;

    if (this.isDeleting) {
      typeSpeed /= 2;
    };

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 1000;
    };

    setTimeout(() => this.type(), typeSpeed)
  };

  const init = () => {
    if (typewriterElement.current) {
      const txtElement = document.querySelector("#txt-type");
      const words = JSON.parse(txtElement.getAttribute("data-words"));
      const wait = txtElement.getAttribute("data-wait");
      new TypeWriter(txtElement, words, wait);
    } else {
      setTimeout(() => {
        init();
      }, 500);
    }
  };

  const userPromise = new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.auth.getUser();
    if (error) resolve(); else reject();
  });

  useEffect(() => {
    userPromise
      .then(() => setNoUser(true))
      .catch(() => router.push("/chat"));
    init();
  }, []);

  return (
    <>
      {noUser ?
        <div className={styles.container}>
          <Navbar />
          <div className={styles.downArrowContainer}>
            <FaChevronDown className={styles.downArrow} onClick={() => { scroll.current.scrollIntoView(true) }} />
          </div>
          <div className={styles.topLeft}>
            <div className={styles.topContent}>
              <span className={styles.txtType} ref={typewriterElement} id="txt-type" data-wait="2000" data-words='["Connect", "Meet", "Talk"]'><span></span></span>
              <p className={styles.slogan}>Contact <span>family</span>. Chat with <span>friends</span>. All with one click.</p>
              <button className={styles.btn} onClick={() => router.push("/signup")}>Sign Up</button>
            </div>
          </div>
          <div className={styles.topRight}>

          </div>
          <div className={styles.bottomLeft} ref={scroll}>

          </div>
          <div className={styles.bottomRight}>

          </div>
        </div>
        : <Loading />
      }
    </>
  );
}

export default Page;