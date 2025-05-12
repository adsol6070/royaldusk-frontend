import FormInput from "./ui/FormInput";

const SearchFilter = () => {
  const options = [
    { value: "india", label: "India" },
    { value: "usa", label: "USA" },
    { value: "uk", label: "UK" },
  ];
  return (
    <div className="container container-1000">
      <div
        className="search-filter-inner"
        data-aos="zoom-out-down"
        data-aos-duration={1500}
        data-aos-offset={50}
      >
        <div className="filter-item clearfix">
          <div className="icon">
            <i className="fal fa-map-marker-alt" />
          </div>
          <span className="title">Destination</span>
          <FormInput
            name="destination"
            className="nice-select"
            // register={register}
            placeholder="Select Destination"
            as="select"
            border="none"
            options={options}
            // error={errors.destination}
          />
        </div>
        <div className="filter-item clearfix">
          <div className="icon">
            <i className="fal fa-flag" />
          </div>
          <span className="title">All Activity</span>
          <FormInput
            name="activity"
            className="nice-select"
            // register={register}
            placeholder="Select Activity"
            as="select"
            border="none"
            options={options}
            // error={errors.activity}
          />
        </div>
        <div className="filter-item clearfix">
          <div className="icon">
            <i className="fal fa-calendar-alt" />
          </div>
          <span className="title">Departure Date</span>
          <FormInput
            name="departure"
            className="nice-select"
            // register={register}
            placeholder="Select Departure"
            as="select"
            border="none"
            options={options}
            // error={errors.departure}
          />
        </div>
        <div className="filter-item clearfix">
          <div className="icon">
            <i className="fal fa-users" />
          </div>
          <span className="title">Guests</span>
          <FormInput
            name="guests"
            className="nice-select"
            // register={register}
            placeholder="Select Guests"
            as="select"
            border="none"
            options={options}
            // error={errors.guests}
          />
        </div>
        <div className="search-button">
          <button className="theme-btn">
            <span data-hover="Search">Search</span>
            <i className="far fa-search" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default SearchFilter;
