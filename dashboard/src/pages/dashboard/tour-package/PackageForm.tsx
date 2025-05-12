import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import toast, { Toaster } from "react-hot-toast";

import {
  useCreatePackage,
  usePackageById,
  useUpdatePackage,
  usePackageCategories,
  usePackageServices,
  usePackageItineraries,
  usePackageFeatures,
} from "@/hooks/usePackage";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { useBlogCategories } from "@/hooks/useBlog";

const PackageForm = () => {
  const { id } = useParams();
  const featureOptions = [
    "Free Breakfast",
    "Airport Pickup",
    "City Tour",
    "Swimming Pool Access",
    "Gym Access",
  ];
  const itineraryOptions = [
    { title: "Beach Visit", description: "Visit the sunny beaches of Goa" },
    { title: "City Tour", description: "Explore the city's famous landmarks" },
    {
      title: "Adventure Sports",
      description: "Enjoy water sports and adventure rides",
    },
  ];
  const policies = [
    {
      bookingPolicy:
        "All appointments must be booked at least 48 hours in advance through our official website or customer support. A confirmation email will be sent upon successful booking. Clients are advised to provide accurate information to avoid any delays or complications.",
      visaDetail:
        "Our visa consultation services include assistance with documentation, interview preparation, and application review. We do not guarantee visa approval as the final decision lies with the respective embassy or consulate. Clients must ensure they meet the eligibility criteria for their chosen country.",
      cancellationPolicy:
        "Cancellations made 24 hours or more before the appointment will receive a full refund. Cancellations made within 24 hours are non-refundable. Clients can reschedule their appointments once, free of charge, if done at least 24 hours in advance.",
      paymentTerms:
        "Full payment is required at the time of booking. We accept payments via credit/debit cards, UPI, and net banking. Invoices will be issued upon payment. For bulk or corporate bookings, custom payment terms may be arranged upon request.",
    },
    {
      bookingPolicy:
        "All appointments must be booked at least 48 hours in advance through our official website or customer support. A confirmation email will be sent upon successful booking.",
      visaDetail:
        "Our visa consultation services include assistance with documentation, interview preparation, and application review.",
      cancellationPolicy:
        "Cancellations made 24 hours or more before the appointment will receive a full refund. Cancellations made within 24 hours are non-refundable.",
      paymentTerms:
        "Full payment is required at the time of booking. We accept payments via credit/debit cards, UPI, and net banking. Invoices will be issued upon payment.",
    },
  ];
  const isEditMode = Boolean(id);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const { mutate: createPackage } = useCreatePackage();
  const { mutate: updatePackage } = useUpdatePackage();
  const { data: packageData } = usePackageById(id);
  const { data: categories = [] } = usePackageCategories();
  const { data: features = [] } = usePackageFeatures();
  const { data: blogCategories = [] } = useBlogCategories();
  const { data: services = [] } = usePackageServices();
  const { data: itineraries = [] } = usePackageItineraries();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const selectOptions = itineraryOptions.map((item, index) => ({
    value: index,
    label: item.title,
  }));

  const [timelines, setTimelines] = useState([
    { day: 1, title: "", description: "", selectedOptions: [] },
  ]);

  const onSubmit = async (data: any) => {
    console.log("data", data);
    console.log("inclusion", inclusions);
    console.log("exclusion", exclusions);
    console.log("timelines", timelines);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("importantInfo", data.importantInfo);
    formData.append("location", data.location);
    formData.append("price", data.price);
    formData.append("duration", data.duration);
    formData.append("category", data.category);
    formData.append("availability", data.availability);
    formData.append("hotels", data.hotels);
    formData.append("services", JSON.stringify(data.services));
    formData.append("inclusions", JSON.stringify(inclusions));
    formData.append("exclusions", JSON.stringify(exclusions));
    formData.append("timelines", JSON.stringify(timelines));
    formData.append("bookingPolicy", data.bookingPolicy);
    formData.append("cancellationPolicy", data.cancellationPolicy);
    formData.append("paymentTerms", data.paymentTerms);
    formData.append("visaDetails", data.visaDetails);

    console.log("formData", formData);
    if (data.packageImage instanceof File) {
      formData.append("packageImage", data.packageImage);
    }

    // Convert to JSON object
    const jsonObject: Record<string, any> = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });

    if (isEditMode) {
      updatePackage({ id, packageData: formData });
    } else {
      const response = createPackage(formData);
    }

    // resetForm();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("packageImage", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    reset();
    setInclusions([]);
    setExclusions([]);
    setSelectedFeatures([]);
    setTimelines([{ day: 1, title: "", description: "", selectedOptions: [] }]);
    setImagePreview(null);
  };

  useEffect(() => {
    if (packageData) {
      reset({
        name: packageData.name || "",
        description: packageData.description || "",
        importantInfo: packageData.importantInfo || "",
        location: packageData.location || "",
        price: packageData.price || "",
        duration: packageData.duration || "",
        category: packageData.category || "",
        availability: packageData.availability || "",
        inclusions: packageData.inclusions || "",
        exclusions: packageData.exclusions || "",
      });
      if (packageData.imageUrl) {
        setImagePreview(packageData.imageUrl);
      }
      if (packageData.timelines && Array.isArray(packageData.timelines)) {
        setTimelines(packageData.timelines);
      }
    }
  }, [packageData]);

  const handleFeatureSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedFeatures((prev) => [...prev, value]);
    } else {
      setSelectedFeatures((prev) => prev.filter((item) => item !== value));
    }
  };
  const addToInclusion = () => {
    const duplicateInclusion = selectedFeatures.some((feature) =>
      inclusions.includes(feature)
    );

    if (duplicateInclusion) {
      toast.error("Features are already in the inclusion list.");
      return;
    }

    const conflictingExclusion = selectedFeatures.some((feature) =>
      exclusions.includes(feature)
    );

    if (conflictingExclusion) {
      toast.error("Features are already in the exclusion list.");
      return;
    }

    setInclusions((prev) => [
      ...prev,
      ...selectedFeatures.filter((feature) => !prev.includes(feature)),
    ]);
    setSelectedFeatures([]);
  };

  const addToExclusion = () => {
    const duplicateExclusion = selectedFeatures.some((feature) =>
      exclusions.includes(feature)
    );

    if (duplicateExclusion) {
      toast.error("Features are already in the exclusion list.");
      return;
    }

    const conflictingInclusion = selectedFeatures.some((feature) =>
      inclusions.includes(feature)
    );

    if (conflictingInclusion) {
      toast.error("Features are already in the inclusion list.");
      return;
    }

    setExclusions((prev) => [
      ...prev,
      ...selectedFeatures.filter((feature) => !prev.includes(feature)),
    ]);
    setSelectedFeatures([]);
  };

  const removeInclusion = (index: number) => {
    setInclusions((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExclusion = (index: number) => {
    setExclusions((prev) => prev.filter((_, i) => i !== index));
  };

  const isFeatureSelected = (feature: string) =>
    selectedFeatures.includes(feature);

  const updateTimeline = (index: number, field: string, value: any) => {
    const newTimelines = [...timelines];
    (newTimelines[index] as any)[field] = value;
    setTimelines(newTimelines);
  };

  const addTimeline = () => {
    setTimelines([
      ...timelines,
      {
        day: timelines.length + 1,
        title: "",
        description: "",
        selectedOptions: [],
      },
    ]);
  };

  const removeTimeline = (index: number) => {
    const newTimelines = [...timelines];
    newTimelines.splice(index, 1);
    setTimelines(newTimelines);
  };

  const handleMultiSelectChange = (selected: any, index: number) => {
    const selectedItineraries = selected.map(
      (opt: any) => itineraryOptions[opt.value]
    );

    const newTitle = selectedItineraries
      .map((item: any) => item.title)
      .join(", ");
    const newDescription = selectedItineraries
      .map((item: any) => item.description)
      .join("\n");

    const newTimelines = [...timelines];
    newTimelines[index].selectedOptions = selected;
    newTimelines[index].title = newTitle;
    newTimelines[index].description = newDescription;

    setTimelines(newTimelines);
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
      <Container className="p-5 shadow-lg rounded bg-white">
        <h2 className="mb-4 text-center fw-bold">
          {isEditMode ? "✏️ Edit Package" : "🌴 Create a Package"}
        </h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Package Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter package name"
              {...register("name", { required: "Package name is required" })}
            />
            {errors.name && (
              <small className="text-danger">
                {errors.name.message as string}
              </small>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter package description"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <small className="text-danger">
                {errors.description.message as string}
              </small>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Important Information</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter importat information"
              {...register("importantInfo", {
                required: "Important Information is required",
              })}
            />
            {errors.importantInfo && (
              <small className="text-danger">
                {errors.importantInfo.message as string}
              </small>
            )}
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter location"
                  {...register("location", {
                    required: "Location is required",
                  })}
                />
                {errors.location && (
                  <small className="text-danger">
                    {errors.location.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Price (in AED)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  {...register("price", { required: "Price is required" })}
                />
                {errors.price && (
                  <small className="text-danger">
                    {errors.price.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Duration (e.g. 5 Days)</Form.Label>
                <Form.Control
                  type="text"
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
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={blogCategories.map((category) => ({
                        value: category.name,
                        label: capitalizeFirstLetter(category.name),
                      }))}
                      value={
                        blogCategories
                          .map((category) => ({
                            value: category.name,
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
                {errors.category && (
                  <small className="text-danger">
                    {errors.category.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Availability</Form.Label>
                <Form.Control
                  as="select"
                  {...register("availability", {
                    required: "Availability is required",
                  })}
                >
                  <option value="">Select</option>
                  <option value="Available">Available</option>
                  <option value="Sold Out">Sold Out</option>
                  <option value="Coming Soon">Coming Soon</option>
                </Form.Control>
                {errors.availability && (
                  <small className="text-danger">
                    {errors.availability.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Hotels</Form.Label>
                <Form.Control
                  as="select"
                  {...register("hotels", {
                    required: "Hotels is required",
                  })}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Form.Control>
                {errors.hotels && (
                  <small className="text-danger">
                    {errors.hotels.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Choose Services</Form.Label>
                <Controller
                  name="services"
                  control={control}
                  rules={{ required: "Please select at least one services" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={blogCategories.map((service) => ({
                        value: service.name,
                        label: capitalizeFirstLetter(service.name),
                      }))}
                      isMulti
                      value={
                        blogCategories
                          .map((service) => ({
                            value: service.name,
                            label: capitalizeFirstLetter(service.name),
                          }))
                          .filter((option) =>
                            field.value?.includes(option.value)
                          ) || []
                      }
                      onChange={(selectedOptions) =>
                        field.onChange(
                          selectedOptions.map((option) => option.value)
                        )
                      }
                      classNamePrefix="react-select"
                    />
                  )}
                />
                {errors.services && (
                  <small className="text-danger">
                    {errors.services.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Feature Selection Section */}
          <div className="p-3 mb-4 border rounded">
            <h5 className="fw-bold">Select Features</h5>

            <Row>
              {featureOptions.length == 0 ? (
                <p>No features added yet</p>
              ) : (
                featureOptions.map((feature) => (
                  <Col key={feature} xs={12} md={6} lg={4}>
                    <Form.Check
                      type="checkbox"
                      label={feature}
                      value={feature}
                      checked={isFeatureSelected(feature)}
                      onChange={handleFeatureSelect}
                    />
                  </Col>
                ))
              )}
            </Row>

            <div className="d-flex gap-2 mt-3">
              <Button
                variant="success"
                onClick={addToInclusion}
                disabled={selectedFeatures.length === 0}
              >
                <AiOutlinePlus /> Add to Inclusion
              </Button>
              <Button
                variant="danger"
                onClick={addToExclusion}
                disabled={selectedFeatures.length === 0}
              >
                <AiOutlinePlus /> Add to Exclusion
              </Button>
            </div>

            <Row className="mt-4">
              <Col md={6}>
                <h6 className="fw-bold">Inclusions</h6>
                <ul>
                  {inclusions.map((item, index) => (
                    <li
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{item}</span>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="my-1"
                        onClick={() => removeInclusion(index)}
                      >
                        <AiOutlineClose />
                      </Button>
                    </li>
                  ))}
                </ul>
              </Col>
              <Col md={6}>
                <h6 className="fw-bold">Exclusions</h6>
                <ul>
                  {exclusions.map((item, index) => (
                    <li
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{item}</span>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="my-1"
                        onClick={() => removeExclusion(index)}
                      >
                        <AiOutlineClose />
                      </Button>
                    </li>
                  ))}
                </ul>
              </Col>
            </Row>
          </div>
          <div className="p-3 mb-4 border rounded">
            <h5 className="fw-bold">Itinerary (Timeline)</h5>

            {timelines.map((timeline, index) => (
              <div key={index} className="mb-3 p-3 border rounded">
                <Row className="mb-2">
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Day</Form.Label>
                      <Form.Control
                        type="number"
                        value={timeline.day}
                        onChange={(e) =>
                          updateTimeline(index, "day", parseInt(e.target.value))
                        }
                        min={1}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={10}>
                    <Form.Group>
                      <Form.Label>Select Itinerary (Multi-Select)</Form.Label>
                      <Select
                        options={selectOptions}
                        isMulti
                        value={timeline.selectedOptions}
                        onChange={(selected) =>
                          handleMultiSelectChange(selected, index)
                        }
                        placeholder="Select itineraries..."
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={timeline.title}
                        onChange={(e) =>
                          updateTimeline(index, "title", e.target.value)
                        }
                        placeholder="Enter title"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={timeline.description}
                        onChange={(e) =>
                          updateTimeline(index, "description", e.target.value)
                        }
                        placeholder="Enter description"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="danger" onClick={() => removeTimeline(index)}>
                  <AiOutlineClose /> Remove
                </Button>
              </div>
            ))}

            <Button variant="primary" onClick={addTimeline}>
              <AiOutlinePlus /> Add Day
            </Button>
          </div>
          <Row>
            <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label>Booking Policy</Form.Label>
                <Controller
                  name="bookingPolicy"
                  control={control}
                  rules={{ required: "Booking Policy is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={policies.map((policy) => ({
                        value: policy.bookingPolicy,
                        label: capitalizeFirstLetter(policy.bookingPolicy),
                      }))}
                      value={
                        policies
                          .map((policy) => ({
                            value: policy.bookingPolicy,
                            label: capitalizeFirstLetter(policy.bookingPolicy),
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
                {errors.bookingPolicy && (
                  <small className="text-danger">
                    {errors.bookingPolicy.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label>Cancellation Policy</Form.Label>
                <Controller
                  name="cancellationPolicy"
                  control={control}
                  rules={{ required: "Cancellation Policy is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={policies.map((policy) => ({
                        value: policy.cancellationPolicy,
                        label: capitalizeFirstLetter(policy.cancellationPolicy),
                      }))}
                      value={
                        policies
                          .map((policy) => ({
                            value: policy.cancellationPolicy,
                            label: capitalizeFirstLetter(policy.cancellationPolicy),
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
                {errors.cancellationPolicy && (
                  <small className="text-danger">
                    {errors.cancellationPolicy.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label>Payment Terms</Form.Label>
                <Controller
                  name="paymentTerms"
                  control={control}
                  rules={{ required: "Payment Terms is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={policies.map((policy) => ({
                        value: policy.paymentTerms,
                        label: capitalizeFirstLetter(policy.paymentTerms),
                      }))}
                      value={
                        policies
                          .map((policy) => ({
                            value: policy.paymentTerms,
                            label: capitalizeFirstLetter(policy.paymentTerms),
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
                {errors.paymentTerms && (
                  <small className="text-danger">
                    {errors.paymentTerms.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label>Visa Details</Form.Label>
                <Controller
                  name="visaDetails"
                  control={control}
                  rules={{ required: "Visa Details is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={policies.map((policy) => ({
                        value: policy.visaDetail,
                        label: capitalizeFirstLetter(policy.visaDetail),
                      }))}
                      value={
                        policies
                          .map((policy) => ({
                            value: policy.visaDetail,
                            label: capitalizeFirstLetter(policy.visaDetail),
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
                {errors.visaDetails && (
                  <small className="text-danger">
                    {errors.visaDetails.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Package Image</Form.Label>
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
                {isEditMode ? "💾 Update Package" : "🚀 Create Package"}
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

export default PackageForm;
