import MainLayout from "../components/layout/MainLayout";
function Setting() {
  return (
    <MainLayout auth={true} navbarBottom={true} title="Settings">
      <div className="p-4">
        <p>Manage your settings here.</p>
      </div>
    </MainLayout>
  );
}
export default Setting;
