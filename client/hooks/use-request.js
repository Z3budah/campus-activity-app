import axios, { Method } from "axios";
import { useState } from "react";


export default ({ url, method, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (body) => {
    try {
      console.log(body);
      setErrors(null);
      const response = await axios[method](url, body);
      console.log("success:", response);

      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      console.log("err in try cathc", err);
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      }
      else if (err.code == 'ERR_BAD_REQUEST') {
        setErrors([{ message: 'ERR_BAD_REQUEST' }]);
      }
    }
  };

  return { doRequest, errors }
}