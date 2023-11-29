import axios, { Method } from "axios";
import { useState } from "react";

interface UseRequestProps {
  url: string;
  method: Method;
  body?: object;
  onSuccess?: (data: any) => void;
}

export default ({ url, method, body, onSuccess }: UseRequestProps) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
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
        setErrors(
          <div className='alert alert-danger'>
            <h4>Ooops...</h4>
            <ul className='my-0'>
              {err.response.data.errors.map(err => <li key={err.message}> {err.message} </li>)}
            </ul>
          </div>

        )
      }
    }
  };

  return { doRequest, errors }
}