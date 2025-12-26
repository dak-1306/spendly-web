import MainLayout from "../components/layout/MainLayout.jsx";
function AI() {
  return (
    <MainLayout auth={true} navbarBottom={true} title="AI Assistant">
      <div className="p-4">
        <p>Welcome to your AI Assistant!</p>
      </div>
    </MainLayout>
  );
}
export default AI;
