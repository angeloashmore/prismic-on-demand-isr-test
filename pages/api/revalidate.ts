import { NextApiRequest, NextApiResponse } from "next";
import * as prismicH from "@prismicio/helpers";

import { createClient } from "../../prismicio";

/**
 * This API endpoint will be called by a Prismic webhook. The webhook
 * will send an object containing a list of added, updated, or deleted
 * documents. Pages for those documents will be rebuilt.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("req.body:", req.body);

  if (req.body.type === "api-update" && req.body.documents.length > 0) {
    // If you have a `createClient()` function defined elsewhere in
    // your app, use that instead
    const client = createClient();

    // Get a list of URLs for any new, updated, or deleted documents
    const documents = await client.getAllByIDs(req.body.documents);
    const urls = documents.map((doc) => prismicH.asLink(doc));

    console.log("revalidate.ts - ", { urls });

    try {
      // Revalidate the URLs for those documents
      await Promise.all(
        urls
          .filter((url): url is string => url !== null)
          .map(async (url) => await res.unstable_revalidate(url))
      );

      return res.json({ revalidated: true });
    } catch (err) {
      // If there was an error, Next.js will continue to show
      // the last successfully generated page
      return res.status(500).send("Error revalidating");
    }
  }

  // If the request's body is unknown, tell the requester
  return res.status(400).json({ message: "Invalid body" });
}
