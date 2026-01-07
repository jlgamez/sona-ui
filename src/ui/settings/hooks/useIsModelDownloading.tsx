import { useEffect, useState } from "react";
import { buildUrlWith, get } from "@/api/FetchUtils.ts";
import { ENDPOINT } from "@/api/ApiConstants.ts";

type DownloadStateResponse = {
  model_name: string;
  state: "completed" | "downloading" | "not_started";
  success: boolean;
};

export function useIsModelDownloading(modelName: string) {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const getIsDownloadingFromResponse = (apiResponse: DownloadStateResponse) => {
    return apiResponse.state === "downloading";
  };

  useEffect(() => {
    const endpointUrl = buildUrlWith(ENDPOINT.MODEL_DOWNLOAD_STATE);
    get<DownloadStateResponse>(endpointUrl, { name: modelName }).then(
      (response) => {
        let downloadingState = getIsDownloadingFromResponse(response);
        setIsDownloading(downloadingState);
      },
    );
  }, []);

  return { isDownloading };
}
