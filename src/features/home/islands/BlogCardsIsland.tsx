import { motion } from "motion/react";
import AnimatedArrowIsland from "../../../components/ui/AnimatedArrowIsland";

export default function BlogCardsIsland({
  title,
  desc,
  ctaLabel,
  href,
  imageSrc
}: {
  title: string;
  desc: string;
  ctaLabel: string;
  href?: string;
  imageSrc: string;
}) {
  return (
    <section className="w-full px-4 xl:px-5 py-8 md:py-12">
      <div className="flex flex-col md:flex-row w-full min-h-[35vh] md:min-h-[40vh] lg:min-h-[80vh]">
        {/* Image Side */}
        <div className="w-full md:w-1/2 relative overflow-hidden h-[300px] md:h-auto md:border-b-0 bg-black">
          <motion.img
            src={imageSrc}
            alt={title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Content Side */}
        <div className="w-full md:w-1/2 p-4 flex flex-col transition-colors duration-500 bg-brand-pink">
          <div className="flex-1 flex flex-col justify-start mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col"
            >
              <h2 className="text-4xl lg:text-6xl font-medium mb-4 text-black tracking-tight whitespace-pre-line">
                {title}
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-black leading-snug mb-8 lg:mb-16 whitespace-pre-line">
                {desc}
              </p>
            </motion.div>
          </div>

          <div className="w-[300px] mt-auto">
            <AnimatedArrowIsland
              text={ctaLabel}
              href={href}
              hideBorders={true}
              textClassName="text-xs font-normal"
              paddingClassName="py-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
