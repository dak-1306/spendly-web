import Header from "./Header";
import Footer from "./Footer";
function MainLayout({ children }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="bg-body flex-1 overflow-y-auto">
        {children}
        <Footer />
      </main>
    </div>
  );
}
export default MainLayout;
