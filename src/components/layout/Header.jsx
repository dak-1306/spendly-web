import { ICONS } from "../../assets/index";
import { Link } from "react-router-dom";
import Button from "../common/Button";
function Header({ auth }) {
  const logo_header = ICONS.logo_header;
  return (
    <header>
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shrink-0 h-16 py-4 px-10 flex items-center justify-between">
        <img
          src={logo_header.src}
          alt={logo_header.alt}
          width={logo_header.width}
          height={logo_header.height}
        />
        <div className="space-x-4">
          {!auth && (
            <Link to="/login">
              <Button variant="cta">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
export default Header;
