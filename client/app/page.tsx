import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  BarChart3,
  Package,
  TrendingUp,
  Receipt,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Package,
      title: "পণ্য ব্যবস্থাপনা",
      description: "কেনা ও বিক্রয় দাম সহ সম্পূর্ণ ইনভেন্টরি ট্র্যাকিং",
    },
    {
      icon: TrendingUp,
      title: "বিক্রয় রেকর্ড",
      description: "প্রতিটি বিক্রয় এবং লাভ স্বয়ংক্রিয়ভাবে হিসাব",
    },
    {
      icon: Receipt,
      title: "খরচ ট্র্যাকিং",
      description: "সকল ব্যবসায়িক খরচ সহজে পরিচালনা করুন",
    },
    {
      icon: BarChart3,
      title: "রিপোর্ট ও অ্যানালিটিক্স",
      description: "লাভ-ক্ষতির বিস্তারিত রিপোর্ট দেখুন",
    },
  ];

  const benefits = [
    "সম্পূর্ণ বাংলা ইন্টারফেস",
    "সহজ এবং দ্রুত ব্যবহার",
    "স্বয়ংক্রিয় লাভ গণনা",
    "কম স্টক সতর্কতা",
    "দৈনিক/মাসিক রিপোর্ট",
    "সম্পূর্ণ ফ্রি",
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
              আপনার দোকানের
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {" "}
                সম্পূর্ণ হিসাব
              </span>{" "}
              এক জায়গায়
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              অফলাইন দোকানদারদের জন্য সহজ এবং কার্যকর ব্যবসা ব্যবস্থাপনা
              সিস্টেম। পণ্য, বিক্রয়, খরচ এবং লাভ-ক্ষতির সম্পূর্ণ হিসাব রাখুন
              ডিজিটালভাবে।
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg">
                  ড্যাশবোর্ডে যান
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                আরও জানুন
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">প্রধান বৈশিষ্ট্য</h2>
            <p className="text-muted-foreground">
              আপনার ব্যবসা পরিচালনার জন্য প্রয়োজনীয় সব কিছু
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">
                কেন Shopera ব্যবহার করবেন?
              </h2>
              <p className="text-muted-foreground">
                আপনার দোকানের জন্য সেরা সমাধান
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 rounded-lg border bg-card p-4"
                >
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="border-y bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">কিভাবে কাজ করে</h2>
            <p className="text-muted-foreground">
              মাত্র তিনটি সহজ ধাপে শুরু করুন
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  ১
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">পণ্য যোগ করুন</h3>
              <p className="text-sm text-muted-foreground">
                আপনার দোকানের পণ্য কেনা ও বিক্রয় দাম সহ যোগ করুন
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  ২
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                বিক্রয় রেকর্ড করুন
              </h3>
              <p className="text-sm text-muted-foreground">
                প্রতিটি বিক্রয় রেকর্ড করুন, লাভ স্বয়ংক্রিয়ভাবে হিসাব হবে
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  ৩
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">রিপোর্ট দেখুন</h3>
              <p className="text-sm text-muted-foreground">
                দৈনিক/মাসিক লাভ-ক্ষতির বিস্তারিত রিপোর্ট দেখুন
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">আজই শুরু করুন</h2>
          <p className="mb-8 text-lg opacity-90">
            আপনার দোকানের ব্যবসা ডিজিটালভাবে পরিচালনা করুন
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              variant="outline"
              className="bg-background text-foreground hover:bg-background/90"
            >
              ড্যাশবোর্ডে যান
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
