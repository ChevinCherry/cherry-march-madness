import { data } from "./temp/test-data";

export const getNCAATeamLogoURL = (seoname: string) => {
  return `https://i.turner.ncaa.com/sites/default/files/images/logos/schools/bgl/${seoname}.svg`;
};

export const segmentArray = <T>(array: T[], ...groupSizes: number[]): T[][] => {
  let curIndex = 0;
  return groupSizes.map((groupSize) => {
    const endIndex = curIndex + groupSize;
    const group = array.slice(curIndex, endIndex);
    curIndex = endIndex;
    return group;
  });
};

export const getMMLTestData = () => {
  return data;
};
