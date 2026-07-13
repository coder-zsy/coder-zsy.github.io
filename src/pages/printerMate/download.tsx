import '@/locales/i18n';
import { useTranslation } from 'react-i18next';
import '../index.less';

import DownloadPageLayout from './DownloadPageLayout';
import { getStoreUrlByUserAgent } from './downloadLinks';

const App = () => {
  const { t } = useTranslation();

  const handleDownload = () => {
    window.location.href = getStoreUrlByUserAgent();
  };

  return (
    <DownloadPageLayout>
      <div className="download-buttons">
        <button onClick={handleDownload} className="download-smart">
          {t('DownloadInstall')}
        </button>
      </div>
    </DownloadPageLayout>
  );
};

export default App;
