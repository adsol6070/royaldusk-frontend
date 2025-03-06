"use client";
import useClickOutside from "@/utility/useClickOutside";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Accordion } from "react-bootstrap";

const Menu = () => {
  return (
    <nav className="main-menu navbar-expand-lg">
      <Accordion>
        <div className="navbar-header">
          <div className="mobile-logo">
            <Link href="/">
              <img
                src="/assets/images/logos/rdusk-logo.png"
                alt="Logo"
                title="Logo"
              />
            </Link>
          </div>
          {/* Toggle Button */}
          <Accordion.Toggle
            as={"button"}
            type="button"
            className="navbar-toggle"
            eventKey="collapse"
          >
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </Accordion.Toggle>
        </div>
        <Accordion.Collapse
          eventKey="collapse"
          className="navbar-collapse  clearfix"
        >
          <ul className="navigation clearfix">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/tour-and-activities">Tour & Activites</Link>
            </li>
            {/* <li>
              <a href="gellery">Gallery</a>
            </li>
             */}
            <li>
              <Link href="/blog">blog</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </Accordion.Collapse>
      </Accordion>
    </nav>
  );
};

const Header = ({ header }) => {
  const sidebarClick = () =>
    document.querySelector("body").classList.toggle("side-content-visible");

  switch (header) {
    case 1:
      return <Header1 sidebarClick={sidebarClick} />;
    case 2:
      return <Header2 sidebarClick={sidebarClick} />;

    default:
      return <Header3 sidebarClick={sidebarClick} />;
  }
};
export default Header;

const Header1 = ({ sidebarClick }) => {
  const [toggleSearch, setToggleSearch] = useState(false);
  const domNode = useClickOutside(() => {
    setToggleSearch(false);
  });
  return (
    <Fragment>
      <header className="main-header header-one white-menu menu-absolute fixed-header">
        {/*Header-Upper*/}
        <div className="header-upper py-30 rpy-0">
          <div className="container-fluid clearfix">
            <div className="header-inner rel d-flex align-items-center">
              <div className="logo-outer">
                <div className="logo">
                  <Link href="/">
                    <img
                      src="/assets/images/logos/rdusk-logo.png"
                      alt="Logo"
                      title="Logo"
                    />
                  </Link>
                </div>
              </div>
              <div className="nav-outer mx-lg-auto ps-xxl-5 clearfix">
                {/* Main Menu */}
                <Menu />
                {/* Main Menu End*/}
              </div>
              {/* Nav Search */}
              <div className="nav-search">
                <button
                  className="far fa-search"
                  onClick={() => setToggleSearch(!toggleSearch)}
                />
                <form
                  action="#"
                  className={toggleSearch ? "" : "hide"}
                  ref={domNode}
                >
                  <input
                    type="text"
                    placeholder="Search"
                    className="searchbox"
                    required
                  />
                  <button
                    type="submit"
                    className="searchbutton far fa-search"
                  />
                </form>
              </div>
              {/* Menu Button */}
              <div className="menu-btns py-10">
                <Link href="" className="theme-btn style-two bgc-secondary">
                  <i className="fal fa-shopping-cart" />
                </Link>
                {/* menu sidbar */}
                <div className="menu-sidebar" onClick={() => sidebarClick()}>
                  <button className="bg-transparent">
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*End Header Upper*/}
      </header>
      <Sidebar sidebarClick={sidebarClick} />
    </Fragment>
  );
};

