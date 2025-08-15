import React from "react";
import { AppleCardsCarouselDemo } from "./ImageSlider";

interface ServicesHeader {
  mainTitle: string;
  services: string[];
}

interface Service {
  _id: string;
  serviceType: string;
  title: string;
  slug: string;
  image: string;
  excerpt?: string;
  isFeatured: boolean;
  order: number;
}

interface SelectedProps {
  servicesHeader: ServicesHeader | null;
  services: Service[];
}

const Selected = ({ servicesHeader, services }: SelectedProps) => {
  // Use services from props or fallback to header services
  const rotatingServices = servicesHeader?.services || [];
  const featuredServices =
    services?.filter((service) => service.isFeatured) || [];

  return (
    <div className="w-full flex flex-col items-center px-3 md:px-6 pb-8 lg:pb-16 pt-[6rem]">
      <h6 className="text-[14px] sm:text-[16px] text-center font-extrabold text-text pt-12 sm:pt-[8rem] pb-2 sm:pb-4">
        SELECTED SERVICES
      </h6>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center ">
        <h1 className="text-text font-bold text-[2.2rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[6rem] text-center md:text-left lg:text-center  leading-[1.1]">
          {servicesHeader?.mainTitle || "Creating impact in"}
        </h1>
        <div className="bg-[#cce560] text-[#242424] font-bold rounded-2xl h-[48px] sm:h-[64px] md:h-[80px] w-[200px] sm:w-[260px] md:w-[350px] flex justify-center items-center will-change-transform overflow-hidden relative mt-2 md:mt-0">
          <span className="block absolute left-0 right-0 w-full text-center text-[1.1rem] sm:text-[1.5rem] md:text-[2rem]">
            {rotatingServices.length > 0 ? rotatingServices[0] : "Services"}
          </span>
        </div>
      </div>
      <div className="w-full mt-8 sm:mt-12" style={{ overflowX: "hidden" }}>
        <div className="w-full overflow-hidden opacity-100">
          <AppleCardsCarouselDemo services={featuredServices} />
        </div>
      </div>
    </div>
  );
};

export default Selected;
