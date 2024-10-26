import Menu from "../../components/Menu";
import Dashboard from "../../Layouts/Dashboard";
import PageWithoutMenu from "../../Layouts/PageWithoutMenu";
import ResetPassword from "./ResetPassword";

const ResetPasswords = () => {
  return (
    <Dashboard menu={<Menu />}>
      <PageWithoutMenu title="Alterar Senha" article={<ResetPassword />} />
    </Dashboard>
  );
};

export default ResetPasswords;
