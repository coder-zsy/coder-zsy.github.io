import '@/locales/i18n';
import './index.less';

import DownloadButtons from './printerMate/DownloadButtons';
import DownloadPageLayout from './printerMate/DownloadPageLayout';

const App = () => (
  <DownloadPageLayout>
    <DownloadButtons />
  </DownloadPageLayout>
);

export default App;
