import { GetStaticPaths, GetStaticProps } from "next";
import * as prismic from "@prismicio/client";

import { createClient } from "../prismicio";
import { PageDocument } from "../types.generated";

type PageProps = {
  page: PageDocument;
};

type QueryParams = {
  uid: string;
};

export default function Page({ page }: PageProps) {
  return (
    <div>
      <h1>{page.data.title}</h1>
      <pre>
        <code>{JSON.stringify(page, null, 4)}</code>
      </pre>
    </div>
  );
}

export const getStaticProps: GetStaticProps<PageProps, QueryParams> = async ({
  params,
}) => {
  if (!params?.uid) {
    return { notFound: true };
  }

  const client = createClient();

  try {
    const page = await client.getByUID<PageDocument>("page", params.uid);

    return { props: { page } };
  } catch (error) {
    if (error instanceof prismic.NotFoundError) {
      return { notFound: true };
    }

    throw error;
  }
};

export const getStaticPaths: GetStaticPaths<QueryParams> = async () => {
  const client = createClient();

  const pages = await client.getAllByType<PageDocument>("page");
  const paths = pages.map((page) => ({ params: { uid: page.uid } }));

  console.log("[uid].tsx - ", { paths });

  return {
    paths,
    fallback: "blocking",
  };
};
