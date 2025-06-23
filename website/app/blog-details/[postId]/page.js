"use client";

import { blogApi } from "@/common/api";
import ReveloLayout from "@/layout/ReveloLayout";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import SkeletonLoader from "@/components/SkeletonLoader";
import { useRouter } from "next/navigation";

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
  gap: 16px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #fef7f0;
    color: #f8853d;
  }

  i {
    font-size: 16px;
  }
`;

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  .breadcrumb-item {
    color: #64748b;

    a {
      color: #64748b;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #f8853d;
      }
    }

    &.active {
      color: #1e293b;
      font-weight: 500;
    }
  }

  .separator {
    color: #fed7aa;
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

const ArticleContainer = styled.article`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #fed7aa;
`;

const ArticleHeader = styled.div`
  padding: 40px;
  background: linear-gradient(135deg, #f8853d 0%, #e67428 50%, #d65e1f 100%);
  color: white;
  position: relative;

  .category-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    margin-bottom: 16px;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      color: white;
      text-decoration: none;
    }
  }

  .article-title {
    color: white;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 20px 0;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  .article-meta {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      opacity: 0.9;

      .author-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.3);
      }

      i {
        font-size: 14px;
        opacity: 0.8;
      }
    }
  }
`;

const FeaturedImage = styled.div`
  position: relative;
  height: 400px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
    height: 100px;
  }
