import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ImageTextSectionProps {
  image: string;
  title: string;
  description: string | ReactNode;
  buttonText?: string;
  buttonLink?: string;
  imageOnRight?: boolean;
  backgroundImage?: boolean;
}

const ImageTextSection = ({
  image,
  title,
  description,
  buttonText,
  buttonLink,
  imageOnRight = false,
  backgroundImage = false,
}: ImageTextSectionProps) => {
  if (backgroundImage) {
    return (
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-overlay flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-3xl animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <div className="text-lg md:text-xl mb-6">{description}</div>
            {buttonText && buttonLink && (
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                <Link to={buttonLink}>{buttonText}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const content = (
    <>
      <div className="flex-1 animate-fade-in-up">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-lg shadow-lg"
          loading="lazy"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center space-y-6 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">{title}</h2>
        <div className="text-lg text-muted-foreground leading-relaxed">{description}</div>
        {buttonText && buttonLink && (
          <div>
            <Button asChild size="lg" className="bg-gradient-primary">
              <Link to={buttonLink}>{buttonText}</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div
        className={`flex flex-col ${
          imageOnRight ? "md:flex-row-reverse" : "md:flex-row"
        } gap-12 items-center`}
      >
        {content}
      </div>
    </div>
  );
};

export default ImageTextSection;
