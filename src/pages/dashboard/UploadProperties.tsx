
// import {ShieldIcon, TrendUpIcon, UsersIcon} from "../components/svgs/ShieldIcon"

import UploadProperties from "../../components/admincomponents/UploadProperties";
import DashboardStats from "../../components/admincomponents/DashboardStats";

// import {PropertyTable} from "../../components/PropertyTable";


const Interest = () => {
  return (
    <div className="mx-auto px-4">
     
    
      <section>
        <div className="pt-6 mb-8">
          <h2 className="font-bold text-blue-900 text-3xl">
            Admin Dashboard
          </h2>
          <p className="text-gray-400 text-sm">
            Manage properties, users, and investment interests
          </p>
        </div>

        <DashboardStats />
      </section>
        {/* ===== GRAPH SECTION (Placeholder) ===== */}
      <section className="my-12 border border-gray-300 p-6 rounded-xl">


          <UploadProperties />
      </section>

      {/* ===== AVAILABLE PROPERTIES / STATS ===== */}

      
    </div>
  );
};

export default Interest;
