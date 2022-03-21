import * as React from 'react';
import { k8sGetResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ApplicationModel } from '../models';
import { useActiveNamespace } from './useActiveNamespace';

type ApplicationInfo = {
  loaded: boolean;
  appExists: boolean;
};

export const useApplicationsInfo = (): ApplicationInfo => {
  const namespace = useActiveNamespace();
  const [applicationInfo, setApplicationInfo] = React.useState<ApplicationInfo>({
    loaded: false,
    appExists: false,
  });

  React.useEffect(() => {
    let mounted = true;
    const fetchApplication = async () => {
      const appData: any = await k8sGetResource({
        model: ApplicationModel,
        queryOptions: { ns: namespace },
      });
      if (mounted && appData?.items?.length > 0) {
        setApplicationInfo({ loaded: true, appExists: true });
      } else if (mounted) {
        setApplicationInfo({ loaded: true, appExists: false });
      }
    };
    namespace && fetchApplication();
    return () => {
      mounted = false;
    };
  }, [namespace]);

  return { loaded: applicationInfo.loaded, appExists: applicationInfo.appExists };
};
