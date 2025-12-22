import { FOOTER } from "../../utils/constants";
function Footer() {
  return (
    <footer className="bg-footer text-white p-4 text-center">
      <p className="text-white">{FOOTER.text}</p>
      <div className="flex justify-center space-x-4 mt-2">
        {FOOTER.iconLink.map((icon, index) => (
          <a
            key={index}
            href={icon.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={icon.src} alt={icon.alt} className="h-6 w-6 text-white" />
          </a>
        ))}
      </div>
    </footer>
  );
}
export default Footer;
