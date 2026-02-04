import { useEffect} from "react";
import toast from "react-hot-toast";
// import AvailableProperties from "../investorsData/AvailableProperties";

import DashboardStats from "../../components/admincomponents/DashboardStats";
import {InterestPage} from "../InterestPage";
import {useAuth} from "../../context/AuthContext"

const Interest = () => {
  // const [loading, setLoading] = useState<boolean>(true);

// getting users info

const {user} = useAuth();
  useEffect(()=> {
    if (user?.full_name) {
   toast.success(`Welcome ${user?.full_name}`)
        }
  }, [user?.full_name])
  
  return (
    <div className="mx-auto px-1 w-full flex flex-col">

      <section>
        <div className="pt-6 mb-8">
          <h2 className="font-bold text-blue-900 text-3xl">
            Admin Dashboard
          </h2>
          <p className="text-gray-400 text-sm">
            Manage properties, users, and investment interests
          </p>
        </div>

       {/*dashboard statistics*/}
        <DashboardStats />

      </section>

      <section className="my-12 w-full border border-gray-200 p-2 rounded-xl">
        <InterestPage />
      
      </section>


    </div>
  );
};

export default Interest;
