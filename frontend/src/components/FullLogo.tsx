import Image from "next/image";
import { cx } from "class-variance-authority";
import Link from "next/link";

interface FullLogoProps {
  darkMode?: boolean;
  className?: string;
}

export function FullLogo({ darkMode = false, className }: FullLogoProps) {
  return (
    <Link href="/" className={className}>
      <div className={"flex flex-col gap-1.5 w-[185px] cursor-pointer"}>
        <Image src={"/KazMetalCord.svg"} width={185} height={15} alt={"KazMetalCord"}
               className={cx("", darkMode ? "invert" : "")} priority/>
        <div className={cx("text-center text-[9px]", darkMode ? "text-white" : "text-black")}>
          производственное объединение
        </div>
      </div>
    </Link>
  );
}
