import { useLayoutEffect } from "react";

export default function useInitialLoader(isReady = true) {
  useLayoutEffect(() => {
    if (isReady) {
      document.getElementById("initial-loader")?.remove();
    }
  }, [isReady]);
}
