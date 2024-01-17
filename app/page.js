"use client"

import { useEffect, useState, useRef } from "react";
import * as styles from "./page.module.css";
import Navbar from "./navbar";
import { FaChevronDown } from "react-icons/fa";

const Page = () => {
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
    <>
      <Navbar />
      <div className={styles.homeContainer}>
        <div className={styles.downArrowContainer}>
          <FaChevronDown className={styles.downArrow} />
        </div>
        <div className={styles.topLeft}>
          <div className={styles.topContent}>
            <span className={styles.txtType} id="txt-type" data-wait="2000" data-words='["Connect", "Meet", "Talk"]'><span></span></span>
            <p className={styles.slogan}>Contact <span>family</span>. Find new <span>friends</span>. All with one click.</p>
            <button className={styles.btn}>Learn More</button>
          </div>
        </div>
        <div className={styles.topRight}>
        </div>
      </div>
    </>
  );
}

export default Page;