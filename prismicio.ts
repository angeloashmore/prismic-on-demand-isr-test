import * as prismic from "@prismicio/client";

import sm from "./sm.json";

export const createClient = () => {
  return prismic.createClient(sm.apiEndpoint, {
    routes: [
      {
        type: "page",
        path: "/:uid",
      },
    ],
  });
};
