"use client";

import { blogApi } from "@/common/api";
import ReveloLayout from "@/layout/ReveloLayout";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import SkeletonLoader from "@/components/SkeletonLoader";

const PlatformContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  background: white;
  border-bottom: 1px solid #fed7aa;
  padding: 20px 0;
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px 0;
  }

  p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }
`;

const BlogStats = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
  }

  .stat-item {
    text-align: center;

    .number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f8853d;
      display: block;
    }

    .label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const BlogsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const BlogCard = styled.article`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &:hover {
    border-color: #f8853d;
    box-shadow: 0 4px 20px rgba(248, 133, 61, 0.15);
  }
`;

const BlogImage = styled.div`
  position: relative;
  height: 250px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  .category-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    background: rgba(248, 133, 61, 0.95);
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    backdrop-filter: blur(10px);
    transition: background 0.2s ease;

    &:hover {
      background: rgba(230, 116, 40, 1);
      color: white;
      text-decoration: none;
    }
  }

  .date-badge {
    position: absolute;
    bottom: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 12px;
    backdrop-filter: blur(10px);
  }
`;

const BlogContent = styled.div`
  padding: 24px;

  .blog-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 12px 0;
    line-height: 1.4;

    a {
      color: inherit;
      text-decoration: none;

      &:hover {
        color: #f8853d;
      }
    }
  }

  .blog-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    font-size: 13px;
    color: #64748b;

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;

      i {
        color: #f8853d;
        font-size: 12px;
      }
    }
  }

  .blog-excerpt {
    color: #64748b;
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 20px 0;
  }

  .read-more {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #f8853d;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      color: #e67428;
      text-decoration: none;
      transform: translateX(2px);
    }

    i {
      font-size: 12px;
      transition: transform 0.2s ease;
    }

    &:hover i {
      transform: translateX(2px);
    }
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 120px;
  height: fit-content;

  @media (max-width: 1024px) {
    position: static;
    order: -1;
  }
`;

const SidebarCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #fed7aa;
  overflow: hidden;
  margin-bottom: 20px;

  .card-header {
    padding: 20px;
    border-bottom: 1px solid #fef7f0;
    background: #fef7f0;

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
  }

  .card-content {
    padding: 20px;
  }
`;

const SearchBox = styled.div`
  position: relative;

  input {
    width: 100%;
    padding: 12px 16px 12px 40px;
    border: 1px solid #fed7aa;
    border-radius: 8px;
    font-size: 14px;
    background: #fef7f0;

    &:focus {
      outline: none;
      border-color: #f8853d;
      background: white;
      box-shadow: 0 0 0 3px rgba(248, 133, 61, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #f8853d;
    font-size: 14px;
  }
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      color: #64748b;
      text-decoration: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover {
        background: #fef7f0;
        color: #f8853d;
        text-decoration: none;
      }

      &.active {
        background: #f8853d;
        color: white;
      }

      .count {
        font-size: 12px;
        color: #94a3b8;
        background: #f1f5f9;
        padding: 2px 6px;
        border-radius: 4px;
      }

      &.active .count,
      &:hover .count {
        background: rgba(255, 255, 255, 0.2);
        color: inherit;
      }
    }
  }
`;

const RecentPostsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  li {
    display: flex;
    gap: 12px;
    padding-bottom: 16px;
    border-bottom: 1px solid #fef7f0;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .post-image {
      flex-shrink: 0;
      width: 60px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .post-content {
      flex: 1;
      min-width: 0;

      .post-title {
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        margin: 0 0 6px 0;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;

        a {
          color: inherit;
          text-decoration: none;

          &:hover {
            color: #f8853d;
          }
        }
      }

      .post-date {
        font-size: 12px;
        color: #94a3b8;
        display: flex;
        align-items: center;
        gap: 4px;

        i {
          font-size: 11px;
          color: #f8853d;
        }
      }
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #fed7aa;

  .empty-icon {
    font-size: 4rem;
    color: #fed7aa;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 1.3rem;
    color: #1e293b;
    margin-bottom: 8px;
  }

  p {
    color: #64748b;
    margin-bottom: 24px;
  }
`;

const BlogSidebar = ({ categories, recentBlogs, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Sidebar>
      <SidebarCard>
        <div className="card-header">
          <h3>Search</h3>
        </div>
        <div className="card-content">
          <SearchBox>
            <i className="fal fa-search search-icon" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
        </div>
      </SidebarCard>

      <SidebarCard>
        <div className="card-header">
          <h3>Categories</h3>
        </div>
        <div className="card-content">
          {loading ? (
            <div>Loading categories...</div>
          ) : categories.length === 0 ? (
            <p
              style={{
                color: "#64748b",
                fontSize: "14px",
                textAlign: "center",
                margin: 0,
              }}
            >
              No categories available
            </p>
          ) : (
            <CategoryList>
              <li>
                <Link href="/blog" className="active">
                  All Articles
                  <span className="count">{recentBlogs.length}</span>
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/blog-category/${category.id}`}>
                    {capitalizeFirstLetter(category.name)}
                    <span className="count">
                      {
                        recentBlogs.filter(
                          (blog) => blog.categoryID === category.id
                        ).length
                      }
                    </span>
                  </Link>
                </li>
              ))}
            </CategoryList>
          )}
        </div>
      </SidebarCard>

      <SidebarCard>
        <div className="card-header">
          <h3>Recent Articles</h3>
        </div>
        <div className="card-content">
          {loading ? (
            <div>Loading recent posts...</div>
          ) : recentBlogs.length === 0 ? (
            <p
              style={{
                color: "#64748b",
                fontSize: "14px",
                textAlign: "center",
                margin: 0,
              }}
            >
              No recent articles available
            </p>
          ) : (
            <RecentPostsList>
              {recentBlogs
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((blog) => (
                  <li key={blog.id}>
                    <div className="post-image">
                      <img src={blog.thumbnail} alt={blog.title} />
                    </div>
                    <div className="post-content">
                      <h4 className="post-title">
                        <Link href={`/blog-details/${blog.id}`}>
                          {blog.title}
                        </Link>
                      </h4>
                      <div className="post-date">
                        <i className="fal fa-calendar-alt" />
                        <span>
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
            </RecentPostsList>
          )}
        </div>
      </SidebarCard>
    </Sidebar>
  );
};

const Page = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogData() {
      try {
        const [blogsResponse, categoriesResponse] = await Promise.all([
          blogApi.getAllPosts(),
          blogApi.getAllBlogCategories(),
        ]);

        const blogsData = blogsResponse.data;
        const publishedBlogs = blogsData.filter(
          (blog) => blog.status === "published"
        );

        setBlogs(publishedBlogs);
        setBlogCategories(categoriesResponse.data);
      } catch (err) {
        console.error("Error fetching blog data:", err);
        setError("Failed to fetch blog data.");
      } finally {
        setLoading(false);
      }
    }

    fetchBlogData();
  }, []);

  const totalCategories = blogCategories.length;

  return (
    <ReveloLayout>
      <PlatformContainer>
        <HeaderSection>
          <HeaderContainer>
            <HeaderTitle>
              <h1>Blog & Articles</h1>
              <p>Insights, tips, and stories from our travel experts</p>
            </HeaderTitle>
            <BlogStats>
              <div className="stat-item">
                <span className="number">{blogs.length}</span>
                <span className="label">Articles</span>
              </div>
              <div className="stat-item">
                <span className="number">{totalCategories}</span>
                <span className="label">Categories</span>
              </div>
            </BlogStats>
          </HeaderContainer>
        </HeaderSection>

        <MainContent>
          <BlogsList>
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonLoader
                  key={index}
                  height="320px"
                  width="100%"
                  style={{ borderRadius: "12px" }}
                />
              ))
            ) : blogs.length === 0 ? (
              <EmptyState>
                <div className="empty-icon">
                  <i className="fal fa-newspaper" />
                </div>
                <h3>No articles found</h3>
                <p>
                  We're working on creating great content for you. Check back
                  soon!
                </p>
              </EmptyState>
            ) : (
              blogs.map((blog) => (
                <BlogCard key={blog.id}>
                  <BlogImage>
                    <Link href={`/blog-details/${blog.id}`}>
                      <img src={blog.thumbnail} alt={blog.title} />
                    </Link>
                    <Link
                      href={`/blog-category/${blog.categoryID}`}
                      className="category-badge"
                    >
                      {capitalizeFirstLetter(blog.category.name)}
                    </Link>
                    <div className="date-badge">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                  </BlogImage>
                  <BlogContent>
                    <h2 className="blog-title">
                      <Link href={`/blog-details/${blog.id}`}>
                        {blog.title}
                      </Link>
                    </h2>
                    <div className="blog-meta">
                      <div className="meta-item">
                        <i className="fal fa-calendar-alt" />
                        <span>
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="meta-item">
                        <i className="fal fa-clock" />
                        <span>5 min read</span>
                      </div>
                    </div>
                    <p className="blog-excerpt">
                      {blog.excerpt?.length > 150
                        ? blog.excerpt.slice(0, 150) + "..."
                        : blog.excerpt ||
                          "Read this interesting article about travel tips and insights."}
                    </p>
                    <Link
                      href={`/blog-details/${blog.id}`}
                      className="read-more"
                    >
                      Read Article
                      <i className="fal fa-arrow-right" />
                    </Link>
                  </BlogContent>
                </BlogCard>
              ))
            )}
          </BlogsList>

          <BlogSidebar
            categories={blogCategories}
            recentBlogs={blogs}
            loading={loading}
          />
        </MainContent>
      </PlatformContainer>
    </ReveloLayout>
  );
};

export default Page;
