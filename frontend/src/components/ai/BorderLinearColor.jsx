import { ICONS } from "../../assets/index";

function BorderLinearColor({ title, description }) {
  const ROBOT_COLOR_ICON = ICONS.icon_robot_color;
  return (
    <>
      <div className="flex items-center gap-6">
        <img
          src={ROBOT_COLOR_ICON.src}
          alt={ROBOT_COLOR_ICON.alt}
          width={ROBOT_COLOR_ICON.width}
          height={ROBOT_COLOR_ICON.height}
        />
        <p className="text-xl text-h1 font-semibold">{title}</p>
      </div>
      <div className="bg-linear-color rounded-lg p-[1px] ml-[45px]">
        <ol className="lspace-y-4 text-lg p-4 bg-white rounded-md">
          {description.map((desc, index) => (
            <li className="text-body" key={index}>
              {desc}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

export default BorderLinearColor;
