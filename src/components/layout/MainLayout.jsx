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
        className={`bg-gradient-to-br from-slate-50 to-blue-50 text-gray-800 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-600 dark:text-gray-300 ${
          auth ? "px-[200px]" : ""
        } flex-1 overflow-y-auto ${navbarBottom ? "pb-20" : ""}`}
      >
        {title != "" && (
          <h1 className="text-blue-600 dark:text-blue-400 text-2xl font-bold p-4 mx-auto w-max">
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
