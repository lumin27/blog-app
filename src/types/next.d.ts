import "next";

declare module "next" {
  type PageParams = Record<string, string | string[]>;
  type PageSearchParams = Record<string, string | string[] | undefined>;

  export type PageProps = {
    params: PageParams;
    searchParams: PageSearchParams;
  };
}
