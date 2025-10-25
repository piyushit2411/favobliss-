"use client";

import Image from "next/image";
import { Product, ProductApiResponse, Variant, VariantImage } from "@/types";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { GalleryTab } from "./gallery-tab";
import { useShareModal } from "@/hooks/use-share-modal";
import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ActionButtons } from "../store/ActionButton";
import { PiShareFatFill } from "react-icons/pi";

interface GalleryProps {
  images: VariantImage[];
  product: ProductApiResponse;
  selectedVariant: Variant;
  locationPrice: {
    price: number;
    mrp: number;
  };
  isProductAvailable: boolean;
  selectedLocationGroupId: string | null;
  locationPinCode: string | null;
  deliveryInfo: {
    location: string;
    estimatedDelivery: number;
    isCodAvailable: boolean;
  } | null;
}

export const Gallery = ({
  images,
  product,
  selectedLocationGroupId,
  selectedVariant,
  isProductAvailable,
  locationPrice,
  deliveryInfo,
  locationPinCode,
}: GalleryProps) => {
  const { onOpen } = useShareModal();
  const [activeTab, setActiveTab] = useState(images[0]?.id || "");
  const [currentIndex, setCurrentIndex] = useState(0);

  const placeholder = `data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjYwMCIgaGVpZ2h0PSI2MDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImciPgogICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjZjZmNGY0IiBvZmZzZXQ9IjIwJSIgLz4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI2VkZWJlYiIgb2Zmc2V0PSI1MCUiIC8+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNmNmY0ZjQiIG9mZnNldD0iNzAlIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNmNmY0ZjQiIC8+CiAgPHJlY3QgaWQ9InIiIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI2cpIiAvPgogIDxhbmltYXRlIHhsaW5rOmhyZWY9IiNyIiBhdHRyaWJ1dGVOYW1lPSJ4IiBmcm9tPSItNjAwIiB0bz0iNjAwIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgIC8+Cjwvc3ZnPg==`;

  useEffect(() => {
    if (images.length > 0) {
      setActiveTab(images[0].id);
      setCurrentIndex(0);
    }
  }, [images]);

  const handleSelect = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  if (!images.length) {
    return (
      <div className="w-full aspect-[3/4] relative bg-gray-50">
        <Image
          src="/placeholder-image.jpg"
          alt="Placeholder Image"
          fill
          className="object-cover aspect-[3/4]"
        />
      </div>
    );
  }

  const MobileGallery = () => (
    <div className="block md:hidden relative mt-2 pb-4">
      <Carousel
        className="w-full"
        opts={{
          align: "center",
          loop: true,
          skipSnaps: false,
        }}
        onSelect={(api: any) => {
          if (api && typeof api.selectedScrollSnap === "function") {
            handleSelect(api.selectedScrollSnap());
          }
        }}
      >
        <CarouselContent className="ml-0">
          {images.map((media, index) => (
            <CarouselItem key={media.id} className="pl-0">
              <div className="relative w-full h-[400px] bg-gray-50 flex items-center justify-center rounded-2xl">
                {media.mediaType === "IMAGE" ? (
                  <>
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={media.url}
                        alt="Variant Image"
                        fill
                        className="object-contain rounded-2xl"
                        priority={index === 0}
                        loading={index > 0 ? "lazy" : "eager"}
                        placeholder="blur"
                        blurDataURL={placeholder}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div
                      className="absolute h-10 w-10 top-4 right-4 bg-white rounded-full flex items-center justify-center cursor-pointer z-10 shadow-md"
                      onClick={onOpen}
                    >
                      <PiShareFatFill className="text-zinc-700 h-6 w-6" />
                    </div>
                  </>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center bg-black rounded-2xl">
                    <video
                      src={media.url}
                      className="object-contain w-full h-full rounded-2xl"
                      muted
                      controls
                      playsInline
                      preload="metadata"
                    />
                    <div
                      className="absolute h-10 w-10 top-4 right-4 bg-white rounded-full flex items-center justify-center cursor-pointer z-10 shadow-md"
                      onClick={onOpen}
                    >
                      <PiShareFatFill className="text-zinc-700 h-6 w-6" />
                    </div>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* {images.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-black scale-125" : "bg-gray-400"
                }`}
                onClick={() => {
                  // You can add programmatic navigation here if needed
                  // This would require a ref to the carousel
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )} */}
      </Carousel>
    </div>
  );

  const DesktopGallery = () => (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="hidden md:flex flex-col-reverse md:px-24 lg:px-20 xl:px-28 relative"
    >
      <div className="mx-auto mt-6 lg:mt-2 w-full max-w-2xl lg:max-w-none lg:absolute top-0 left-0 lg:w-16">
        <TabsList className="grid grid-cols-4 lg:grid-cols-1 gap-4 md:gap-6 lg:gap-4 h-auto bg-white overflow-x-scroll md:overflow-y-scroll max-h-[60vh] scrollbar-hide">
          {images.map((media) => (
            <GalleryTab key={media.id} image={media} />
          ))}
        </TabsList>
      </div>
      {images.map((media, index) => {
        if (activeTab !== media.id) return null;

        return (
          <TabsContent
            key={media.id}
            value={media.id}
            className="relative overflow-hidden bg-transparent h-auto min-h-[500px] max-h-[600px] rounded-2xl"
          >
            {media.mediaType === "IMAGE" ? (
              <>
                <Image
                  src={media.url}
                  alt="Variant Image"
                  width={600}
                  height={600}
                  className="w-full h-auto object-contain object-top max-h-full rounded-2xl"
                  priority={index === 0}
                  loading={index > 0 ? "lazy" : "eager"}
                  placeholder="blur"
                  blurDataURL={placeholder}
                />
                <div
                  className="absolute h-10 w-10 top-4 right-4 bg-white rounded-full flex items-center justify-center md:cursor-pointer"
                  onClick={onOpen}
                >
                  <PiShareFatFill className="text-zinc-700 h-6 w-6" />
                </div>
              </>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center bg-transparent min-h-[500px]">
                <video
                  src={media.url}
                  className="object-contain max-h-full w-full h-auto rounded-2xl"
                  muted
                  controls
                />
                <div className="absolute h-10 w-10 top-4 right-4 bg-white rounded-full flex items-center justify-center md:cursor-pointer">
                  <PiShareFatFill className="text-zinc-700 h-6 w-6" />
                </div>
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );

  return (
    <div className="w-full">
      <MobileGallery />
      <DesktopGallery />
      <div className="mt-4 max-w-sm mx-auto hidden md:block">
        <ActionButtons
          productData={product}
          selectedVariant={selectedVariant}
          locationPrice={locationPrice}
          selectedLocationGroupId={selectedLocationGroupId}
          isProductAvailable={isProductAvailable}
          className="w-full"
          deliveryInfo={deliveryInfo}
          locationPinCode={locationPinCode}
        />
      </div>
    </div>
  );
};
