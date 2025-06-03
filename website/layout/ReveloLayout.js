"use client";
import EmbedPopup from "@/components/popup/EmbedPopup";
import ImageView from "@/components/popup/ImageView";
import { roveloUtility } from "@/utility";
import { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import React from 'react';

const ReveloLayout = ({ children, header, footer, insta, sideBar }) => {
  useEffect(() => {
    roveloUtility.animation();
    roveloUtility.fixedHeader();
  }, []);

  return (
    <div className={`page-wrapper ${sideBar ? "for-sidebar-menu" : ""}`}>
      <EmbedPopup />
      <ImageView />
      <Header header={header} />
      <main>{children}</main>
      <Footer footer={footer} insta={insta} />
    </div>
  );
};

export default ReveloLayout;
