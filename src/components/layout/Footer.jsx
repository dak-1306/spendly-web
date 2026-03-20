import { ICONS } from "../../assets/index";
function Footer() {
  const icons_github = ICONS.icon_logo_github;
  const icons_facebook = ICONS.icon_facebook;

  return (
    <footer className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 text-white p-4 text-center">
      <p className="text-white">© 2023 My App. All rights reserved.</p>
      <div className="flex justify-center space-x-4 mt-2">
        <a
          href="https://github.com/dak-1306"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={icons_github.src}
            alt={icons_github.alt}
            width={icons_github.width}
            height={icons_github.height}
          />
        </a>
        <a
          href="https://www.facebook.com/tran.dang.913442/"
          target="_blank"
          rel="noopener noreferrer"
        >
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
