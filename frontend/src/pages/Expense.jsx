import MainLayout from "../components/layout/MainLayout.jsx";
function Expense() {
  return (
    <MainLayout auth={true} navbarBottom={true} title="Expense Tracker">
      <div className="p-4">
        <p>Welcome to your Expense Tracker!</p>
      </div>
    </MainLayout>
  );
}
export default Expense;
