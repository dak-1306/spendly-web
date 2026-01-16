import AuthForm from "../../components/common/AuthForm";
import FullScreenOceanWave from "../../components/canvas/FullScreenOceanWave";
function Login() {
  return (
    <div className="relative">
      <FullScreenOceanWave></FullScreenOceanWave>
      <div className="absolute top-1/2 left-[75%] transform -translate-x-1/3 translate-y-1/3 min-w-[400px]">
        <AuthForm variant="login" />
      </div>
    </div>
  );
}
export default Login;
