// Pages
import GaleriaList from "../../pages/GaleriaList"

// Interfaces
import { ISection } from "../../../../models/sidebar.model"

const Section = ({ menu }: ISection) => (
  <>
    {menu === 1 && <GaleriaList />}
  </>
)

export default Section
