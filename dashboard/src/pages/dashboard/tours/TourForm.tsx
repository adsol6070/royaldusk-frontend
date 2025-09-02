import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { usePackageCategories, usePackageLocations } from "@/hooks/usePackage";
import { useCreateTour, useTourById, useUpdateTour } from "@/hooks/useTour";
import { generateSlug } from "@/utils/generateSlug";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

const tagOptions = [
  { value: "Regular", label: "Regular" },
  { value: "Popular", label: "Popular" },
  { value: "Top", label: "Top" },
];

const TourForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const name = watch("name", "");
  const { mutate: createTour } = useCreateTour();
  const { mutate: updateTour } = useUpdateTour();
  const { data: categories = [] } = usePackageCategories();
  const { data: locations = [] } = usePackageLocations();
  const { data: tour } = useTourById(String(id));
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("duration", data.duration);
    formData.append("locationId", data.locationId);
    formData.append("categoryID", data.categoryID);
    formData.append("tourAvailability", data.tourAvailability);
    formData.append("tag", data.tag);
    if (data.tourImage instanceof File) {
      formData.append("imageUrl", data.tourImage);
    }

    if (isEditMode) {
      updateTour({ id: String(id), tourData: formData });
    } else {
      createTour(formData);
      resetForm();
    }
  };

  const resetForm = () => {
    reset({
      name: "",
      slug: "",
      description: "",
      price: "",
      duration: "",
      tourAvailability: "",
      locationId: "",
      categoryID: "",
      tag: "Regular",
    });
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("tourImage", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    setValue("slug", generateSlug(name), { shouldValidate: true });
  }, [name]);

  useEffect(() => {
    if (tour) {
      reset({
        name: tour.name || "",
        slug: tour.slug || "",
        description: tour.description || "",
        price: tour.price || "",
        duration: tour.duration || "",
        tourAvailability: tour.tourAvailability || "",
        categoryID: tour.categoryId || "",
        locationId: tour.locationId || "",
        tag: tour.tag || "Regular",
      });
      if (tour.imageUrl) {
        setImagePreview(tour.imageUrl);
      }
    }
  }, [tour]);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
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
            {typeof errors.name?.message === "string" && (
              <small className="text-danger">{errors.name.message}</small>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              type="text"
              placeholder="Auto-generated slug"
              {...register("slug", { required: "Slug is required" })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter tour description"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {typeof errors.description?.message === "string" && (
              <small className="text-danger">
                {errors.description.message}
              </small>
            )}
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Price (AED)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  {...register("price", { required: "Price is required" })}
                />
                {typeof errors.price?.message === "string" && (
                  <small className="text-danger">{errors.price.message}</small>
                )}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Duration (e.g. 5 hours)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter duration"
                  {...register("duration", {
                    required: "Duration is required",
                  })}
                />
                {errors.duration && (
                  <small className="text-danger">
                    {errors.duration.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Availability</Form.Label>
                <Form.Control
                  as="select"
                  {...register("tourAvailability", {
                    required: "Availability is required",
                  })}
                >
                  <option value="">Select</option>
                  <option value="Available">Available</option>
                  <option value="Sold Out">Sold Out</option>
                  <option value="Coming Soon">Coming Soon</option>
                </Form.Control>
                {errors.tourAvailability && (
                  <small className="text-danger">
                    {errors.tourAvailability.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Controller
                  name="locationId"
                  control={control}
                  rules={{ required: "Location is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={locations.map((location) => ({
                        value: location.id,
                        label: capitalizeFirstLetter(location.name),
                      }))}
                      value={
                        locations
                          .map((location) => ({
                            value: location.id,
                            label: capitalizeFirstLetter(location.name),
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
                {errors.locationId && (
                  <small className="text-danger">
                    {errors.locationId.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Controller
                  name="categoryID"
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
                {errors.categoryID && (
                  <small className="text-danger">
                    {errors.categoryID.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Tour Tag</Form.Label>
                <Controller
                  name="tag"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={tagOptions}
                      value={tagOptions.find(
                        (opt) => opt.value === field.value
                      )}
                      onChange={(val) => field.onChange(val?.value)}
                    />
                  )}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Tour Image</Form.Label>
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
              <Button type="submit" variant="primary" className="w-100">
                {isEditMode ? "💾 Update Tour" : "🚀 Create Tour"}
              </Button>
            </Col>
            {!isEditMode && (
              <Col xs="auto">
                <Button
                  type="button"
                  variant="danger"
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
