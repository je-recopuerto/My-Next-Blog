import { Borel, Archivo, PT_Sans, Commissioner} from "next/font/google";
 

export const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-archivo",
});

export const borel = Borel({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-borel",
});

export const pt = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});