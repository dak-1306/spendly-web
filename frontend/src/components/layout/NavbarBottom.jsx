import { ICONS } from "../../assets/index";
import { Link } from "react-router-dom";
import { Home, DollarSign, Settings, BotMessageSquare } from "lucide-react";

function NavbarBottom() {
  const NAVBAR_BOTTOM = ICONS.logo_navbar_bottom;
  const DashboardIcon = (
    <Home className="w-6 h-6 text-[var(--primary-blue-color)]" />
  );
  const IncomeIcon = (
    <DollarSign className="w-6 h-6 text-[var(--primary-blue-color)]" />
  );
  const SettingIcon = (
    <Settings className="w-6 h-6 text-[var(--primary-blue-color)]" />
  );
  const RobotIcon = (
    <BotMessageSquare className="w-6 h-6 text-[var(--primary-blue-color)]" />
  );

  return (
    <>
      <nav className="p-4 bg-navbar shadow-md fixed bottom-4 w-1/3 left-0 right-0 mx-auto rounded-lg">
        <div className="relative">
          <img
            className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-md border border-[var(--primary-blue-color)]"
            src={NAVBAR_BOTTOM.src}
            alt={NAVBAR_BOTTOM.alt}
            width={NAVBAR_BOTTOM.width}
            height={NAVBAR_BOTTOM.height}
          />
          <ul className="flex justify-between items-center">
            <div className="flex space-x-10 ml-8">
              <li className="navbar-item bg-white rounded-full p-2 shadow-md hover:scale-105 transition-transform">
                <Link to="/dashboard">{DashboardIcon}</Link>
              </li>
              <li className="navbar-item bg-white rounded-full p-2 shadow-md hover:scale-105 transition-transform">
                <Link to="/expense">{IncomeIcon}</Link>
              </li>
            </div>
            <div className="flex space-x-8 mr-8">
              <li className="navbar-item bg-white rounded-full p-2 shadow-md hover:scale-105 transition-transform">
                <Link to="/setting">{SettingIcon}</Link>
              </li>
              <li className="navbar-item bg-white rounded-full p-2 shadow-md hover:scale-105 transition-transform">
                <Link to="/ai">{RobotIcon}</Link>
              </li>
            </div>
          </ul>
        </div>
      </nav>
    </>
  );
}
export default NavbarBottom;
