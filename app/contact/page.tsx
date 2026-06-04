import { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "ガツガツグルメへのお問い合わせページです。ご意見、掲載情報の修正、おすすめのグルメ情報などお気軽にお送りください。",
};

export default function ContactPage() {
  return <ContactForm />;
}
