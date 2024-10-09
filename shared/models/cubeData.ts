import { IBaseData } from "./baseData";
import { IParamsData } from "./paramsData";
import { IScorecardData } from "./scorecardData";

export interface ICubeData {
  paramsData: IParamsData;
  baseData: IBaseData;
  scorecardData: IScorecardData;
}
