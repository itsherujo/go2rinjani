import { motion, useScroll, useTransform } from 'motion/react';

export default function FaqAsteriskIsland() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 500]);
  
  return (
    <motion.img
      src="https://cdn.prod.website-files.com/6596aca1a31aa73c7b252db2/65bbe88948cb73219ee807ba_asterisk-large.svg"
      loading="lazy"
      alt=""
      className="section-icon-image"
      style={{ rotate }}
    />
  );
}
