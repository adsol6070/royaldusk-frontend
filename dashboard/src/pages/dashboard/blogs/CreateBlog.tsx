import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { openDB } from "idb";

const categories = [
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "health", label: "Health" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "education", label: "Education" },
];

const tagsOptions = [
  { value: "React", label: "React" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "WebDev", label: "Web Development" },
  { value: "SEO", label: "SEO" },
  { value: "AI", label: "Artificial Intelligence" },
];

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    [{ direction: "rtl" }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["table"],
    ["clean"],
  ],
};

const initDB = async () => {
  return openDB("BlogDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("blogs")) {
        db.createObjectStore("blogs", { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

const CreateBlog = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const title = watch("title", "");

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [content, setContent] = useState("");

  const saveBlogToDB = async (blogData: any) => {
    const db = await initDB();
    const tx = db.transaction("blogs", "readwrite");
    const store = tx.objectStore("blogs");
    await store.add(blogData);
    await tx.done;
    toast.success("Blog Saved Locally!");
  };

  const onSubmit = async (data: any) => {
    const blogData = { ...data, content, createdAt: new Date().toISOString() };
    await saveBlogToDB(blogData);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("thumbnail", file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [title]);

  return (
    <>
      <ToastContainer />
      <Container className="p-5 shadow-lg rounded bg-white">
        <h2 className="mb-4 text-center fw-bold ">📝 Create a Blog</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter blog title"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <small className="text-danger">
                    {errors.title.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Slug</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Auto-generated slug"
                  {...register("slug", { required: "Slug is required" })}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              theme="snow"
              style={{ height: "300px", marginBottom: "55px" }}
              placeholder="Write blog content here..."
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} options={categories} />
                  )}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tags</Form.Label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} options={tagsOptions} isMulti />
                  )}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Excerpt</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Short summary of the blog"
              {...register("excerpt")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Meta Title (SEO)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter SEO title"
              {...register("metaTitle")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Meta Description (SEO)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Enter SEO description"
              {...register("metaDescription")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Thumbnail (Optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
            />
            {thumbnailPreview && (
              <div className="mt-2">
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  style={{ width: "150px", borderRadius: "8px" }}
                />
              </div>
            )}
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select {...register("status")}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Publish Date</Form.Label>
                <Form.Control type="date" {...register("publishDate")} />
              </Form.Group>
            </Col>
          </Row>

          <Row className="d-flex justify-content-center gap-1">
            <Col xs="auto">
              <Button variant="primary" type="submit" className="w-100">
                🚀 Publish Blog
              </Button>
            </Col>
            <Col xs="auto">
              <Button
                variant="danger"
                type="button"
                className="w-100"
                onClick={() => reset()}
              >
                ✖️ Clear
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default CreateBlog;
