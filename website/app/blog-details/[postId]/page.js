"use client";
import { blogApi } from "@/common/api";
import Banner from "@/components/Banner";
import BlogSidebar from "@/components/Blogsidebar";
import Loader from "@/components/loader";
import ReveloLayout from "@/layout/ReveloLayout";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";
import slugToTitle from "@/utility/slugToTitleConverter";
import Link from "next/link";
import { useEffect, useState } from "react";

const BlogDetailPage = ({ params }) => {
  const postId = params.postId;
  const [blogDetail, setBlogdetail] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogDetail(postId) {
      if (postId) {
        try {
          setLoading(true);
          const response = await blogApi.getPostById(postId);
          const blogDetailData = response.data;
          setBlogdetail(blogDetailData);
        } catch (err) {
          setError("Failed to load blog post.");
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchBlogDetail(postId);
  }, [postId]);

  return (
    <ReveloLayout insta>
      <Banner
        pageTitle={blogDetail?.title || "Loading..."}
        pageName={"Blog Details"}
      />
      <section className="blog-detaisl-page py-100 rel z-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {loading ? (
                <Loader />
              ) : blogDetail ? (
                <div
                  className="blog-details-content"
                  data-aos="fade-up"
                  data-aos-duration={1000}
                  data-aos-offset={50}
                >
                  <Link href={`/blog-category/${blogDetail.category_id}`} className="category">
                    {capitalizeFirstLetter(blogDetail.category_name)}
                  </Link>
                  <ul className="blog-meta mb-30">
                    <li>
                      <img
                        src="/assets/images/blog/admin.jpg"
                        alt="Admin"
                      />{" "}
                      <a href="#">{blogDetail.author}</a>
                    </li>
                    <li>
                      <i className="far fa-calendar-alt" />{" "}
                      <a href="#">
                        {new Date(blogDetail.created_at).toDateString()}
                      </a>
                    </li>
                  </ul>
                  <div
                    className="image mt-40 mb-30"
                    data-aos="fade-up"
                    data-aos-duration={1000}
                    data-aos-offset={50}
                  >
                    <img
                      src={blogDetail.thumbnail}
                      alt="Blog Details"
                    />
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: blogDetail.content }}
                  />
                  <div className="tag-share mb-50">
                    <div
                      className="item"
                      data-aos="fade-left"
                      data-aos-duration={1000}
                      data-aos-offset={50}
                    >
                      <h6>Tags </h6>
                      <div className="tag-coulds">
                        {blogDetail.tags?.map((tag, index) => (
                          <Link key={index} href="#">
                            {capitalizeFirstLetter(tag)}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div
                      className="item"
                      data-aos="fade-right"
                      data-aos-duration={1000}
                      data-aos-offset={50}
                    >
                      {/* <h6>Share </h6>
                      <div className="social-style-one">
                        <a href="#"><i className="fab fa-facebook-f" /></a>
                        <a href="#"><i className="fab fa-twitter" /></a>
                        <a href="#"><i className="fab fa-linkedin-in" /></a>
                        <a href="#"><i className="fab fa-instagram" /></a>
                      </div> */}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-danger">Blog post not found.</p>
              )}
            </div>
            <BlogSidebar />
          </div>
        </div>
      </section>
    </ReveloLayout>
  );
};

export default BlogDetailPage;
