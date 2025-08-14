import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Mountain, Zap, Fuel, Trash2, BarChart, FileText, User } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Electricity Insights",
      description:
        "Track your electricity consumption and its impact on your carbon footprint.",
    },
    {
      icon: <Fuel className="h-10 w-10 text-primary" />,
      title: "Fuel Monitoring",
      description:
        "Log your fuel usage to understand your transport-related emissions.",
    },
    {
      icon: <Trash2 className="h-10 w-10 text-primary" />,
      title: "Waste Management",
      description:
        "Quantify your waste generation and identify opportunities for reduction.",
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: "Visual Dashboards",
      description:
        "Visualize your emissions data with intuitive charts and graphs.",
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Emission Reports",
      description:
        "Generate and export detailed emission reports for compliance and analysis.",
    },
     {
      icon: <User className="h-10 w-10 text-primary" />,
      title: "AI Recommendations",
      description:
        "Receive personalized, AI-driven suggestions to reduce your carbon footprint.",
    },
  ];

  const testimonials = [
    {
      name: "Jane Doe",
      title: "CEO, EcoForward",
      avatar: "https://placehold.co/100x100.png",
      dataAiHint: "woman portrait",
      text: "CarbonTrack has been a game-changer for our sustainability goals. The insights are clear, actionable, and have helped us reduce our emissions by 15% in just one quarter.",
    },
    {
      name: "John Smith",
      title: "Founder, GreenLeaf Startups",
      avatar: "https://placehold.co/100x100.png",
      dataAiHint: "man portrait",
      text: "As a small business, we needed a simple yet powerful tool. CarbonTrack delivered exactly that. The dashboard is fantastic and makes tracking our progress effortless.",
    },
    {
      name: "Emily White",
      title: "Operations Manager, CleanCrate",
      avatar: "https://placehold.co/100x100.png",
      dataAiHint: "woman smiling",
      text: "The AI recommendations are incredibly insightful. We've implemented several suggestions that we hadn't even considered, leading to significant cost and carbon savings.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm">
        <Link href="#" className="flex items-center justify-center">
          <Mountain className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold text-foreground">
            CarbonTrack
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Login
          </Link>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section id="hero" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Track and Reduce Your Business's Carbon Footprint
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    CarbonTrack helps SMEs measure, manage, and minimize their
                    environmental impact with powerful tools and AI-driven insights.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">Get Started for Free</Link>
                  </Button>
                </div>
              </div>
              <img
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="sustainable business technology"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Features to Empower Your Green Journey
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our comprehensive suite of features is designed to give you a
                  complete picture of your carbon emissions and guide you towards
                  a more sustainable future.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-col items-center text-center">
                    {feature.icon}
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-5xl">
              Trusted by Sustainable Businesses
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-center mt-4">
              Hear from our users who are making a difference with CarbonTrack.
            </p>
            <Carousel
              opts={{ align: "start", loop: true }}
              className="w-full max-w-4xl mx-auto mt-12"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="h-full">
                        <CardContent className="flex flex-col items-center text-center justify-center p-6">
                          <Avatar className="w-20 h-20 mb-4 border-2 border-primary">
                            <AvatarImage src={testimonial.avatar} data-ai-hint={testimonial.dataAiHint} />
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <p className="text-sm text-muted-foreground italic">
                            "{testimonial.text}"
                          </p>
                          <div className="mt-4 font-semibold">{testimonial.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {testimonial.title}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 CarbonTrack Inc. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
