"use client";

import { useGlobalStore } from "@/hooks/useGlobalStore";

const addresses: Record<string, string> = {
  Алматы:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2904.8354900778113!2d76.88922967640697!3d43.27582217675653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38836bc304f4ee27%3A0x4bcd9f684fac0c71!2sUlitsa%20Moskvina%2041%2C%20Almaty!5e0!3m2!1sen!2skz!4v1744739402432!5m2!1sen!2skz",
  Астана:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2199.696377827905!2d71.3732591879257!3d51.13856419098829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4245879c3643d56f%3A0xf931029bb6bac63b!2zQXJ1bmEg0KLQmg!5e0!3m2!1sen!2skz!4v1744739515872!5m2!1sen!2skz",
  Кызылорда:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1077.8060367883202!2d65.45040559575409!3d44.87251548781007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x41f7fd5d337abcab%3A0x964c0cf3e9f5346a!2sGASENERGY!5e0!3m2!1sen!2skz!4v1744739575404!5m2!1sen!2skz",
  Тараз:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2921.9502548022906!2d71.41148717639172!3d42.9160900997919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38a71d3c8306592d%3A0xa94e85ae0b361932!2z0J7Qv9GC0L4t0KDQvtC30L3QuNGH0L3Ri9C5INGC0L7RgNCz0L7QstGL0Lkg0YbQtdC90YLRgNGD0LvQuNGG0LAg0JzQsNC80LHQtdGCINCx0LDRgtGL0YDQsCDihJYyMA!5e0!3m2!1sen!2skz!4v1744739655654!5m2!1sen!2skz",
};

export function Map() {
  const city = useGlobalStore((state) => state.city);
  const address = addresses[city] || addresses["Алматы"];
  return (
    <iframe
      src={address}
      width="600"
      height="450"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
}
