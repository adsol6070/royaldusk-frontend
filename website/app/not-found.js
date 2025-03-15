import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";

const page = () => {
  return (
    <ReveloLayout>
      <section className="error-area pt-70 pb-100 rel z-1">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-xl-5 col-lg-6">
              <div
                className="error-content rmb-55"
                data-aos="fade-left"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <h1>Oops!</h1>
                <div className="section-title mt-15 mb-25">
                  <h2>Page Not Found</h2>
                </div>
                <p>
                The page you're looking for might have been moved, renamed, or doesn’t exist. Let’s get you back on track—head to the homepage or explore our latest updates!
                </p>
                 <Link href="/"
                    className="theme-btn bgc-secondary style-two"
                  >Go to Home</Link>
              </div>
            </div>
            <div className="col-xl-5 col-lg-6">
              <div
                className="error-images"
                data-aos="fade-right"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <img src="/assets/images/newsletter/404.png" alt="404 Error" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </ReveloLayout>
  );
};
export default page;
