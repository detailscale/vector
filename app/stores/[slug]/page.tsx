import { notFound } from "next/navigation";
import Nav from "@/components/coreUI/Nav";
import Link from "next/link";

interface MenuItem {
  name: string;
  price: string;
  description: string;
}

interface Store {
  id: number;
  name: string;
  pageURL?: string;
  ratings: number;
  cuisine: string;
  icon: string;
  menu: MenuItem[];
}

interface StorePageProps {
  params: {
    slug: string;
  };
}

async function getStoreData(slug: string): Promise<Store | undefined> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/testData/stores.json`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(
        `Failed to fetch store data. Status: ${res.status} from ${baseUrl}/testData/stores.json`,
      );
      return undefined;
    }
    const stores: Store[] = await res.json();

    return stores.find((s) => s.pageURL?.toLowerCase() === slug?.toLowerCase());
  } catch (error) {
    console.error("Error fetching store data:", error);
    return undefined;
  }
}

export default async function StorePage({
  params: paramsInput,
}: StorePageProps) {
  const { slug } = paramsInput;

  console.log("Resolved slug:", slug);

  const store = await getStoreData(slug);

  if (!store) {
    notFound();
  }

  return (
    <div className="font-outfit">
      <Nav />
      <div className="text-center pt-3">
        {" "}
        <p className="">You are on the &#34;{store.name}&#34; page</p>
        <Link href="/" className="underline text-blue-400">
          Return home
        </Link>
      </div>
    </div>
  );
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/testData/stores.json`);
    if (!res.ok) {
      console.error(
        "Failed to fetch store data for generateStaticParams from:",
        `${baseUrl}/testData/stores.json`,
      );
      return [];
    }
    const stores: Store[] = await res.json();

    return stores
      .map((store) => {
        const slugValue = store.pageURL?.toLowerCase();
        return slugValue ? { slug: slugValue } : null;
      })
      .filter(
        (param): param is { slug: string } => param !== null && !!param.slug,
      );
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}
