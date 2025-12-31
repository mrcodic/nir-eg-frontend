"use client";

import animationData from "../../../public/assets/animations/optimized-hero-nir.json";
import Lottie from "../../lib/LottiesClient";

export default function HeroLottie() {
  // const [animationData, setAnimationData] = useState<LottieAnimation | null>(
  //   null
  // );

  // useEffect(() => {
  //   fetch("/assets/animations/optimized-hero-nir.json")
  //     .then((res) => res.json())
  //     .then(setAnimationData);
  // }, []);

  // if (!animationData) return null;

  return <Lottie animationData={animationData} />;
}
