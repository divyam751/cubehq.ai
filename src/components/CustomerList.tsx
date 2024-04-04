import { useEffect, useState, useRef } from "react";
import "../styles/CustomerList.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  addCustomer,
  addSelectedCustomer,
  Customer,
} from "../redux/features/customerSlice";
import axios from "axios";

function CustomerList() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true); // State for loading indicator
  const [errors, setErrors] = useState<string | null>(null); // State for API errors
  const [currentPage, setCurrentPage] = useState<number>(1); // State to keep track of current page
  const customers = useSelector(
    (state: RootState) => state.customer.customerList
  );
  const selectedCustomer = useSelector(
    (state: RootState) => state.customer.selectedCustomer
  );

  const bottomBoundaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://json-cubehq-ai.onrender.com/customers?page=${currentPage}&limit=10`
        );

        if (response.status === 200) {
          const data: Customer[] = response.data;
          data.forEach((customer) => dispatch(addCustomer(customer)));
          setErrors(null);
        } else {
          setErrors(
            `Failed to fetch customers: ${response.status} ${response.statusText}`
          );
        }
      } catch (error) {
        setErrors(`Error fetching customers: ${error}`);
      } finally {
        setLoading(false); // loading set  to false after fetching completes
      }
    };

    fetchCustomers();
  }, [dispatch, currentPage]);

  // Function to handle scroll
  const handleScroll = () => {
    if (
      bottomBoundaryRef.current &&
      bottomBoundaryRef.current.getBoundingClientRect().top <=
        window.innerHeight
    ) {
      // Load next page of customers
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (customer: Customer) => {
    dispatch(addSelectedCustomer(customer));
  };

  return (
    <div>
      {errors && <div className="error">{errors}</div>}
      {loading && (
        <div className="loader-box">
          <span className="loader"></span>
        </div>
      )}
      <div className="list-parentBox">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className={`list-childBox ${
              selectedCustomer?.id === customer.id ? `selected` : ""
            }`}
            onClick={() => handleClick(customer)}
          >
            <p>{customer.name}</p>
            <p>{customer.title}</p>
          </div>
        ))}
        <div ref={bottomBoundaryRef}></div>
      </div>
    </div>
  );
}

export default CustomerList;
