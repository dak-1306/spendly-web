import { useLanguage } from "../../hooks/useLanguage.js";
function Pagination({ onPrev, onNext, hasNext }) {
  const { t } = useLanguage();
  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={onPrev}
        disabled={!onPrev}
        className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50"
      >
        {t("common.buttons.prev")}
      </button>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50"
      >
        {t("common.buttons.next")}
      </button>
    </div>
  );
}

export default Pagination;
