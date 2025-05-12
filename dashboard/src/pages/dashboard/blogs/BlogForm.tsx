import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { generateSlug } from "@/utils/generateSlug";
import {
  useBlogById,
  useBlogCategories,
  useCreateBlog,
  useUpdateBlog,
} from "@/hooks/useBlog";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

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

const BlogForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const tagsInputRef = useRef(null);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    mode: "onChange",
  });

  const title = watch("title", "");
  const status = watch("status");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const quillRef = useRef<ReactQuill>(null);
  const { mutate: createBlog } = useCreateBlog();
  const { mutate: updateBlog } = useUpdateBlog();
  const { data: categories = [] } = useBlogCategories();
  const { data: blog } = useBlogById(id);
  const [tags, setTags] = useState<string[]>([]);
  const [displayDate, setDisplayDate] = useState("");

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    if (selectedDate) {
      const dateObj = new Date(selectedDate);
      const now = new Date();
      dateObj.setHours(
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
      );
      setDisplayDate(selectedDate);
      const utcDate = dateObj.toISOString();
      setValue("published_at", utcDate);
    }
  };

  const onSubmit = async (data: any) => {
    const editor = quillRef.current?.getEditor();
    const content = editor?.root.innerHTML || "";

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("author", data.author);
    formData.append("category_id", data.category_id);
    formData.append("content", content);
    formData.append("excerpt", data.excerpt);
    formData.append("meta_title", data.meta_title);
    formData.append("meta_description", data.meta_description);
    formData.append("status", data.status);
    formData.append("published_at", data.published_at || "");
    formData.append("tags", JSON.stringify(tags));

    if (data.blogImage instanceof File) {
      formData.append("blogImage", data.blogImage);
    }

    if (isEditMode) {
      updateBlog({ id, blogData: formData });
    } else {
      createBlog(formData);
    }

    // resetForm();
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("blogImage", file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    reset();
    const editor = quillRef.current?.getEditor();
    if (editor) {
      editor.setText("");
    }
    setValue("category", null);
    setTags([]);
    tagsInputRef.current?.clearInput();
    setThumbnailPreview(null);
    setDisplayDate("");
  };

  useEffect(() => {
    if (status === "published" && !displayDate) {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      setDisplayDate(formattedDate);
      setValue("published_at", today.toISOString());
    } else if (status === "draft") {
      setDisplayDate("");
      setValue("published_at", "");
    }
  }, [status]);

  useEffect(() => {
    if (title) {
      setValue("slug", generateSlug(title), { shouldValidate: true });
    }
  }, [title]);

  useEffect(() => {
    if (blog) {
      reset({
        title: blog.title || "",
        slug: blog.slug || "",
        author: blog.author || "",
        category_id: blog.category_id || "",
        content: blog.content || "",
        excerpt: blog.excerpt || "",
        meta_title: blog.meta_title || "",
        meta_description: blog.meta_description || "",
        status: blog.status || "draft",
        published_at: blog.published_at || "",
      });
    }
    setDisplayDate(blog?.published_at ? blog?.published_at.split("T")[0] : "");
    setTags(blog?.tags || []);

    if (blog?.content && quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.clipboard.dangerouslyPasteHTML(blog.content);
    }
  }, [blog]);

  return (
    <>
      <Toaster position="top-right" toastOptions={{duration: 2000}} />
      <Container className="p-5 shadow-lg rounded bg-white">
        <h2 className="mb-4 text-center fw-bold">
          {isEditMode ? "✏️ Edit Blog" : "📝 Create a Blog"}
        </h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter blog title (5-150 characters)"
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 5,
                      message: "Title must be at least 5 characters",
                    },
                    maxLength: {
                      value: 150,
                      message: "Title cannot exceed 150 characters",
                    },
                  })}
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
                  placeholder="Auto-generated slug (editable if needed)"
                  {...register("slug", { required: "Slug is required" })}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter author name (max 10 characters)"
                  {...register("author", {
                    required: "Author is required",
                    maxLength: {
                      value: 10,
                      message: "Author name cannot exceed 10 characters",
                    },
                  })}
                />
                {errors.author && (
                  <small className="text-danger">
                    {errors.author.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Controller
                  name="category_id"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={categories.map((category) => ({
                        value: category.id,
                        label: capitalizeFirstLetter(category.name),
                      }))}
                      value={
                        categories
                          .map((category) => ({
                            value: category.id,
                            label: capitalizeFirstLetter(category.name),
                          }))
                          .find((option) => option.value === field.value) ||
                        null
                      }
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value)
                      }
                    />
                  )}
                />
                 {errors.category_id && (
                  <small className="text-danger">
                    {errors.category_id.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              modules={modules}
              style={{ height: "300px", marginBottom: "55px" }}
              placeholder="Write detailed blog content (minimum 50 characters)..."
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tags</Form.Label>
                <TagsInput
                  ref={tagsInputRef}
                  value={tags}
                  onChange={(newTags) => {
                    const uniqueTags = [
                      ...new Set(newTags.map((tag) => tag.toLowerCase())),
                    ];
                    setTags(uniqueTags);
                  }}
                  inputProps={{
                    placeholder: "Add a tag",
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Excerpt</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Provide a short summary (max 300 characters)"
                  {...register("excerpt", {
                    maxLength: {
                      value: 300,
                      message: "Excerpt cannot exceed 300 characters",
                    },
                  })}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Meta Title (SEO)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter SEO title (max 150 characters)"
              {...register("meta_title", {
                maxLength: {
                  value: 150,
                  message: "Meta title cannot exceed 150 characters",
                },
              })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Meta Description (SEO)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Write an SEO-friendly description (max 300 characters)"
              {...register("meta_description", {
                maxLength: {
                  value: 300,
                  message: "Meta description cannot exceed 300 characters",
                },
              })}
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
                <Form.Control
                  type="date"
                  value={displayDate}
                  onChange={handleDateChange}
                  disabled={status === "draft"}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="d-flex justify-content-center gap-1">
            <Col xs="auto">
              <Button variant="primary" type="submit" className="w-100">
                {isEditMode ? "💾 Update Blog" : "🚀 Publish Blog"}
              </Button>
            </Col>
            {!isEditMode && (
              <Col xs="auto">
                <Button
                  variant="danger"
                  type="button"
                  className="w-100"
                  onClick={() => resetForm()}
                >
                  ✖️ Clear
                </Button>
              </Col>
            )}
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default BlogForm;
