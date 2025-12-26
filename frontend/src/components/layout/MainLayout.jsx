import Header from "./Header";
import Footer from "./Footer";
import NavBarBottom from "./NavbarBottom";
function MainLayout({
  children,
  navbarBottom = false,
  auth = false,
  title = "",
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header auth={auth} />
      <main
        className={`bg-body flex-1 overflow-y-auto ${
          navbarBottom ? "pb-20" : ""
        }`}
      >
        {title != "" && (
          <h1 className="text-h1 text-2xl font-bold p-4 mx-auto w-max">
            {title}
          </h1>
        )}
        {children}
        {!navbarBottom && <Footer />}
        {navbarBottom && <NavBarBottom />}
      </main>
    </div>
  );
}
export default MainLayout;
