import { HEADER } from "../../utils/constants";
import { Link } from "react-router-dom";
import Button from "../common/Button";
function Header() {
  return (
    <header>
      <div className="bg-header shrink-0 h-16 py-4 px-10 flex items-center justify-between">
        <img
          src={HEADER.src}
          alt={HEADER.alt}
          width={HEADER.width}
          height={HEADER.height}
        />
        <div className="space-x-4">
          <Link to="/login">
            <Button variant="loginHeader">Login</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
export default Header;
