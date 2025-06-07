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

const page = ({ params }) => {
  const categoryID = params.categoryID;
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const response = await blogApi.getPostByCategoryID(categoryID);
        const blogsData = response.data;
        const publishedBlogs = blogsData.filter((blog) => blog.status === "published");
        setBlogs(publishedBlogs);
      } catch (err) {
        setError(err);
        console.log(error);
      }
      finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  return (
    <ReveloLayout>
      <Banner pageTitle={"Blogs"} />
      <section className="blog-list-page py-100 rel z-1">
        <div className="container">
          {loading ? <Loader /> : <div className="row">
            <div className="col-lg-8">
              {blogs.length === 0 && !loading ? (
    <p className="text-center">No Blogs Available</p>
  ): blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="blog-item style-three"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <div className="image">
                    <img src={blog.thumbnail} alt={blog.title} style={{ borderRadius: "20px" }} />
                  </div>
                  <div className="content">
                     <Link
                          href={`/blog-category/${blog.category_id}`}
                          className="category"
                        >
                          {capitalizeFirstLetter(blog.category_name)}
                        </Link>
                    <h5>
                      <Link href={`/blog-details/${blog.id}`}>{blog.title}</Link>
                    </h5>
                    <ul className="blog-meta">
                      <li>
                        <i className="far fa-calendar-alt" />{" "}
                        <a href="#">{new Date(blog.created_at).toLocaleDateString()}</a>
                      </li>
                    </ul>
                    <p>{blog.excerpt.substring(0, 100)}...</p>
                    <Link href={`/blog-details/${blog.id}`} className="theme-btn style-two style-three">
                      <span data-hover="Read More">Read More</span>
                      <i className="fal fa-arrow-right" />
                    </Link>
                  </div>
                </div>
              ))}
              {/* <ul
                className="pagination pt-15 flex-wrap"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <li className="page-item disabled">
                  <span className="page-link">
                    <i className="far fa-chevron-left" />
                  </span>
                </li>
                <li className="page-item active">
                  <span className="page-link">
                    1<span className="sr-only">(current)</span>
                  </span>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    2
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    3
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    ...
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    <i className="far fa-chevron-right" />
                  </a>
                </li>
              </ul> */}
            </div>
            <BlogSidebar />
          </div>}

        </div>
      </section>
    </ReveloLayout>
  );
};
export default page;
