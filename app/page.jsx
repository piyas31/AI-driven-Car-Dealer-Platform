import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
  <div className="pt-20 flex flex-col">
    {/* Hero */}

    <section className="relative py-16 md:py-28 dotted-background">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-8xl mb-4 gradient-title">
            Find Your Dream Car with PiyasGenDrive
            </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
Next-Gen AI Car Search | Explore & Test Drive from Thousands of Cars          </p>
        </div>
        {/* Search */}
      </div>
    </section>

  </div>
  );
}