const Header2 = ({ sidebarClick }) => {
  const [activeMenu, setActiveMenu] = useState("");
  const [multiMenu, setMultiMenu] = useState("");
  const activeMenuSet = (value) =>
      setActiveMenu(activeMenu === value ? "" : value),
    activeLi = (value) =>
      value === activeMenu ? { display: "block" } : { display: "none" };
  const multiMenuSet = (value) =>
      setMultiMenu(multiMenu === value ? "" : value),
    multiMenuActiveLi = (value) =>
      value === multiMenu ? { display: "block" } : { display: "none" };

  return (
    <Fragment>
      <header className="main-header header-two">
        {/*Header-Upper*/}
        <div className="header-upper">
          <div className="container-fluid clearfix">
            <div className="header-inner rel d-flex align-items-center justify-content-between">
              <div className="logo-outer d-block">
                <div className="logo">
                  <Link href="/">
                    <img
                      src="/assets/images/logos/rdusk-logo.png"
                      alt="Logo"
                      title="Logo"
                    />
                  </Link>
                </div>
              </div>
              {/* Menu Button */}
              <div className="menu-btns py-10">
                {/* menu sidbar */}
                <div className="menu-sidebar" onClick={() => sidebarClick()}>
                  <button className="bg-transparent">
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*End Header Upper*/}
      </header>
      <section className="hidden-bar">
        <div className="inner-box">
          <div className="cross-icon" onClick={() => sidebarClick()}>
            <span className="fal fa-times" />
          </div>
          <div className="logo text-lg-center">
            <Link href="/">
              <img src="/assets/images/logos/rdusk-logo.png" alt="Logo" />
            </Link>
          </div>
          <hr className="my-40" />
          <ul className="sidebar-menu">
            <li className="dropdown current">
              <a href="#" onClick={() => activeMenuSet("home")}>
                Home
              </a>
              <ul style={activeLi("home")}>
                <li>
                  <Link href="/">Travel Agency</Link>
                </li>
                <li>
                  <Link href="index2">City Tou</Link>
                </li>
                <li>
                  <Link href="index3">Tour Package</Link>
                </li>
              </ul>
              <div
                className="dropdown-btn"
                onClick={() => activeMenuSet("home")}
              >
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li>
              <Link href="about">About</Link>
            </li>
            <li className="dropdown">
              <a href="#" onClick={() => activeMenuSet("Tours")}>
                Tours
              </a>
              <ul style={activeLi("Tours")}>
                <li>
                  <Link href="tour-list">Tour List</Link>
                </li>
                <li>
                  <Link href="tour-grid">Tour Grid</Link>
                </li>
                <li>
                  <Link href="tour-sidebar">Tour Sidebar</Link>
                </li>
                <li>
                  <Link href="tour-details">Tour Details</Link>
                </li>
                <li>
                  <Link href="tour-guide">Tour Guide</Link>
                </li>
              </ul>
              <div
                className="dropdown-btn"
                onClick={() => activeMenuSet("Tours")}
              >
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li className="dropdown">
              <a href="#" onClick={() => activeMenuSet("Destinations")}>
                Destinations
              </a>
              <ul style={activeLi("Destinations")}>
                <li>
                  <Link href="destination1">Destination 01</Link>
                </li>
                <li>
                  <Link href="destination2">Destination 02</Link>
                </li>
                <li>
                  <Link href="destination-details">Destination Details</Link>
                </li>
              </ul>
              <div
                className="dropdown-btn"
                onClick={() => activeMenuSet("Destinations")}
              >
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li className="dropdown">
              <a href="#" onClick={() => activeMenuSet("Pages")}>
                Pages
              </a>
              <ul style={activeLi("Pages")}>
                <li>
                  <Link href="pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="faqs">faqs</Link>
                </li>
                <li className="dropdown">
                  <a href="#">Gallery</a>
                  <ul style={multiMenuActiveLi("Gallery")}>
                    <li>
                      <Link href="gellery-grid">Gallery Grid</Link>
                    </li>
                    <li>
                      <Link href="gellery-slider">Gallery Slider</Link>
                    </li>
                  </ul>
                  <div
                    className="dropdown-btn"
                    onClick={() => multiMenuSet("Gallery")}
                  >
                    <span className="far fa-angle-down" />
                  </div>
                </li>
                <li className="dropdown">
                  <a href="#">products</a>
                  <ul style={multiMenuActiveLi("products")}>
                    <li>
                      <Link href="shop">Our Products</Link>
                    </li>
                    <li>
                      <Link href="product-details">Product Details</Link>
                    </li>
                  </ul>
                  <div
                    className="dropdown-btn"
                    onClick={() => multiMenuSet("products")}
                  >
                    <span className="far fa-angle-down" />
                  </div>
                </li>
                <li>
                  <Link href="contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="404">404 Error</Link>
                </li>
              </ul>
              <div
                className="dropdown-btn"
                onClick={() => activeMenuSet("Pages")}
              >
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li className="dropdown">
              <a href="#" onClick={() => activeMenuSet("blog")}>
                blog
              </a>
              <ul style={activeLi("blog")}>
                <li>
                  <Link href="blog">blog List</Link>
                </li>
                <li>
                  <Link href="blog-details">blog details</Link>
                </li>
              </ul>
              <div
                className="dropdown-btn"
                onClick={() => activeMenuSet("blog")}
              >
                <span className="far fa-angle-down" />
              </div>
            </li>
          </ul>
          <Link href="" className="theme-btn style-two bgc-secondary">
            <i className="fal fa-shopping-cart" />
          </Link>
          <hr className="mb-65" />
          <h6>Social Media</h6>
          {/*Social Icons*/}
          <div className="social-style-two mt-10">
            <Link href="contact">
              <i className="fab fa-twitter" />
            </Link>
            <Link href="contact">
              <i className="fab fa-facebook-f" />
            </Link>
            <Link href="contact">
              <i className="fab fa-instagram" />
            </Link>
            <a href="#">
              <i className="fab fa-pinterest-p" />
            </a>
          </div>
        </div>
      </section>

      <div className="form-back-drop" onClick={() => sidebarClick()} />
    </Fragment>
  );
};

