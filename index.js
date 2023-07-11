import axios from "axios";
import { performance } from "perf_hooks";

const instance = axios.create();

instance.interceptors.request.use((config) => {
  config.metadata = { startTime: performance.now() };
  return config;
}, (error) => {
  return Promise.reject(error);
});

instance.interceptors.response.use(
  (response) => {
    const metadata = response.config.metadata;
    const endTime = performance.now();
    const elapsedTime = endTime - metadata.startTime;
    response.config.metadata = { ...metadata, responseTime: elapsedTime }

    return response;
  },
  (error) => {
    const metadata = error.config.metadata;
    const endTime = performance.now();
    const elapsedTime = endTime - metadata.startTime;
    error.config.metadata = { ...metadata, errorTime: elapsedTime }

    return Promise.reject(error);
  }
);

instance
  .get("https://pokeapi.co/api/v2/pokemon/dittto")
  .then((response) => {
    console.log("Response: ", response);
    console.log("Time: ", response.config.metadata.responseTime, "ms");
  })
  .catch((error) => {
    console.log("Error: ", error);
    console.log("Error Time: ", error.config.metadata.errorTime, "ms");
  });
