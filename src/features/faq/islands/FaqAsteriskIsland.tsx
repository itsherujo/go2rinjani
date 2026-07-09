import { motion, useScroll, useTransform } from 'motion/react';

export default function FaqAsteriskIsland() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 500]);
  
  return (
    <motion.img
      src="/assets/asterisk-large.svg"
      loading="lazy"
      alt=""
      className="section-icon-image"
      style={{ rotate }}
    />
  );
}
