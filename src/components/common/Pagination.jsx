import { useLanguage } from "../../hooks/useLanguage.js";
import Button from "./Button.jsx";
function Pagination({ onPrev, onNext, hasNext }) {
  const { t } = useLanguage();
  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <Button
        onClick={onPrev}
        disabled={!onPrev}
        variant="outline"
        className="px-3 py-1"
      >
        {t("common.buttons.prev")}
      </Button>

      <Button
        onClick={onNext}
        disabled={!hasNext}
        variant="outline"
        className="px-3 py-1"
      >
        {t("common.buttons.next")}
      </Button>
    </div>
  );
}

export default Pagination;
