export const ErrorHandling = ({ loading, error }) => {
    if (loading) {
      return <h1>Loading...</h1>;
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
  