`;

const ArticleContent = styled.div`
  padding: 40px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #1e293b;
    font-weight: 600;
    margin: 32px 0 16px 0;
    line-height: 1.3;

    &:first-child {
      margin-top: 0;
    }
  }

  h1 {
    font-size: 2rem;
  }
  h2 {
    font-size: 1.75rem;
  }
  h3 {
    font-size: 1.5rem;
  }
  h4 {
    font-size: 1.25rem;
  }
  h5 {
    font-size: 1.125rem;
  }
  h6 {
    font-size: 1rem;
  }

  p {
    color: #374151;
    font-size: 16px;
    line-height: 1.7;
    margin: 0 0 20px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  ul,
  ol {
    color: #374151;
    font-size: 16px;
    line-height: 1.7;
    margin: 0 0 20px 0;
    padding-left: 24px;

    li {
      margin-bottom: 8px;
    }
  }

  blockquote {
    background: #fef7f0;
    border-left: 4px solid #f8853d;
    margin: 24px 0;
    padding: 20px 24px;
    font-style: italic;
    color: #4b5563;
    border-radius: 0 8px 8px 0;

    p {
      margin: 0;
      font-size: 18px;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 24px 0;
  }

  code {
    background: #fef7f0;
    color: #f8853d;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: "Monaco", "Menlo", monospace;
    font-size: 14px;
  }

  pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 24px 0;

    code {
      background: none;
      color: inherit;
      padding: 0;
    }
  }

  a {
    color: #f8853d;
    text-decoration: none;

    &:hover {
      color: #e67428;
      text-decoration: underline;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #fed7aa;

    th,
    td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #fed7aa;
    }

    th {
      background: #fef7f0;
      font-weight: 600;
      color: #374151;
    }

    tr:last-child td {
      border-bottom: none;
    }
  }
`;

const ArticleFooter = styled.div`
  padding: 40px;
  border-top: 1px solid #fef7f0;
  background: #fef7f0;

  .tags-section {
    margin-bottom: 24px;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 16px;
    }

    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .tag {
        display: inline-block;
        background: #fed7aa;
        color: #f8853d;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s ease;

        &:hover {
          background: #f8853d;
          color: white;
          text-decoration: none;
        }
      }
    }
  }

  .sharing-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;

    .back-to-blog {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #f8853d;
      text-decoration: none;
      font-weight: 500;
      padding: 8px 16px;
      border: 1px solid #fed7aa;
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        background: #f8853d;
        color: white;
        text-decoration: none;
        border-color: #f8853d;
      }

      i {
        font-size: 14px;
      }
    }

    .reading-time {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #64748b;
      font-size: 14px;

      i {
        color: #f8853d;
      }
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

const AuthorCard = styled.div`
  .author-info {
    display: flex;
    gap: 16px;
    align-items: flex-start;

    .author-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 3px solid #fed7aa;
      flex-shrink: 0;
    }

    .author-details {
      flex: 1;

      .author-name {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 4px 0;
      }

      .author-title {
        font-size: 13px;
        color: #f8853d;
        margin: 0 0 8px 0;
        font-weight: 500;
      }

      .author-bio {
        font-size: 14px;
        color: #64748b;
        line-height: 1.5;
        margin: 0;
      }
    }
  }
`;

const RelatedArticles = styled.div`
  .related-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .related-item {
      display: flex;
      gap: 12px;
      text-decoration: none;
      color: inherit;
      padding: 12px;
      border-radius: 8px;
      transition: background 0.2s ease;

      &:hover {
        background: #fef7f0;
        text-decoration: none;
        color: inherit;
      }

      .related-image {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .related-content {
        flex: 1;
        min-width: 0;

        .related-title {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin: 0 0 6px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s ease;
        }

        .related-date {
          font-size: 12px;
          color: #94a3b8;
        }
      }

      &:hover .related-title {
        color: #f8853d;
      }
    }
  }
`;

const LoadingState = styled.div`
  padding: 40px 20px;
  text-align: center;

  .skeleton-container {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #fed7aa;

  .error-icon {
    font-size: 4rem;
    color: #dc2626;
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

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #f8853d;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background: #e67428;
      color: white;
      text-decoration: none;
      transform: translateY(-1px);
    }
  }
`;

const BlogDetailPage = ({ params }) => {
  const postId = params.postId;
  const [blogDetail, setBlogdetail] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchBlogDetail(postId) {
      if (postId) {
        try {
          setLoading(true);
          const [detailResponse, allBlogsResponse] = await Promise.all([
            blogApi.getPostById(postId),
            blogApi.getAllPosts(),
          ]);

          const blogDetailData = detailResponse.data;
          setBlogdetail(blogDetailData);

          // Get related blogs (same category, excluding current)
          const allBlogs = allBlogsResponse.data;
          const related = allBlogs
            .filter(
              (blog) =>
                blog.categoryID === blogDetailData.categoryID &&
                blog.id !== blogDetailData.id &&
                blog.status === "published"
            )
            .slice(0, 4);
          setRelatedBlogs(related);
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

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const textLength = content?.replace(/<[^>]*>/g, "").split(" ").length || 0;
    return Math.ceil(textLength / wordsPerMinute);
  };

  if (loading) {
    return (
      <ReveloLayout>
        <PlatformContainer>
          <LoadingState>
            <div className="skeleton-container">
              <SkeletonLoader height="60px" width="100%" />
              <SkeletonLoader height="300px" width="100%" />
              <SkeletonLoader height="200px" width="100%" />
              <SkeletonLoader height="150px" width="100%" />
            </div>
          </LoadingState>
        </PlatformContainer>
      </ReveloLayout>
    );
  }

  if (error || !blogDetail) {
    return (
      <ReveloLayout>
        <PlatformContainer>
          <MainContent>
            <ErrorState>
              <div className="error-icon">
                <i className="fal fa-exclamation-triangle" />
              </div>
              <h3>Article Not Found</h3>
              <p>
                The article you're looking for doesn't exist or has been
                removed.
              </p>
              <Link href="/blog" className="back-btn">
                <i className="fal fa-arrow-left" />
                Back to Blog
              </Link>
            </ErrorState>
          </MainContent>
        </PlatformContainer>
      </ReveloLayout>
    );
  }

  const readingTime = calculateReadingTime(blogDetail.content);

  return (
    <ReveloLayout>
      <PlatformContainer>
        <HeaderSection>
          <HeaderContainer>
            <BackButton onClick={() => router.back()}>
              <i className="fal fa-arrow-left" />
              <span>Back</span>
            </BackButton>
            <Breadcrumb>
              <div className="breadcrumb-item">
                <Link href="/">Home</Link>
              </div>
              <span className="separator">/</span>
              <div className="breadcrumb-item">
                <Link href="/blog">Blog</Link>
              </div>
              <span className="separator">/</span>
              <div className="breadcrumb-item">
                <Link href={`/blog-category/${blogDetail.categoryID}`}>
                  {capitalizeFirstLetter(blogDetail.category.name)}
                </Link>
              </div>
              <span className="separator">/</span>
              <div className="breadcrumb-item active">Article</div>
            </Breadcrumb>
          </HeaderContainer>
        </HeaderSection>

        <MainContent>
          <ArticleContainer>
            <ArticleHeader>
              <Link
                href={`/blog-category/${blogDetail.categoryID}`}
                className="category-badge"
              >
                {capitalizeFirstLetter(blogDetail.category.name)}
              </Link>
              <h1 className="article-title">{blogDetail.title}</h1>
              <div className="article-meta">
                <div className="meta-item">
                  <img
                    src="/assets/images/blog/admin.jpg"
                    alt={blogDetail.author.name}
                    className="author-avatar"
                  />
                  <span>By {blogDetail.author.name}</span>
                </div>
                <div className="meta-item">
                  <i className="fal fa-calendar-alt" />
                  <span>
                    {new Date(blogDetail.createdAt).toLocaleDateString(
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
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </ArticleHeader>

            <FeaturedImage>
              <img src={blogDetail.thumbnail} alt={blogDetail.title} />
              <div className="image-overlay" />
            </FeaturedImage>

            <ArticleContent>
              <div dangerouslySetInnerHTML={{ __html: blogDetail.content }} />
            </ArticleContent>

            <ArticleFooter>
              {blogDetail.tags && blogDetail.tags.length > 0 && (
                <div className="tags-section">
                  <div className="section-title">Tags</div>
                  <div className="tags-list">
                    {blogDetail.tags.map((tag, index) => (
                      <Link key={index} href="#" className="tag">
                        {capitalizeFirstLetter(tag)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="sharing-section">
                <Link href="/blog" className="back-to-blog">
                  <i className="fal fa-arrow-left" />
                  Back to Blog
                </Link>
                <div className="reading-time">
                  <i className="fal fa-clock" />
                  <span>{readingTime} minute read</span>
                </div>
              </div>
            </ArticleFooter>
          </ArticleContainer>

          <Sidebar>
            <SidebarCard>
              <div className="card-header">
                <h3>About the Author</h3>
              </div>
              <div className="card-content">
                <AuthorCard>
                  <div className="author-info">
                    <img
                      src="/assets/images/blog/admin.jpg"
                      alt={blogDetail.author.name}
                      className="author-avatar"
                    />
                    <div className="author-details">
                      <h4 className="author-name">{blogDetail.author.name}</h4>
                      <p className="author-title">Travel Writer & Expert</p>
                      <p className="author-bio">
                        Passionate about exploring new destinations and sharing
                        travel insights with fellow adventurers around the
                        world.
                      </p>
                    </div>
                  </div>
                </AuthorCard>
              </div>
            </SidebarCard>

            {relatedBlogs.length > 0 && (
              <SidebarCard>
                <div className="card-header">
                  <h3>Related Articles</h3>
                </div>
                <div className="card-content">
                  <RelatedArticles>
                    <div className="related-list">
                      {relatedBlogs.map((blog) => (
                        <Link
                          key={blog.id}
                          href={`/blog-details/${blog.id}`}
                          className="related-item"
                        >
                          <div className="related-image">
                            <img src={blog.thumbnail} alt={blog.title} />
                          </div>
                          <div className="related-content">
                            <h4 className="related-title">{blog.title}</h4>
                            <div className="related-date">
                              {new Date(blog.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </RelatedArticles>
                </div>
              </SidebarCard>
            )}
          </Sidebar>
        </MainContent>
      </PlatformContainer>
    </ReveloLayout>
  );
};

export default BlogDetailPage;
