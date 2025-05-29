"use client";
import { blogApi } from "@/common/api";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";
import Link from "next/link";
import { useState, useEffect } from "react";

const BlogSidebar = () => {
  const [blogsData, setBlogsData] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSidebarDetails() {
      try {
        setLoading(true);
        const responsePosts = await blogApi.getAllPosts();
        const responseCategories = await blogApi.getAllBlogCategories();
        const blogsData = responsePosts.data;
        const blogsCategoryData = responseCategories.data;
        setBlogsData(blogsData);
        setBlogCategories(blogsCategoryData);
      } catch (err) {
        setError(err);
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchSidebarDetails();
  }, []);

  return (
    <div className="col-lg-4 col-md-8 col-sm-10 rmt-75">
      <div className="blog-sidebar">
        <div
          className="widget widget-search"
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-offset={50}
        >
          <form action="#" className="default-search-form">
            <input type="text" placeholder="Search" required="" />
            <button type="submit" className="searchbutton far fa-search" />
          </form>
        </div>
        <div
          className="widget widget-category"
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-offset={50}
        >
          <h5 className="widget-title">Category</h5>
          <ul className="list-style-three">
            {blogCategories.length === 0 && !loading ? (
              <p className="text-center">No Categories Available</p>
            ) : (
				<>
				{blogCategories.length > 0 && (
					<li>
					  <Link href={`/blog`}>All</Link>
					</li>
				  )}
              {blogCategories.map((category) => (
                <li>
                  <Link href={`/blog-category/${category.id}`}>
                    {capitalizeFirstLetter(category.name)}
                  </Link>
                </li>
              ))}
			  </>
            )}
          </ul>
        </div>
        <div
          className="widget widget-news"
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-offset={50}
        >
          <h5 className="widget-title">Recent Blogs</h5>
          <ul>
            {blogsData.length === 0 && !loading ? (
              <p className="text-center">No Recents Blogs Available</p>
            ) : (
              blogsData
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((blog) => (
                  <li key={blog.id}>
                    <div className="image">
                      <img src={blog.thumbnail} alt={blog.title} />
                    </div>
                    <div className="content">
                      <h6>
                        <Link href={`/blog-details/${blog.id}`}>
                          {blog.title}
                        </Link>
                      </h6>
                      <span className="date">
                        <i className="far fa-calendar-alt" />{" "}
                        {new Date(blog.created_at).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </li>
                ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default BlogSidebar;
