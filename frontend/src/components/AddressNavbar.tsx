import { CityPicker } from "@/components/CityPicker";
import Link from "next/link";
import contacts from "@/contacts.json";

export function AddressNavbar() {
  return (
    <div className="bg-blue5 text-white">
      <div className={"site-container flex items-center justify-between text-sm"}>
        <div className={"flex items-center gap-7"}>
          <Link href={"/"} className="">ТОО “KazMetalCord”</Link>
          <CityPicker/>
        </div>
        <div className={"flex items-center gap-5"}>
          <div className="hidden md:block">
            E-mail: <Link href={"mailto:" + contacts.email.info}
                          className={"link"}>{contacts.email.info}</Link>
          </div>
          <div className="hidden sm:block">
            TEL: <Link href={contacts.phone.link} className={"link"}>{contacts.phone.text}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
