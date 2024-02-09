"use client"

import { useEffect, useState, useRef, Suspense } from "react";
import * as styles from "./page.module.css";
import Navbar from "./navbar";
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import supabase from "../utils/supabase";


const Page = () => {
  const router = useRouter();
  let user;

  const userPromise = new Promise(async (resolve, reject) => {
    const { data: user, error } = await supabase.auth.getUser();
    if (error) {
        resolve(user);
    } else {
        router.push("/chat");
    }
  });

  userPromise.then((userObj) => user = userObj)

  const TypeWriter = function (txtElement, words, wait = 5000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  };

  // Type Method
  TypeWriter.prototype.type = function () {
    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];

    // Check if deleting
    if (this.isDeleting) {
      // Remove char
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      // Add char
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    };

    // Insert txt into element
    this.txtElement.innerHTML = `<span>${this.txt}<span></span></span>`;

    // Initial Type Speed
    let typeSpeed = 250;

    if (this.isDeleting) {
      typeSpeed /= 2;
    };

    // If word is complete
    if (!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait;
      // Set delete to true
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing
      typeSpeed = 1000;
    };

    setTimeout(() => this.type(), typeSpeed)
  };

  // Init App
  const init = () => {
    const txtElement = document.querySelector("#txt-type");
    const words = JSON.parse(txtElement.getAttribute("data-words"));
    const wait = txtElement.getAttribute("data-wait");
    // Init TypeWriter
    new TypeWriter(txtElement, words, wait);
  };


  useEffect(() => {
    init();
  }, []);

  return (
    <div className={styles.container}>
        <Navbar />
        <div className={styles.downArrowContainer}>
          <FaChevronDown className={styles.downArrow} />
        </div>
        <div className={styles.topLeft}>
          <div className={styles.topContent}>
            <span className={styles.txtType} id="txt-type" data-wait="2000" data-words='["Connect", "Meet", "Talk"]'><span></span></span>
            <p className={styles.slogan}>Contact <span>family</span>. Chat with <span>friends</span>. All with one click.</p>
            <button className={styles.btn} onClick={() => router.push("/signup")}>Sign Up</button>
          </div>
        </div>
        <div className={styles.topRight}>
          <svg className={styles.svg} width="390" height="90" viewBox="0 0 390 90" ><circle className={styles.svgShape} cx="345" cy="45" r="45" /><circle className={styles.svgShape} cx="45" cy="45" r="45" /><rect className={styles.svgShape} width="300" height="90" x="45" /></svg>
        </div>
    </div>
  );
}

export default Page;