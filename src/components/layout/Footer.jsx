import { ICONS } from "../../assets/index";
import { FOOTER } from "../../utils/constants";
function Footer() {
  const icons_github = ICONS.icon_logo_github;
  const icons_facebook = ICONS.icon_facebook;

  return (
    <footer className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 text-white p-4 text-center">
      <p className="text-white">{FOOTER.text}</p>
      <div className="flex justify-center space-x-4 mt-2">
        <a href="#">
          <img
            src={icons_github.src}
            alt={icons_github.alt}
            width={icons_github.width}
            height={icons_github.height}
          />
        </a>
        <a href="#">
          <img
            src={icons_facebook.src}
            alt={icons_facebook.alt}
            width={icons_facebook.width}
            height={icons_facebook.height}
          />
        </a>
      </div>
    </footer>
  );
}
export default Footer;
