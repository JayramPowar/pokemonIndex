import {Loader} from "./components/Loader";
export const ErrorHandling = ({ loading, error }) => {
    if (loading) {
      return (
        <Loader />
      );
    }
  
    if (error) {
      return (
        <div>
          <h1>{error.message}</h1>
        </div>
      );
    }
  
    return null;
  };
  