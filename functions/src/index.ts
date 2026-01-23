import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({
  maxInstances: 5,
  region: "asia-southeast1",
});

export { getFinancialReport } from "./financial";
