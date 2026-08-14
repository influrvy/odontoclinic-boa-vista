import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Odontoclinic Boa Vista | Seu sorriso merece cuidado", description: "Odontologia acolhedora em Boa Vista, RR. Agende sua avaliação na Odontoclinic.", icons: { icon: "/favicon.svg" }, openGraph: { title: "Odontoclinic Boa Vista", description: "Seu sorriso merece um cuidado extraordinário.", images: ["/og.png"], locale: "pt_BR", type: "website" }, robots: { index: true, follow: true } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
