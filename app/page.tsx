import Nav from "@/components/coreUI/Nav";
import TopSearchModule from "@/components/coreUI/topSearchModule";
import CompactStoreList from "@/components/coreUI/compactStoreList";

export default function Home() {
  return (
    <main>
      <Nav />
      <div className="pt-10 mx-4">
        <TopSearchModule />
      </div>
      <div className="font-outfit mx-4">
        <CompactStoreList />
      </div>
    </main>
  );
}
