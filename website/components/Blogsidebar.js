"use client";
import { blogApi } from "@/common/api";
import Link from "next/link";
import { useState, useEffect } from "react";

const BlogSidebar = () => {
	const [blogsData, setBlogsData] = useState([]);
	const [blogCategories, setBlogCategories] = useState([]);
	const [error, setError] = useState('');
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
			}
			finally {
				setLoading(false);
			}
		}

		fetchSidebarDetails();
	}, []);

	console.log("blog data", blogsData);

	return (
		<div className="col-lg-4 col-md-8 col-sm-10 rmt-75">
			<div className="blog-sidebar">
				<div
					className="widget widget-search"
					data-aos="fade-up"
					data-aos-duration={1500}
					data-aos-offset={50}
				>
					<form action="#" className="default-search-form">
						<input type="text" placeholder="Search" required="" />
						<button
							type="submit"
							className="searchbutton far fa-search"
						/>
					</form>
				</div>
				<div
					className="widget widget-category"
					data-aos="fade-up"
					data-aos-duration={1500}
					data-aos-offset={50}
				>
					<h5 className="widget-title">Category</h5>
					<ul className="list-style-three">
						{
							blogCategories.map((category) => (
								<li>
									<Link href="blog">{category.name}</Link>
								</li>
							))
						}
					</ul>
				</div>
				<div
					className="widget widget-news"
					data-aos="fade-up"
					data-aos-duration={1500}
					data-aos-offset={50}
				>
					<h5 className="widget-title">Recent Blogs</h5>
					<ul>
						{blogsData.map((blog) => (
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
											year: "numeric"
										})}
									</span>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};
export default BlogSidebar;
