export const globalErrorHandler = (message, source, lineno, colno, error) => {
    // Get the current date and time
    const currentDate = new Date().toLocaleString();
    
    // Prepare the error message
    const errorMessage = `Error: ${currentDate}, Screen: ${source}, Line: ${lineno}, Column: ${colno}, Message: ${message}`;
  
    // Log the error message
    console.log(errorMessage);
  
    // Optionally, you can also send this error message to a remote logging service
    
    // Returning true indicates that the error has been handled
    return true;
  };
  