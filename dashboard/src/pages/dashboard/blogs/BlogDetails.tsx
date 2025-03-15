import { Container, Row, Col, Image, Badge, Card } from "react-bootstrap";

// Updated Dummy blog data
const blogData = {
  title: "The Future of AI in Web Development",
  author: "John Doe",
  publishDate: "July 10, 2025",
  category: "Technology",
  tags: ["AI", "Web Development", "Future Trends"],
  content: `
    <h3>The Rise of AI in Web Development</h3>
    <p>Artificial Intelligence (AI) is rapidly transforming the web development industry. From automating repetitive tasks to enhancing user experience, AI-powered tools are becoming essential for modern developers.</p>
    
    <h4>🔹 Key Benefits of AI in Web Development</h4>
    <ul>
      <li><b>Automated Code Generation:</b> AI tools like GitHub Copilot assist developers by suggesting code snippets.</li>
      <li><b>Personalized User Experience:</b> AI-driven recommendation engines tailor website content based on user behavior.</li>
      <li><b>Chatbots & Virtual Assistants:</b> AI-powered chatbots improve customer service and engagement.</li>
      <li><b>SEO & Analytics:</b> AI tools analyze website traffic and provide actionable insights.</li>
    </ul>
    
    <h4>🚀 How AI Will Shape the Future of Web Development</h4>
    <p>As AI continues to evolve, we can expect advancements like:</p>
    <ol>
      <li>Smarter and more intuitive website builders</li>
      <li>AI-powered UI/UX design improvements</li>
      <li>Automated debugging and error detection</li>
    </ol>

    <p><i>With these innovations, the future of web development looks more exciting than ever!</i></p>
  `,
  image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b", // Working Unsplash AI Image
  relatedBlogs: [
    { title: "How AI is Changing UI/UX Design", link: "/blog/ui-ux-ai" },
    { title: "Top 10 AI Tools for Developers in 2025", link: "/blog/ai-tools" },
  ],
};

const BlogDetails = () => {
  return (
    <Container className="py-5 bg-white">
      {/* Blog Header */}
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <h1 className="fw-bold text-dark">{blogData.title}</h1>
          <p className="text-muted">
            By <span className="fw-bold">{blogData.author}</span> |{" "}
            {blogData.publishDate}
          </p>
          <Badge bg="primary" className="mb-3">
            {blogData.category}
          </Badge>
        </Col>
      </Row>

      {/* Blog Image */}
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <Image
            src={blogData.image}
            alt={blogData.title}
            fluid
            className="rounded shadow"
          />
        </Col>
      </Row>

      {/* Blog Content */}
      <Row className="mt-4">
        <Col md={{ span: 8, offset: 1 }}>
          <div
            dangerouslySetInnerHTML={{ __html: blogData.content }}
            className="fs-5 text-dark"
          />
        </Col>
      </Row>

      {/* Tags */}
      <Row className="mt-4">
        <Col md={{ span: 8, offset: 1 }}>
          <h5>Tags:</h5>
          {blogData.tags.map((tag, index) => (
            <Badge key={index} bg="secondary" className="me-2">
              {tag}
            </Badge>
          ))}
        </Col>
      </Row>

      {/* Related Blogs */}
      <Row className="mt-5">
        <Col md={{ span: 8, offset: 1 }}>
          <h4 className="mb-3">Related Blogs</h4>
          {blogData.relatedBlogs.map((blog, index) => (
            <Card key={index} className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>
                  <a
                    href={blog.link}
                    className="text-decoration-none text-primary"
                  >
                    {blog.title}
                  </a>
                </Card.Title>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default BlogDetails;