const Header3 = ({ sidebarClick }) => {
  return (
    <Fragment>
      <header className="main-header header-one">
        {/*Header-Upper*/}
        <div className="header-upper bg-white py-30 rpy-0">
          <div className="container-fluid clearfix">
            <div className="header-inner rel d-flex align-items-center">
              <div className="logo-outer">
                <div className="logo">
                  <Link href="/">
                    <img
                      src="/assets/images/logos/rdusk-logo.png"
                      alt="Logo"
                      title="Logo"
                      width={160}
                    />
                  </Link>
                </div>
              </div>
              <div className="nav-outer mx-lg-auto ps-xxl-5 clearfix">
                {/* Main Menu */}
                <Menu />
                {/* Main Menu End*/}
              </div>
              {/* Menu Button */}
              <div className="menu-btns py-10">
                <Link href="" className="theme-btn p-2 style-one bgc-secondary">
                  <i className="fal fa-shopping-cart m-0" />
                </Link>
                {/* menu sidbar */}
                <div>
                  <button
                    className="bg-transparent"
                    onClick={() => sidebarClick()}
                  >
                    <i className="fal fa-user" /> Log In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*End Header Upper*/}
      </header>
      <Sidebar sidebarClick={sidebarClick} />
    </Fragment>
  );
};

const Sidebar = ({ sidebarClick }) => {
  // State to toggle between login and signup forms
  const [isLogin, setIsLogin] = useState(true);

  // Toggle form view
  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <Fragment>
      {/* Form Backdrop */}
      <div className="form-back-drop" onClick={sidebarClick} />
      {/* Hidden Sidebar */}
      <section className="hidden-bar">
        <div className="inner-box text-center">
          {/* Close Icon */}
          <div className="cross-icon" onClick={sidebarClick}>
            <span className="fa fa-times" />
          </div>
          {/* Title */}
          <div className="title">
            <h4>{isLogin ? "Login" : "Sign Up"}</h4>
          </div>

          {/* Form */}
          <div className="form-container">
            <form method="post">
              {isLogin ? (
                // Login Form
                <>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="theme-btn style-two">
                      <span data-hover="Login">Login</span>
                      <i className="fal fa-arrow-right" />
                    </button>
                  </div>
                  <p className="form-footer">
                    Don't have an account?{" "}
                    <span
                      onClick={toggleForm}
                      className="form-switcher"
                      style={{
                        cursor: "pointer",
                        color: "#fff",
                        margin: "5px",
                      }}
                    >
                      Sign Up
                    </span>
                  </p>
                </>
              ) : (
                // Signup Form
                <>
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="theme-btn style-two">
                      <span data-hover="Sign Up">Sign Up</span>
                      <i className="fal fa-arrow-right" />
                    </button>
                  </div>
                  <p className="form-footer">
                    Already have an account?{" "}
                    <span
                      onClick={toggleForm}
                      className="form-switcher"
                      style={{
                        cursor: "pointer",
                        color: "#fff",
                        margin: "5px",
                      }}
                    >
                      Login
                    </span>
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </Fragment>
  );
};
