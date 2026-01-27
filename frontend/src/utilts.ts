import { data } from "./temp/test-data";
export const getNCAATeamLogoURL = (seoname: string) => {
  return `https://i.turner.ncaa.com/sites/default/files/images/logos/schools/bgl/${seoname}.svg`;
};

export const getMMLTestData = () => {
  return data;
};
