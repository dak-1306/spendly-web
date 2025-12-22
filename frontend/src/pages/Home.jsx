import MainLayout from "../components/layout/MainLayout.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
function Home() {
  return (
    <MainLayout>
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <Card className="m-8 p-4 w-[500px] h-[300px] flex justify-center items-center"></Card>
          <Card className="m-8 p-4 w-[500px] h-[300px] flex justify-center items-center absolute bottom-10 right-0"></Card>
        </div>
        <div className="flex flex-col justify-center items-center p-8 space-y-6">
          <h1 className="text-h1 text-3xl font-bold">
            Manage your money. Smarter
          </h1>
          <p className="text-body">
            Track income, expenses, and budget in one place.
          </p>
          <Card className="flex flex-col items-start space-y-4">
            <p className="text-center text-lg text-body">
              Monitor income and expenses with a clean, intuitive dashboard.
            </p>
            <p className="text-center text-lg text-body">
              Set monthly limits and get warned before overspending.
            </p>
            <p className="text-center text-lg text-body">
              Understand spending habits and receive smart financial
              suggestions.
            </p>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <h2 className="text-[var(--primary-blue-color)] text-xl font-semibold mb-2">
                Feature highlights
              </h2>
              <ul className="list-disc list-inside text-body space-y-1">
                <li>Real-time expense tracking</li>
                <li>Customizable budget categories</li>
                <li>Detailed financial reports</li>
                <li>Secure data encryption</li>
                <li>Multi-device sync</li>
              </ul>
            </Card>
            <Card>
              <h2 className="text-[var(--primary-green-color)] text-xl font-semibold mb-2">
                How it works
              </h2>
              <ol className="list-decimal list-inside text-body space-y-1">
                <li>Sign up for a free account</li>
                <li>Link your bank accounts</li>
                <li>Set your budget goals</li>
                <li>Start tracking your expenses</li>
                <li>Review reports and adjust as needed</li>
              </ol>
            </Card>
          </div>
          <Button variant="getStarted" size="lg">
            Get Started for Free
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
export default Home;
