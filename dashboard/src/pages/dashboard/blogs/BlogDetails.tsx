import { useBlogById } from "@/hooks/useBlog";
import { Container, Row, Col, Image, Badge } from "react-bootstrap";
import { useParams } from "react-router-dom";

const BlogDetails = () => {
  const { id } = useParams();
  const { data: blog } = useBlogById(String(id));

  return (
    <Container className="py-5 bg-white">
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <h1 className="fw-bold text-dark">{blog?.title}</h1>
          <p className="text-muted">
            By <span className="fw-bold">{blog?.author.name}</span> |{" "}
            {blog?.publishedAt
              ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                })
              : "Unknown date"}
          </p>
          <Badge bg="primary" className="mb-3">
            {blog?.category.name}
          </Badge>
        </Col>
      </Row>

      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <Image
            src={blog?.thumbnail}
            alt={blog?.title}
            fluid
            className="rounded shadow"
          />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={{ span: 8, offset: 1 }}>
          <div
            dangerouslySetInnerHTML={{ __html: blog?.content ?? "" }}
            className="fs-5 text-dark"
          />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={{ span: 8, offset: 1 }}>
          <h5>Tags:</h5>
          {blog?.tags?.map((tag, index) => (
            <Badge key={index} bg="secondary" className="me-2">
              {tag}
            </Badge>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default BlogDetails;
