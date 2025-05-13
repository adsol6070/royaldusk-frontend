"use client";
import { blogApi } from "@/common/api";
import Banner from "@/components/Banner";
import BlogSidebar from "@/components/Blogsidebar";
import Loader from "@/components/loader";
import SkeletonLoader from "@/components/SkeletonLoader";
import ReveloLayout from "@/layout/ReveloLayout";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await blogApi.getAllPosts();
        const blogsData = response.data;
        const publishedBlogs = blogsData.filter((blog) => blog.status === "published");
        setBlogs(publishedBlogs);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to fetch blogs.");
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  return (
    <ReveloLayout insta>
      <Banner pageTitle={"Blogs"} />
      <section className="blog-list-page py-100 rel z-1">
        <div className="container">
          {loading ? (
              <SkeletonLoader count={5} width="100%" height="120px" />
          ) : (
            <div className="row">
              <div className="col-lg-8">
                {blogs.length === 0 ? (
                  <p className="text-center">No Blogs Available</p>
                ) : (
                  blogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="blog-item style-three"
                      data-aos="fade-up"
                      data-aos-duration={1500}
                      data-aos-offset={50}
                    >
                      <div className="image">
                        <img
                          src={blog.thumbnail}
                          alt={blog.title}
                          style={{ borderRadius: "20px" }}
                        />
                      </div>
                      <div className="content">
                        <Link
                          href={`/blog-category/${blog.categoryID}`}
                          className="category"
                        >
                          {capitalizeFirstLetter(blog.category.name)}
                        </Link>
                        <h5>
                          <Link href={`/blog-details/${blog.id}`}>
                            {blog.title}
                          </Link>
                        </h5>
                        <ul className="blog-meta">
                          <li>
                            <i className="far fa-calendar-alt" />
                            <a href="#">
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </a>
                          </li>
                        </ul>
                        <p>
                        {blog.excerpt?.length > 150
                            ? blog.excerpt.slice(0, 150) + "..."
                            : blog.excerpt}
                        </p>
                        <Link
                          href={`/blog-details/${blog.id}`}
                          className="theme-btn style-two style-three"
                        >
                          <span data-hover="Read More">Read More</span>
                          <i className="fal fa-arrow-right" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <BlogSidebar />
            </div>
          )}
        </div>
      </section>
    </ReveloLayout>
  );
};

export default Page;
