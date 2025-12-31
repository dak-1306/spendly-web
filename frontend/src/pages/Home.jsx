import MainLayout from "../components/layout/MainLayout.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import { HOME } from "../utils/constants.js";
function Home() {
  return (
    <MainLayout title={false}>
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <Card className="m-8 p-4 w-[500px] h-[300px] flex justify-center items-center"></Card>
          <Card className="m-8 p-4 w-[500px] h-[300px] flex justify-center items-center absolute bottom-10 right-0"></Card>
        </div>
        <div className="flex flex-col justify-center items-center p-8 space-y-6">
          <h1 className="text-h1 text-3xl font-bold">{HOME.welcomeMessage}</h1>
          <p className="text-body">{HOME.text}</p>
          <Card className="flex flex-col items-start space-y-4">
            {HOME.description.map((desc, index) => (
              <p key={index} className="text-center text-lg text-body">
                {desc}
              </p>
            ))}
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <h2 className="text-[var(--primary-blue-color)] text-xl font-semibold mb-2">
                {HOME.featureHighlightsTitle}
              </h2>
              <ul className="list-disc list-inside text-body space-y-1">
                {HOME.featureHighlights.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </Card>
            <Card>
              <h2 className="text-[var(--primary-green-color)] text-xl font-semibold mb-2">
                {HOME.howItWorksTitle}
              </h2>
              <ol className="list-decimal list-inside text-body space-y-1">
                {HOME.howItWorks.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </Card>
          </div>
          <Button variant="gradient" size="lg">
            {HOME.textButton}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
export default Home;
