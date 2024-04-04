import CustomerDetails from "../components/CustomerDetails";
import CustomerList from "../components/CustomerList";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="container">
      <div className="list-section">
        <CustomerList />
      </div>
      <div className="details-section">
        <CustomerDetails />
      </div>
    </div>
  );
};

export default Home;
