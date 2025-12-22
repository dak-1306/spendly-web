import logo_header from "../assets/icons/logo_header.svg";
import icon_logo_github from "../assets/icons/icon_logo_github.svg";
import icon_facebook from "../assets/icons/icon_facebook.svg";
import logo_color from "../assets/icons/logo_color.svg";
import icon_google from "../assets/icons/icon_google.svg";
import icon_eye from "../assets/icons/icon_eye.svg";
const HEADER = {
  src: logo_header,
  alt: "Spendly Logo Header",
  width: 157,
  height: 40,
};
const FOOTER = {
  text: "© 2024 Spendly. All rights reserved.",
  iconLink: [
    {
      src: icon_logo_github,
      alt: "GitHub Logo",
      href: "",
    },
    {
      src: icon_facebook,
      alt: "Facebook Logo",
      href: "",
    },
  ],
};
const GOOGLE = {
  src: icon_google,
  alt: "Google Logo",
  width: 20,
  height: 20,
};
const FACEBOOK = {
  src: icon_facebook,
  alt: "Facebook Logo",
  width: 20,
  height: 20,
};
const LOGO_COLOR = {
  src: logo_color,
  alt: "Spendly Color Logo",
  width: 35,
  height: 35,
};
const EYE = {
  src: icon_eye,
  alt: "Eye Icon",
  width: 20,
  height: 20,
};
export { HEADER, FOOTER, LOGO_COLOR, GOOGLE, FACEBOOK, EYE };
