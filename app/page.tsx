import Nav from "@/components/coreUI/Nav";
import TopSearchModule from "@/components/coreUI/topSearchModule";

export default function Home() {
  return (
    <main>
      <Nav />
      <div className="pt-10">
        <TopSearchModule />
      </div>
    </main>
  );
}
