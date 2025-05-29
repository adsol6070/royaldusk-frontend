import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { generateSlug } from "@/utils/generateSlug";
import toast, { Toaster } from "react-hot-toast";

import {
  useCreatePackage,
  usePackageById,
  useUpdatePackage,
  usePackageCategories,
  usePackageServices,
  usePackageItineraries,
  usePackageFeatures,
  usePackagePolicies,
} from "@/hooks/usePackage";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";

const PackageForm = () => {
  const { id } = useParams();

  const isEditMode = Boolean(id);
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const name = watch("name", "");
  const { mutate: createPackage } = useCreatePackage();
  const { mutate: updatePackage } = useUpdatePackage();
  const { data: packageData } = usePackageById(id);
  const { data: categories = [] } = usePackageCategories();
  const { data: features = [] } = usePackageFeatures();
  const { data: services = [] } = usePackageServices();
  const { data: itineraries = [] } = usePackageItineraries();
  const { data: policies = [] } = usePackagePolicies();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  // Modified: Store IDs instead of strings for inclusions and exclusions
  const [inclusionIDs, setInclusionIDs] = useState<string[]>([]);
  const [exclusionIDs, setExclusionIDs] = useState<string[]>([]);
  // Modified: Store selected itinerary IDs
  const [itineraryIDs, setItineraryIDs] = useState<string[]>([]);

  const selectOptions = itineraries.map((item, index) => ({
    value: item.id, // Modified: Use actual ID instead of index
    label: item.title,
  }));

  const [timelines, setTimelines] = useState([
    { day: 1, title: "", description: "", selectedOptions: [] },
  ]);

  const onSubmit = async (data: any) => {
    console.log("data", data);
    console.log("inclusionIDs", inclusionIDs);
    console.log("exclusionIDs", exclusionIDs);
    console.log("itineraryIDs", itineraryIDs);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("description", data.description);
    formData.append("importantInfo", data.importantInfo);
    formData.append("location", data.location);
    formData.append("price", data.price);
    formData.append("duration", data.duration);
    formData.append("categoryID", data.categoryID);
    formData.append("availability", data.availability);
    formData.append("hotels", data.hotels);

    // Modified: Use the proper ID arrays
    data.features.forEach((id: string) => formData.append("featureIDs", id));
    inclusionIDs.forEach((id: string) => formData.append("inclusionIDs", id));
    exclusionIDs.forEach((id: string) => formData.append("exclusionIDs", id));
    itineraryIDs.forEach((id: string) => formData.append("itineraryIDs", id));

    formData.append("policyID", data.policyID);

    console.log("formData", formData);
    if (data.packageImage instanceof File) {
      formData.append("imageUrl", data.packageImage);
    }

    // Convert to JSON object
    const jsonObject: Record<string, any> = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });
    console.log("jsonObject", jsonObject);

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
    setInclusionIDs([]);
    setExclusionIDs([]);
    setItineraryIDs([]);
    setSelectedServices([]);
    setTimelines([{ day: 1, title: "", description: "", selectedOptions: [] }]);
    setImagePreview(null);
  };

  useEffect(() => {
    if (name) {
      setValue("slug", generateSlug(name), { shouldValidate: true });
    }
  }, [name]);

  useEffect(() => {
    if (packageData) {
      reset({
        name: packageData.name || "",
        slug: packageData.slug || "",
        description: packageData.description || "",
        importantInfo: packageData.importantInfo || "",
        location: packageData.location || "",
        price: packageData.price || "",
        duration: packageData.duration || "",
        categoryID: packageData.categoryID || "",
        policyID: packageData.policyID || "",
        availability: packageData.availability || "",
        features: packageData.feature_ids || [],
      });

      // Modified: Set the ID arrays directly
      if (
        packageData.inclusion_ids &&
        Array.isArray(packageData.inclusion_ids)
      ) {
        setInclusionIDs(packageData.inclusion_ids);
      }

      if (
        packageData.exclusion_ids &&
        Array.isArray(packageData.exclusion_ids)
      ) {
        setExclusionIDs(packageData.exclusion_ids);
      }

      if (
        packageData.itinerary_ids &&
        Array.isArray(packageData.itinerary_ids)
      ) {
        setItineraryIDs(packageData.itinerary_ids);
      }

      if (packageData.imageUrl) {
        setImagePreview(packageData.imageUrl);
      }

      if (packageData.timeline_ids && Array.isArray(packageData.timeline_ids)) {
        setTimelines(packageData.timeline_ids);
      }
    }
  }, [packageData]);

  // Modified: Handle service selection to work with IDs
  const handleServiceSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedServices((prev) => [...prev, value]);
    } else {
      setSelectedServices((prev) => prev.filter((item) => item !== value));
    }
  };

  // Modified: Add to inclusion with IDs
  const addToInclusion = () => {
    // Find the service objects that match the selected services
    const selectedServiceObjects = services.filter((service) =>
      selectedServices.includes(service.name)
    );

    // Extract the IDs from the service objects
    const selectedServiceIDs = selectedServiceObjects.map(
      (service) => service.id
    );

    const duplicateInclusion = selectedServiceIDs.some((serviceID) =>
      inclusionIDs.includes(serviceID)
    );

    if (duplicateInclusion) {
      toast.error("Services are already in the inclusion list.");
      return;
    }

    const conflictingExclusion = selectedServiceIDs.some((serviceID) =>
      exclusionIDs.includes(serviceID)
    );

    if (conflictingExclusion) {
      toast.error("Services are already in the exclusion list.");
      return;
    }

    setInclusionIDs((prev) => [
      ...prev,
      ...selectedServiceIDs.filter((serviceID) => !prev.includes(serviceID)),
    ]);
    setSelectedServices([]);
  };

  // Modified: Add to exclusion with IDs
  const addToExclusion = () => {
    // Find the service objects that match the selected services
    const selectedServiceObjects = services.filter((service) =>
      selectedServices.includes(service.name)
    );

    // Extract the IDs from the service objects
    const selectedServiceIDs = selectedServiceObjects.map(
      (service) => service.id
    );

    const duplicateExclusion = selectedServiceIDs.some((serviceID) =>
      exclusionIDs.includes(serviceID)
    );

    if (duplicateExclusion) {
      toast.error("Services are already in the exclusion list.");
      return;
    }

    const conflictingInclusion = selectedServiceIDs.some((serviceID) =>
      inclusionIDs.includes(serviceID)
    );

    if (conflictingInclusion) {
      toast.error("Services are already in the inclusion list.");
      return;
    }

    setExclusionIDs((prev) => [
      ...prev,
      ...selectedServiceIDs.filter((serviceID) => !prev.includes(serviceID)),
    ]);
    setSelectedServices([]);
  };

  // Modified: Remove inclusion by ID
  const removeInclusion = (index: number) => {
    setInclusionIDs((prev) => prev.filter((_, i) => i !== index));
  };

  // Modified: Remove exclusion by ID
  const removeExclusion = (index: number) => {
    setExclusionIDs((prev) => prev.filter((_, i) => i !== index));
  };

  const isServiceSelected = (service: string) =>
    selectedServices.includes(service);

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

  // Modified: Handle multi-select change to work with IDs
  const handleMultiSelectChange = (selected: any, index: number) => {
    const selectedItineraryObjects = selected
      .map((opt: any) =>
        itineraries.find((itinerary) => itinerary.id === opt.value)
      )
      .filter(Boolean);

    // Update itineraryIDs with the selected IDs
    const selectedIDs = selectedItineraryObjects.map((item: any) => item.id);
    setItineraryIDs((prev) => {
      const newIDs = [...prev];
      // Replace any existing IDs for this timeline with the new selection
      return [...new Set([...newIDs, ...selectedIDs])];
    });

    const newTitle = selectedItineraryObjects
      .map((item: any) => item.title)
      .join(", ");
    const newDescription = selectedItineraryObjects
      .map((item: any) => item.description)
      .join("\n");

    const newTimelines = [...timelines];
    newTimelines[index].selectedOptions = selected;
    newTimelines[index].title = newTitle;
    newTimelines[index].description = newDescription;

    setTimelines(newTimelines);
  };

  // Rest of the component remains the same...
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
      <Container className="p-5 shadow-lg rounded bg-white">
        <h2 className="mb-4 text-center fw-bold">
          {isEditMode ? "✏️ Edit Package" : "🌴 Create a Package"}
        </h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Package Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter package name"
                  {...register("name", {
                    required: "Package name is required",
                  })}
                />
                {errors.name && (
                  <small className="text-danger">
                    {errors.name.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
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
            <Col md={6}>
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
                <Form.Label>Choose Features</Form.Label>
                <Controller
                  name="features"
                  control={control}
                  rules={{ required: "Please select at least one features" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={features.map((feature) => ({
                        value: feature.id,
                        label: capitalizeFirstLetter(feature.name),
                      }))}
                      isMulti
                      value={
                        features
                          .map((feature) => ({
                            value: feature.id,
                            label: capitalizeFirstLetter(feature.name),
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
                {errors.features && (
                  <small className="text-danger">
                    {errors.features.message as string}
                  </small>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Feature Selection Section */}
          <div className="p-3 mb-4 border rounded">
            <h5 className="fw-bold">Select Services</h5>

            <Row>
              {services.length == 0 ? (
                <p>No services added yet</p>
              ) : (
                services.map((service) => (
                  <Col key={service.id} xs={12} md={6} lg={4}>
                    <Form.Check
                      type="checkbox"
                      label={capitalizeFirstLetter(service.name)}
                      value={service.name}
                      checked={isServiceSelected(service.name)}
                      onChange={handleServiceSelect}
                    />
                  </Col>
                ))
              )}
            </Row>

            <div className="d-flex gap-2 mt-3">
              <Button
                variant="success"
                onClick={addToInclusion}
                disabled={selectedServices.length === 0}
              >
                <AiOutlinePlus /> Add to Inclusion
              </Button>
              <Button
                variant="danger"
                onClick={addToExclusion}
                disabled={selectedServices.length === 0}
              >
                <AiOutlinePlus /> Add to Exclusion
              </Button>
            </div>

            <Row className="mt-4">
              <Col md={6}>
                <h6 className="fw-bold">Inclusions</h6>
                <ul>
                  {inclusionIDs.map((item, index) => (
                    <li
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{capitalizeFirstLetter(item)}</span>
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
                  {exclusionIDs.map((item, index) => (
                    <li
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{capitalizeFirstLetter(item)}</span>
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
          {/* <Row>
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
                            label: capitalizeFirstLetter(
                              policy.cancellationPolicy
                            ),
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
          </Row> */}
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Policy</Form.Label>
                <Controller
                  name="policyID"
                  control={control}
                  rules={{ required: "Policies is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={policies.map((policy, index) => ({
                        value: policy.id,
                        label: `Policy ${index + 1}`,
                      }))}
                      value={
                        policies
                          .map((policy, index) => ({
                            value: policy.id,
                            label: `Policy ${index + 1}`,
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
                {errors.policyID && (
                  <small className="text-danger">
                    {errors.policyID.message as string}
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
