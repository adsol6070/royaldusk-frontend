import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

import {
  useCreateTour,
  useTourById,
  useUpdateTour,
} from "@/hooks/useTour"; 

const TourForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const { mutate: createTour } = useCreateTour();
  const { mutate: updateTour } = useUpdateTour();
  const { data: tour } = useTourById(id);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("location", data.location);

    if (data.tourImage instanceof File) {
      formData.append("tourImage", data.tourImage);
    }

    if (isEditMode) {
      updateTour({ id, tourData: formData });
    } else {
      createTour(formData);
    }

    resetForm();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("tourImage", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    reset();
    setImagePreview(null);
  };

  useEffect(() => {
    if (tour) {
      reset({
        name: tour.name || "",
        description: tour.description || "",
        location: tour.location || "",
      });
      if (tour.image_url) {
        setImagePreview(tour.image_url);
      }
    }
  }, [tour]);

  return (
    <>
      <ToastContainer />
      <Container className="p-5 shadow-lg rounded bg-white">
        <h2 className="mb-4 text-center fw-bold">
          {isEditMode ? "✏️ Edit Tour" : "🌍 Create a Tour"}
        </h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter tour name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <small className="text-danger">{errors.name.message as string}</small>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter tour description"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && (
              <small className="text-danger">{errors.description.message as string}</small>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter tour location"
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && (
              <small className="text-danger">{errors.location.message as string}</small>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tour Image (Optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "150px", borderRadius: "8px" }}
                />
              </div>
            )}
          </Form.Group>

          <Row className="d-flex justify-content-center gap-1">
            <Col xs="auto">
              <Button variant="primary" type="submit" className="w-100">
                {isEditMode ? "💾 Update Tour" : "🚀 Create Tour"}
              </Button>
            </Col>
            {!isEditMode && (
              <Col xs="auto">
                <Button
                  variant="danger"
                  type="button"
                  className="w-100"
                  onClick={resetForm}
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

export default TourForm;
