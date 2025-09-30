import Nav from "@/components/coreUI/Nav";
import CompactStoreList from "@/components/coreUI/compactStoreList";
import TopBar from "@/components/coreUI/topBar";

export default function Home() {
  return (
    <main>
      <Nav />
      <div className="mx-4">
        <div>
          <TopBar />
        </div>
      </div>
      <div className="font-outfit mx-4">
        <CompactStoreList />
      </div>
    </main>
  );
}
