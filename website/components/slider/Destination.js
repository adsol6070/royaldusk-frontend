"use client";

import { useEffect, useState } from "react";
import Slider from "react-slick";
import Link from "next/link";
import { sliderProps } from "@/utility/sliderprops";
import { packageApi } from "@/common/api";
import SkeletonLoader from "@/components/SkeletonLoader";
import styled from "styled-components";
import capitalizeFirstLetter from "@/utility/capitalizeFirstLetter";

const ImageWrapper = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const Destination = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await packageApi.getPackageLocations();
        setLocations(response.data || []);
      } catch (err) {
        console.error("Failed to load locations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  if (loading) {
    return (
      <div className="row">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4 text-center">
            <SkeletonLoader height="300px" width="300px" style={{ borderRadius: "50%" }} />
          </div>
        ))}
      </div>
    );
  }

  if (locations.length === 0) {
    return <div className="text-center fs-3">No destinations available</div>;
  }

  return (
    <Slider {...sliderProps.destination} className="destination-active text-center">
      {locations.map((location, index) => (
        <div
          key={location.id}
          className="destination-item style-two"
          data-aos="fade-up"
          data-aos-delay={index * 50}
          data-aos-duration={1500}
          data-aos-offset={50}
        >
          <ImageWrapper>
            <Image src={location.imageUrl} alt={location.name} />
          </ImageWrapper>
          <div className="content mt-3">
            <h6>
              <Link href={`/holidays-location/${location.id}`}>{capitalizeFirstLetter(location.name)}</Link>
            </h6>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Destination;
