import { useRouter } from 'next/router';

import SimpleLayout from 'utils/layout/SimpleLayout';
import useModel from 'core/useModel';
import ViewBrowserModel from '../models/ViewBrowserModel';
import ViewFolderSubtitle from '../components/ViewFolderSubtitle';
import ZUIFuture from 'zui/ZUIFuture';

interface FolderLayoutProps {
  children: React.ReactNode;
  folderId: number;
}

const FolderLayout: React.FunctionComponent<FolderLayoutProps> = ({
  children,
  folderId,
}) => {
  const { orgId } = useRouter().query;

  const model = useModel(
    (env) => new ViewBrowserModel(env, parseInt(orgId as string))
  );

  return (
    <ZUIFuture future={model.getFolder(folderId)}>
      {(data) => (
        <SimpleLayout
          noPad
          subtitle={
            <ZUIFuture future={model.getItemSummary(folderId)}>
              {(data) => (
                <ViewFolderSubtitle
                  numFolders={data.folders}
                  numViews={data.views}
                />
              )}
            </ZUIFuture>
          }
          title={data.title}
        >
          {children}
        </SimpleLayout>
      )}
    </ZUIFuture>
  );
};

export default FolderLayout;
