import axios, { Method } from "axios";
import { useState } from "react";

interface UseRequestProps {
  url: string;
  method: Method;
  body?: object;
  onSuccess?: (data: any) => void;
}

export default ({ url, method, onSuccess }: UseRequestProps) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (body: {}) => {
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
      if (err.response) {
        setErrors(err.response.data.errors);
      }
    }
  };

  return { doRequest, errors }
}