import CarCard from "@/components/car-card";
import HomeSearch from "@/components/home-search";
import { Button } from "@/components/ui/button";
import { featuredCars } from "@/lib/data";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
  <div className="pt-20 flex flex-col">
    {/* Hero */}

    <section className="relative py-16 md:py-28 animated-background">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-8xl mb-4 gradient-title">
            Drive Into the Future with PiyasGenDrive
            </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
Next-Gen AI Car Search | Explore & Test Drive from Thousands of Cars          </p>
        </div>
        {/* Search */}
        <HomeSearch/>
      </div>
    </section>

    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            Featured Cars
          </h2>
          <Button variant="ghost" className="flex items-center">
            <Link href="/cars">  
            View All <ChevronRight className="ml-1 h-4 w-4"/>
            </Link>
          
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car)=>{
           return <CarCard key={car.id} car={car}/>
          })}
        </div>
      </div>
    </section>

  </div>
  );
}
