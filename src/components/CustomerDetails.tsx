import React, { useEffect, useState } from "react";
import "../styles/CustomerDetails.css";
import errorImg from "../assets/error.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { addPhoto, addSelectedCustomer } from "../redux/features/customerSlice";

const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const CustomerDetails: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const selectedCustomer = useSelector(
    (state: RootState) => state.customer.selectedCustomer
  );

  const customers = useSelector(
    (state: RootState) => state.customer.customerList
  );
  const storedPhotos = useSelector((state: RootState) => state.customer.photos);

  useEffect(() => {
    dispatch(addSelectedCustomer(customers[0]));
  }, [dispatch, customers]);

  useEffect(() => {
    const fetchRandomPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        //  GET request to the Unsplash API's photos/random endpoint
        const response = await axios.get(
          "https://api.unsplash.com/photos/random",
          {
            params: {
              count: 9,
              client_id: unsplashAccessKey,
            },
          }
        );

        // Successful request (status code 200)
        if (response.status === 200) {
          const fetchedPhotosData = response.data;
          const fetchedPhotoUrls = fetchedPhotosData.map(
            (photo: { urls: { small: string } }) => photo.urls.small
          );

          // Dispatch fetched photos to store
          dispatch(addPhoto(fetchedPhotoUrls));
        } else {
          console.error(
            "Failed to fetch random photos:",
            response.status,
            response.statusText
          );
          setError(
            `Failed to fetch random photos: ${response.status} ${response.statusText}`
          );
        }
      } catch (error) {
        console.error("Error fetching random photos:", error);
        setError(`Error fetching random photos: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomPhotos();
    const intervalId = setInterval(fetchRandomPhotos, 10000); // Fetching data in every 10 seconds
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [dispatch]);

  return (
    <div className="details-section">
      {selectedCustomer && (
        <div className="customer-details">
          <p>{selectedCustomer.name}</p>
          <p> {selectedCustomer.title}</p>
          <p> {selectedCustomer.address}</p>
        </div>
      )}
      {loading && (
        <div className="loader-box">
          <span className="loader"></span>
        </div>
      )}
      {error && (
        <div className="error-info">
          <h3>{error}</h3>
          <img src={errorImg} alt="error" className="error-image" />
        </div>
      )}

      {!loading && (
        <div className="photos-section">
          {/* Render photos from Redux store */}
          {storedPhotos.map((photoUrl, index) => (
            <img key={index} src={photoUrl} alt={`Random photo ${index}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
