import { ICONS } from "../../assets/index";
import { Link } from "react-router-dom";
function NavbarBottom() {
  const NAVBAR_BOTTOM = ICONS.logo_navbar_bottom;
  const dashboard = ICONS.dashboard;
  const income = ICONS.income;
  const setting = ICONS.setting;
  const robot = ICONS.robot;
  return (
    <>
      <nav className="p-4 bg-navbar shadow-md fixed bottom-4 w-1/3 left-0 right-0 mx-auto rounded-lg">
        <div className="relative">
          <img
            className="absolute -top-7 left-1/2 transform -translate-x-1/2"
            src={NAVBAR_BOTTOM.src}
            alt={NAVBAR_BOTTOM.alt}
            width={NAVBAR_BOTTOM.width}
            height={NAVBAR_BOTTOM.height}
          />
          <ul className="flex justify-between items-center">
            <div className="flex space-x-10 ml-8">
              <li className="navbar-item">
                <Link to="/dashboard">
                  <img
                    src={dashboard.src}
                    alt={dashboard.alt}
                    width={dashboard.width}
                    height={dashboard.height}
                  />
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/expense">
                  <img
                    src={income.src}
                    alt={income.alt}
                    width={income.width}
                    height={income.height}
                  />
                </Link>
              </li>
            </div>
            <div className="flex space-x-8 mr-8">
              <li className="navbar-item">
                <Link to="/setting">
                  <img
                    src={setting.src}
                    alt={setting.alt}
                    width={setting.width}
                    height={setting.height}
                  />
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/ai">
                  <img
                    src={robot.src}
                    alt={robot.alt}
                    width={robot.width}
                    height={robot.height}
                  />
                </Link>
              </li>
            </div>
          </ul>
        </div>
      </nav>
    </>
  );
}
export default NavbarBottom;
