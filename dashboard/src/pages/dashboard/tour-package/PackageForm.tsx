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
  usePackageLocations,
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
  const { data: locations = [] } = usePackageLocations();
  const { data: features = [] } = usePackageFeatures();
  const { data: services = [] } = usePackageServices();
  const { data: itineraries = [] } = usePackageItineraries();
  const { data: policies = [] } = usePackagePolicies();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [inclusions, setInclusions] = useState<{ id: string; name: string }[]>(
    []
  );
  const [exclusions, setExclusions] = useState<{ id: string; name: string }[]>(
    []
  );
  const selectOptions = itineraries.map((item, _index) => ({
    value: item.id,
    label: item.title,
  }));

  const [timelines, setTimelines] = useState([{ day: 1, entries: [] }]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("packageImage", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    reset({
      name: "",
      slug: "",
      description: "",
      importantInfo: "",
      locationId: "",
      price: "",
      duration: "",
      categoryID: "",
      availability: "",
      hotels: "",
      policyID: "",
      features: [],
      packageImage: null,
    });
    setInclusions([]);
    setExclusions([]);
    setSelectedServices([]);
    setTimelines([{ day: 1, entries: [] }]);
    setValue("packageImage", null);
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
        hotels: packageData.hotels || "",
        price: packageData.price || "",
        duration: packageData.duration || "",
        categoryID: packageData.categoryID || "",
        locationId: packageData.locationId || "",
        policyID: packageData.policyID || "",
        availability: packageData.availability || "",
        features: packageData.features.map((inc) => inc.id) || [],
      });

      if (packageData.inclusions && Array.isArray(packageData.inclusions)) {
        setInclusions(packageData.inclusions);
      }

      if (packageData.exclusions && Array.isArray(packageData.exclusions)) {
        setExclusions(packageData.exclusions);
      }

      if (packageData.imageUrl) {
        setImagePreview(packageData.imageUrl);
      }

      if (packageData.timeline && Array.isArray(packageData.timeline)) {
        setTimelines(packageData.timeline);
      }
    }
  }, [packageData]);

  const handleServiceSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedServices((prev) => [...prev, value]);
    } else {
      setSelectedServices((prev) => prev.filter((item) => item !== value));
    }
  };

  const addToInclusion = () => {
    const selected = services.filter((service) =>
      selectedServices.includes(service.name)
    );

    const alreadyIncluded = selected.filter((s) =>
      inclusions.some((incl) => incl.id === s.id)
    );
    const alreadyExcluded = selected.filter((s) =>
      exclusions.some((exc) => exc.id === s.id)
    );

    if (alreadyIncluded.length || alreadyExcluded.length) {
      const messages = [];
      if (alreadyIncluded.length) messages.push("some already included");
      if (alreadyExcluded.length) messages.push("some in exclusion list");
      return toast.error(`Cannot add: ${messages.join(" and ")}.`);
    }

    if (selected.length === 0) {
      return toast.error("No valid services selected.");
    }

    setInclusions((prev) => [...prev, ...selected]);
    setSelectedServices([]);
  };

  const addToExclusion = () => {
    const selected = services.filter((service) =>
      selectedServices.includes(service.name)
    );

    const alreadyExcluded = selected.filter((s) =>
      exclusions.some((exc) => exc.id === s.id)
    );
    const alreadyIncluded = selected.filter((s) =>
      inclusions.some((incl) => incl.id === s.id)
    );

    if (alreadyExcluded.length || alreadyIncluded.length) {
      const messages = [];
      if (alreadyExcluded.length) messages.push("some already excluded");
      if (alreadyIncluded.length) messages.push("some in inclusion list");
      return toast.error(`Cannot add: ${messages.join(" and ")}.`);
    }

    if (selected.length === 0) {
      return toast.error("No valid services selected.");
    }

    setExclusions((prev) => [...prev, ...selected]);
    setSelectedServices([]);
  };

  const removeInclusion = (index: number) => {
    setInclusions((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExclusion = (index: number) => {
    setExclusions((prev) => prev.filter((_, i) => i !== index));
  };

  const isServiceSelected = (service: string) =>
    selectedServices.includes(service);

  const getNextAvailableDay = () => {
    const usedDays = timelines.map((t) => t.day);
    let day = 1;
    while (usedDays.includes(day)) day++;
    return day;
  };

  const addTimeline = () => {
    setTimelines((prev) => [
      ...prev,
      {
        day: getNextAvailableDay(),
        entries: [],
      },
    ]);
  };

  const updateTimelineDay = (index: number, newDay: number) => {
    let adjustedDay = Math.max(1, newDay);

    const usedDays = timelines
      .map((t, i) => (i !== index ? t.day : null))
      .filter((d): d is number => typeof d === "number");

    if (usedDays.includes(adjustedDay)) {
      const original = adjustedDay;
      const maxDay = Math.max(...usedDays, adjustedDay) + 10;
      let available = adjustedDay;
      let offset = 1;

      while (offset < maxDay) {
        if (
          !usedDays.includes(adjustedDay - offset) &&
          adjustedDay - offset >= 1
        ) {
          available = adjustedDay - offset;
          break;
        }
        if (!usedDays.includes(adjustedDay + offset)) {
          available = adjustedDay + offset;
          break;
        }
        offset++;
      }

      adjustedDay = available;
      toast.error(
        `Day ${original} already exists. Auto-corrected to Day ${adjustedDay}.`
      );
    }

    setTimelines((prev) =>
      prev.map((t, i) => (i === index ? { ...t, day: adjustedDay } : t))
    );
  };

  const removeTimeline = (index: number) => {
    setTimelines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMultiSelectChange = (selected: any, index: number) => {
    const entries = selected
      .map((opt: any) => {
        const found = itineraries.find((it) => it.id === opt.value);
        if (!found) return null;
        return {
          itineraryId: found.id,
          title: found.title,
          description: found.description,
        };
      })
      .filter(Boolean);

    setTimelines((prev) =>
      prev.map((item, i) => (i === index ? { ...item, entries } : item))
    );
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    const appendField = (key: string, value: any) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    };

    const simpleFields = [
      "name",
      "slug",
      "description",
      "importantInfo",
      "locationId",
      "price",
      "duration",
      "categoryID",
      "availability",
      "hotels",
      "policyID",
    ];
    simpleFields.forEach((field) => appendField(field, data[field]));

    appendField("timeline", JSON.stringify(timelines));
    appendField(
      "inclusionIDs",
      JSON.stringify(inclusions.map((inc) => inc.id))
    );
    appendField(
      "exclusionIDs",
      JSON.stringify(exclusions.map((exc) => exc.id))
    );
    appendField("featureIDs", JSON.stringify(data.features));

    if (data.packageImage instanceof File) {
      formData.append("imageUrl", data.packageImage);
    }

    if (process.env.NODE_ENV === "development") {
      const jsonObject: Record<string, any> = {};
      formData.forEach((value, key) => {
        jsonObject[key] = value;
      });
      console.log("Submitting package:", jsonObject);
    }

    try {
      if (isEditMode) {
        updatePackage({ id, packageData: formData });
      } else {
        createPackage(formData);
        resetForm();
      }
    } catch (error) {
      console.error("Package submission failed:", error);
    }
  };

  useEffect(() => {
    if (!isEditMode) {
      resetForm();
    }
  }, [id]);

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
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
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
                  {inclusions.map((service, index) => (
                    <li
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{capitalizeFirstLetter(service.name)}</span>
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
                  {exclusions.map((service, index) => (
                    <li
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{capitalizeFirstLetter(service.name)}</span>
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
          <div className="p-4 mb-5 border rounded bg-white shadow-sm">
            <h4 className="fw-bold mb-4">Itinerary Timeline</h4>

            {timelines.map((timeline, index) => (
              <div
                key={index}
                className="mb-4 p-4 border rounded bg-light-subtle"
              >
                <Row className="align-items-center mb-3">
                  <Col md={2}>
                    <Form.Group controlId={`timeline-day-${index}`}>
                      <Form.Label className="fw-semibold">Day</Form.Label>
                      <Form.Control
                        type="number"
                        value={timeline.day}
                        onChange={(e) =>
                          updateTimelineDay(index, parseInt(e.target.value))
                        }
                        min={1}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={10}>
                    <Form.Group controlId={`timeline-select-${index}`}>
                      <Form.Label className="fw-semibold">
                        Select Itineraries
                      </Form.Label>
                      <Select
                        options={selectOptions}
                        isMulti
                        value={timeline.entries.map((entry) => ({
                          value: entry.itineraryId,
                          label: entry.title,
                        }))}
                        onChange={(selected) =>
                          handleMultiSelectChange(selected, index)
                        }
                        placeholder="Choose itineraries..."
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {timeline.entries.length > 0 && (
                  <>
                    <h6 className="fw-semibold text-muted mb-3">
                      Selected Entries
                    </h6>
                    {timeline.entries.map((entry, eIdx) => (
                      <Row key={eIdx} className="mb-3">
                        <Col md={6}>
                          <Form.Group
                            controlId={`entry-title-${index}-${eIdx}`}
                          >
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                              type="text"
                              value={entry.title}
                              readOnly
                              plaintext
                              className="bg-white"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId={`entry-desc-${index}-${eIdx}`}>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              value={entry.description}
                              readOnly
                              plaintext
                              className="bg-white"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    ))}
                  </>
                )}

                <div className="d-flex justify-content-end">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeTimeline(index)}
                  >
                    <AiOutlineClose className="me-1" />
                    Remove Day
                  </Button>
                </div>
              </div>
            ))}

            <div className="text-end">
              <Button variant="primary" onClick={addTimeline}>
                <AiOutlinePlus className="me-1" />
                Add Day
              </Button>
            </div>
          </div>

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
